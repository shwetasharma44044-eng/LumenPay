import { RefreshCw } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { useState } from 'react';

interface BalanceDisplayProps {
  wallet: ReturnType<typeof useWallet>;
}

export const BalanceDisplay = ({ wallet }: BalanceDisplayProps) => {
  const { balance, refreshBalance, isConnected, error } = wallet;
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isConnected) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshBalance();
    setIsRefreshing(false);
  };

  return (
    <div className="card">
      <div className="flex-between">
        <div>
          <h2 className="text-muted">Available Balance (XLM)</h2>
          <div className="text-2xl" style={{ marginTop: '0.5rem' }}>
            {balance !== null ? balance : '---'}
          </div>
        </div>
        <button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          className="btn btn-outline"
          style={{ width: 'auto', padding: '0.5rem' }}
          title="Refresh Balance"
        >
          <RefreshCw size={18} className={isRefreshing ? 'loading-spinner' : ''} />
        </button>
      </div>
      
      {error && error.includes('Account not found') && (
        <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
          Account not found on Testnet. Please fund it using{' '}
          <a 
            href={`https://friendbot.stellar.org/?addr=${wallet.publicKey}`}
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: 'inherit', textDecoration: 'underline' }}
          >
            Friendbot
          </a>.
        </div>
      )}
    </div>
  );
};
