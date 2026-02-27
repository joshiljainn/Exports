import { NextResponse } from "next/server";

const SLEEP_MESSAGE =
  "Kivaro scan engine is temporarily disabled for this deployment. The member directory remains fully active.";

export async function POST() {
  return NextResponse.json(
    {
      error: "Scanner disabled",
      details: SLEEP_MESSAGE,
      status: "sleep",
    },
    { status: 503 },
  );
}

export async function GET() {
  return NextResponse.json(
    {
      message: SLEEP_MESSAGE,
      status: "sleep",
    },
    { status: 200 },
  );
}
