import "server-only";

import { NextResponse } from "next/server";

import type { TransactionResponse } from "@/lib/transaction";

const response: TransactionResponse = {
  accounts: [
    {
      bank: "Mandiri",
      name: "FAIZ ARDYSYAHPUTRA",
      number: "***REMOVED***",
    },
    {
      bank: "BRI",
      name: "FAIZ ARDYSYAHPUTRA",
      number: "***REMOVED***",
    },
    {
      bank: "BCA",
      name: "PRAMESTHI WAHYURING KINASIH",
      number: "***REMOVED***",
    },
  ],
};

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
