export interface TokenInfo {
  mint: string;
  name: string;
  symbol: string;
  balance: number;
  decimals: number;
  logo?: string;
}

export interface NftInfo {
  mint: string;
  name: string;
  collection?: string;
  image?: string;
  uri?: string;
}

export interface TransactionInfo {
  signature: string;
  date: string;
  type: "send" | "receive" | "unknown";
  amount: number;
  status: "confirmed" | "failed" | "pending";
}

export interface WalletState {
  address: string;
  solBalance: number | null;
  tokens: TokenInfo[];
  nfts: NftInfo[];
  transactions: TransactionInfo[];
  loading: boolean;
  error: string;
}
