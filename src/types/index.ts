export interface WalletState {
  publicKey: string | null;
  balance: string | null;
  isConnected: boolean;
  isFreighterInstalled: boolean;
  network: string | null;
  error: string | null;
}

export interface TransactionResult {
  status: 'idle' | 'pending' | 'success' | 'error';
  hash?: string;
  errorMessage?: string;
}
