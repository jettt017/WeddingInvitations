export type TransactionBank = "Mandiri" | "BRI" | "BCA";

export interface TransactionAccount {
  bank: TransactionBank;
  name: string;
  number: string;
}

export interface TransactionResponse {
  accounts: TransactionAccount[];
}
