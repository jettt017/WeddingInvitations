export type TransactionBank = "Mandiri" | "BRI" | "BCA";

export interface TransactionAccount {
  bank: TransactionBank;
  name: string;
  number: string;
}

export interface TransactionResponse {
  accounts: TransactionAccount[];
}

type TransactionEnvironment = Record<string, string | undefined>;

const ACCOUNT_ENVIRONMENT = [
  {
    bank: "Mandiri",
    name: "WEDDING_MANDIRI_ACCOUNT_NAME",
    number: "WEDDING_MANDIRI_ACCOUNT_NUMBER",
  },
  {
    bank: "BRI",
    name: "WEDDING_BRI_ACCOUNT_NAME",
    number: "WEDDING_BRI_ACCOUNT_NUMBER",
  },
  {
    bank: "BCA",
    name: "WEDDING_BCA_ACCOUNT_NAME",
    number: "WEDDING_BCA_ACCOUNT_NUMBER",
  },
] as const satisfies ReadonlyArray<{
  bank: TransactionBank;
  name: string;
  number: string;
}>;

export function readTransactionAccounts(
  environment: TransactionEnvironment
): TransactionAccount[] | null {
  const accounts = ACCOUNT_ENVIRONMENT.map(({ bank, name, number }) => ({
    bank,
    name: environment[name]?.trim() ?? "",
    number: environment[number]?.trim() ?? "",
  }));

  return accounts.every((account) => account.name && account.number) ? accounts : null;
}
