import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type ScanRequest = {
  companyName: string;
  domain: string;
  paymentTerms: string;
  country: string;
};

type ScanResult = {
  trust_score: number;
  risk_level: "Low" | "Medium" | "High" | "Extreme";
  red_flags: string[];
  green_flags: string[];
  verdict_summary: string;
};

type RdapEvent = {
  eventAction?: string;
  eventDate?: string;
};

type RdapResponse = {
  events?: RdapEvent[];
};

const ALLOWED_RISK_LEVELS = new Set(["Low", "Medium", "High", "Extreme"]);

function normalizeDomain(input: string): string {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Domain is required.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProtocol);

  return parsed.hostname.replace(/^www\./i, "").toLowerCase();
}

function extractRegistrationDate(data: RdapResponse): string | null {
  if (!Array.isArray(data.events)) {
    return null;
  }

  const registrationEvent = data.events.find((event) => {
    const action = event.eventAction?.toLowerCase() ?? "";
    return action === "registration" || action === "registered";
  });

  const candidateDate = registrationEvent?.eventDate;

  if (!candidateDate) {
    return null;
  }

  const parsedDate = new Date(candidateDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
}

function calculateDomainAgeDays(registrationDate: string | null): number | null {
  if (!registrationDate) {
    return null;
  }

  const now = Date.now();
  const registeredAt = new Date(registrationDate).getTime();

  if (Number.isNaN(registeredAt)) {
    return null;
  }

  const diffMs = now - registeredAt;
  return diffMs > 0 ? Math.floor(diffMs / (1000 * 60 * 60 * 24)) : 0;
}

function sanitizeScanResult(value: unknown): ScanResult {
  if (!value || typeof value !== "object") {
    throw new Error("Invalid LLM JSON response.");
  }

  const payload = value as Record<string, unknown>;
  const rawScore = Number(payload.trust_score);
  const trust_score = Number.isFinite(rawScore)
    ? Math.max(0, Math.min(100, Math.round(rawScore)))
    : 0;

  const rawRiskLevel = typeof payload.risk_level === "string" ? payload.risk_level : "High";
  const risk_level = ALLOWED_RISK_LEVELS.has(rawRiskLevel)
    ? (rawRiskLevel as ScanResult["risk_level"])
    : "High";

  const red_flags = Array.isArray(payload.red_flags)
    ? payload.red_flags.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  const green_flags = Array.isArray(payload.green_flags)
    ? payload.green_flags.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];

  const verdict_summary =
    typeof payload.verdict_summary === "string" && payload.verdict_summary.trim().length > 0
      ? payload.verdict_summary.trim()
      : "Insufficient confidence to clear this buyer. Proceed only after independent bank and trade reference verification.";

  return {
    trust_score,
    risk_level,
    red_flags,
    green_flags,
    verdict_summary,
  };
}

async function fetchDomainAge(domain: string): Promise<{
  registrationDate: string | null;
  domainAgeDays: number | null;
  domainAgeNote: string;
}> {
  try {
    const response = await fetch(`https://rdap.org/domain/${domain}`, {
      method: "GET",
      headers: {
        Accept: "application/rdap+json, application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`RDAP lookup failed with status ${response.status}`);
    }

    const rdapData = (await response.json()) as RdapResponse;
    const registrationDate = extractRegistrationDate(rdapData);
    const domainAgeDays = calculateDomainAgeDays(registrationDate);

    if (!registrationDate || domainAgeDays === null) {
      return {
        registrationDate: null,
        domainAgeDays: null,
        domainAgeNote: "Domain age unknown",
      };
    }

    return {
      registrationDate,
      domainAgeDays,
      domainAgeNote: `Domain age ${domainAgeDays} days`,
    };
  } catch {
    return {
      registrationDate: null,
      domainAgeDays: null,
      domainAgeNote: "Domain age unknown",
    };
  }
}

async function callGroq(input: {
  companyName: string;
  domain: string;
  paymentTerms: string;
  country: string;
  registrationDate: string | null;
  domainAgeDays: number | null;
  domainAgeNote: string;
}): Promise<ScanResult> {
  const groqApiKey = process.env.GROQ_API_KEY;

  if (!groqApiKey) {
    throw new Error("Missing GROQ_API_KEY.");
  }

  const systemPrompt =
    "You are a ruthless, highly experienced Trade Finance Officer advising Indian exporters. Analyze the provided buyer data. Domains less than 1 year old are high risk. Payment terms offering 100% CAD or LC with unverified banks with zero advance are massive red flags for UAE/African buyers. Output ONLY valid JSON containing: 1. trust_score (number 0-100), 2. risk_level (string: Low, Medium, High, Extreme), 3. red_flags (array of strings), 4. green_flags (array of strings), 5. verdict_summary (a punchy 2-sentence final advice).";

  const userPayload = {
    company_name: input.companyName,
    domain: input.domain,
    payment_terms: input.paymentTerms,
    buyer_country: input.country,
    enrichment: {
      rdap_registration_date: input.registrationDate,
      domain_age_days: input.domainAgeDays,
      domain_age_note: input.domainAgeNote,
    },
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqApiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      temperature: 0.15,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  const completion = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned empty content.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Groq content was not valid JSON.");
  }

  return sanitizeScanResult(parsed);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ScanRequest>;

    const companyName = body.companyName?.trim();
    const paymentTerms = body.paymentTerms?.trim();
    const country = body.country?.trim();
    const domain = body.domain ? normalizeDomain(body.domain) : "";

    if (!companyName || !paymentTerms || !country || !domain) {
      return NextResponse.json(
        { error: "companyName, domain, paymentTerms, and country are required." },
        { status: 400 },
      );
    }

    const domainIntel = await fetchDomainAge(domain);

    const scan = await callGroq({
      companyName,
      domain,
      paymentTerms,
      country,
      registrationDate: domainIntel.registrationDate,
      domainAgeDays: domainIntel.domainAgeDays,
      domainAgeNote: domainIntel.domainAgeNote,
    });

    const { error: insertError } = await supabase.from("trust_reports").insert({
      company_name: companyName,
      domain,
      payment_terms: paymentTerms,
      country,
      trust_score: scan.trust_score,
      risk_level: scan.risk_level,
      raw_llm_output: {
        ...scan,
        enrichment: {
          registration_date: domainIntel.registrationDate,
          domain_age_days: domainIntel.domainAgeDays,
          domain_age_note: domainIntel.domainAgeNote,
        },
      },
    });

    if (insertError) {
      throw new Error(`Supabase insert failed: ${insertError.message}`);
    }

    return NextResponse.json(
      {
        ...scan,
        enrichment: {
          registrationDate: domainIntel.registrationDate,
          domainAgeDays: domainIntel.domainAgeDays,
          domainAgeNote: domainIntel.domainAgeNote,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error.";

    return NextResponse.json(
      {
        error: "Scan failed.",
        details: message,
      },
      { status: 500 },
    );
  }
}
