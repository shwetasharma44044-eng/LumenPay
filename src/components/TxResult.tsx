import { CheckCircle2, XCircle } from 'lucide-react';
import type { TransactionResult } from '../types';

interface TxResultProps {
  result: TransactionResult;
  onClear: () => void;
}

export const TxResult = ({ result, onClear }: TxResultProps) => {
  if (result.status === 'idle' || result.status === 'pending') return null;

  return (
    <div className="card" style={{ position: 'relative' }}>
      <button 
        onClick={onClear}
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '1.25rem'
        }}
      >
        &times;
      </button>

      {result.status === 'success' && (
        <div style={{ textAlign: 'center' }}>
          <CheckCircle2 size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--success)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Transaction Successful</h3>
          <p className="text-muted" style={{ marginBottom: '1rem' }}>
            Your payment has been submitted to the Stellar Testnet.
          </p>
          <a 
            href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            View on Stellar Expert
          </a>
        </div>
      )}

      {result.status === 'error' && (
        <div style={{ textAlign: 'center' }}>
          <XCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ color: 'var(--danger)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Transaction Failed</h3>
          <div className="alert alert-danger" style={{ marginTop: '1rem', textAlign: 'left' }}>
            {result.errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};
