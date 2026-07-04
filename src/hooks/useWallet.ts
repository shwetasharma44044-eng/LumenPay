import { useState, useEffect, useCallback } from 'react';
import { 
  isConnected as freighterIsConnected, 
  isAllowed as freighterIsAllowed, 
  requestAccess, 
  getAddress,
  getNetworkDetails
} from '@stellar/freighter-api';
import type { WalletState } from '../types';
import { getAccountBalance } from '../services/stellarService';

export const useWallet = () => {
  const [state, setState] = useState<WalletState>({
    publicKey: null,
    balance: null,
    isConnected: false,
    isFreighterInstalled: false,
    network: null,
    error: null,
  });

  const [isLoading, setIsLoading] = useState(true);

  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      const isInstalled = await freighterIsConnected();
      
      if (!isInstalled) {
        setState(s => ({ ...s, isFreighterInstalled: false }));
        return;
      }

      const networkDetails = await getNetworkDetails();
      
      const isAllowed = await freighterIsAllowed();
      
      if (isAllowed) {
        const { address: publicKey } = await getAddress();
        
        let balance = null;
        let error = null;
        try {
           balance = await getAccountBalance(publicKey);
        } catch (e: any) {
           error = e.message;
        }

        setState({
          publicKey,
          balance,
          isConnected: true,
          isFreighterInstalled: true,
          network: networkDetails.network,
          error,
        });
      } else {
        setState(s => ({ ...s, isFreighterInstalled: true, isConnected: false }));
      }
    } catch (error: any) {
      console.error('Error checking connection:', error);
      setState(s => ({ ...s, error: error.message }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  const connect = async () => {
    try {
      setIsLoading(true);
      setState(s => ({ ...s, error: null }));
      
      const access = await requestAccess();
      if (access) {
        await checkConnection();
      } else {
         setState(s => ({ ...s, error: 'User rejected the connection request.' }));
      }
    } catch (error: any) {
      setState(s => ({ ...s, error: error.message }));
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    // Freighter doesn't have a direct "disconnect" API that revokes permissions.
    // We clear the local state to simulate disconnection.
    setState({
      publicKey: null,
      balance: null,
      isConnected: false,
      isFreighterInstalled: true,
      network: null,
      error: null,
    });
  };

  const refreshBalance = async () => {
    if (state.publicKey) {
       try {
           const balance = await getAccountBalance(state.publicKey);
           setState(s => ({ ...s, balance, error: null }));
       } catch (e: any) {
           setState(s => ({ ...s, balance: null, error: e.message }));
       }
    }
  };

  return {
    ...state,
    isLoading,
    connect,
    disconnect,
    refreshBalance,
  };
};
