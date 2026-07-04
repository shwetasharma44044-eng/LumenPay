import { Wallet } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';

interface WalletConnectProps {
  wallet: ReturnType<typeof useWallet>;
}

export const WalletConnect = ({ wallet }: WalletConnectProps) => {
  const { isConnected, isFreighterInstalled, publicKey, connect, disconnect, isLoading, error, network } = wallet;

  if (!isFreighterInstalled) {
    return (
      <div className="card">
        <div className="alert alert-danger">
          Freighter extension is not installed. Please install it from{' '}
          <a href="https://freighter.app/" target="_blank" rel="noopener noreferrer" style={{color: 'inherit'}}>
            freighter.app
          </a>
        </div>
      </div>
    );
  }

  const shortKey = publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : '';

  return (
    <div className="card">
      <div className="flex-between">
        <div>
          <h2 className="text-2xl" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
            Wallet Connection
          </h2>
          {isConnected && (
            <p className="text-muted">
              Connected: <span style={{ color: 'var(--text-main)' }}>{shortKey}</span>
            </p>
          )}
          {network && (
             <span className="badge" style={{ marginTop: '0.5rem' }}>Network: {network}</span>
          )}
        </div>
        
        {isConnected ? (
          <button onClick={disconnect} className="btn btn-outline" style={{ width: 'auto' }}>
            Disconnect
          </button>
        ) : (
          <button 
            onClick={connect} 
            disabled={isLoading} 
            className="btn btn-primary"
            style={{ width: 'auto' }}
          >
            <Wallet size={18} />
            {isLoading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};
