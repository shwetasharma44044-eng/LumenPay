import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { submitPayment } from '../services/stellarService';
import { useWallet } from '../hooks/useWallet';

interface PaymentFormProps {
  wallet: ReturnType<typeof useWallet>;
  onSuccess: (hash: string) => void;
  onError: (error: string) => void;
}

export const PaymentForm = ({ wallet, onSuccess, onError }: PaymentFormProps) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isConnected, publicKey, balance } = wallet;

  if (!isConnected || !publicKey || balance === null) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    if (parseFloat(amount) <= 0) {
      onError('Amount must be greater than 0');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      onError('Insufficient balance');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitPayment(publicKey, recipient, amount);
      onSuccess(response.hash);
      setRecipient('');
      setAmount('');
      wallet.refreshBalance();
    } catch (err: any) {
      onError(err.message || 'Transaction failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Send Payment</h2>
      
      <form onSubmit={handleSubmit} className="flex-col">
        <div className="form-group">
          <label htmlFor="recipient">Recipient Public Key</label>
          <input
            id="recipient"
            type="text"
            className="input"
            placeholder="G..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount (XLM)</label>
          <input
            id="amount"
            type="number"
            step="0.0000001"
            min="0.0000001"
            className="input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting || !recipient || !amount}
          style={{ marginTop: '0.5rem' }}
        >
          {isSubmitting ? (
             <><Loader2 className="loading-spinner" size={18} /> Processing...</>
          ) : (
             <><Send size={18} /> Send XLM</>
          )}
        </button>
      </form>
    </div>
  );
};
