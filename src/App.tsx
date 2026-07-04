import { useState } from 'react';
import { WalletConnect } from './components/WalletConnect';
import { BalanceDisplay } from './components/BalanceDisplay';
import { PaymentForm } from './components/PaymentForm';
import { TxResult } from './components/TxResult';
import { useWallet } from './hooks/useWallet';
import type { TransactionResult } from './types';

function App() {
  const wallet = useWallet();
  const [txResult, setTxResult] = useState<TransactionResult>({ status: 'idle' });

  const handleTxSuccess = (hash: string) => {
    setTxResult({ status: 'success', hash });
  };

  const handleTxError = (errorMessage: string) => {
    setTxResult({ status: 'error', errorMessage });
  };

  const clearTxResult = () => {
    setTxResult({ status: 'idle' });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>LumenPay</h1>
        <p>A Simple Stellar Testnet dApp</p>
      </header>

      <main>
        <WalletConnect wallet={wallet} />
        <BalanceDisplay wallet={wallet} />
        
        {wallet.isConnected && wallet.balance !== null && (
           <PaymentForm 
             wallet={wallet} 
             onSuccess={handleTxSuccess} 
             onError={handleTxError} 
           />
        )}

        <TxResult result={txResult} onClear={clearTxResult} />
      </main>
    </div>
  );
}

export default App;
