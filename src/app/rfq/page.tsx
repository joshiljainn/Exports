import { redirect } from "next/navigation";

type RFQPageProps = {
  searchParams: Promise<{
    phone?: string;
    item?: string;
  }>;
};

export default async function RFQPage({ searchParams }: RFQPageProps) {
  const params = await searchParams;

  const phone = params.phone?.trim();
  const item = params.item?.trim();

  if (!phone || !item) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 px-4 text-slate-200">
        <p className="text-center text-base">Invalid RFQ Link parameters.</p>
      </main>
    );
  }

  const inquiry = `Hello, I am reaching out to request a formal quotation for your ${item}. Please let me know your current pricing, MOQs, and available terms.`;
  const targetUrl = `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(inquiry)}`;

  redirect(targetUrl);
}
