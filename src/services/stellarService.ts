import { Horizon, TransactionBuilder, Networks, Asset, Operation, Transaction } from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = import.meta.env.VITE_NETWORK_PASSPHRASE || Networks.TESTNET;

const server = new Horizon.Server(HORIZON_URL);

export const getAccountBalance = async (publicKey: string): Promise<string> => {
  try {
    const account = await server.loadAccount(publicKey);
    const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
    return xlmBalance ? xlmBalance.balance : '0';
  } catch (error: any) {
    if (error?.response?.status === 404) {
      throw new Error('Account not found on the testnet. Please fund it first using Friendbot.');
    }
    throw new Error(error?.message || 'Failed to fetch account balance');
  }
};

export const submitPayment = async (
  senderPublicKey: string,
  receiverPublicKey: string,
  amount: string
) => {
  if (parseFloat(amount) <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  try {
    const sourceAccount = await server.loadAccount(senderPublicKey);

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100', // Basic fee
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(
        Operation.payment({
          destination: receiverPublicKey,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(30)
      .build();

    const result = await signTransaction(transaction.toXDR(), {
      networkPassphrase: NETWORK_PASSPHRASE,
    });

    if (result.error) {
      throw new Error(result.error);
    }

    const txToSubmit = TransactionBuilder.fromXDR(result.signedTxXdr, NETWORK_PASSPHRASE);
    const response = await server.submitTransaction(txToSubmit as Transaction);
    
    return response;
  } catch (error: any) {
    if (error?.response?.data?.extras?.result_codes) {
      const codes = error.response.data.extras.result_codes;
      throw new Error(`Transaction failed: ${codes.transaction} ${codes.operations ? codes.operations.join(',') : ''}`);
    }
    throw new Error(error?.message || 'Transaction failed');
  }
};
