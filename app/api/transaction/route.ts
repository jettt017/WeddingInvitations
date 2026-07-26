import "server-only";

import { NextResponse } from "next/server";

import { readTransactionAccounts } from "@/lib/transaction";

export const dynamic = "force-dynamic";

export function GET() {
  const accounts = readTransactionAccounts(process.env);
  const headers = {
    "Cache-Control": "private, no-store",
  };

  if (!accounts) {
    return NextResponse.json(
      { error: "Transaction details are not configured." },
      {
        status: 503,
        headers,
      }
    );
  }

  return NextResponse.json(
    { accounts },
    {
      headers: {
        ...headers,
      },
    }
  );
}
