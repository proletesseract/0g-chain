import { useState } from 'react';
import { ethers } from 'ethers';
import * as blockchain from '../utils/blockchain';
import { WalletState } from '../types';

export const useWallet = (
  provider: ethers.JsonRpcProvider | null,
  userWallet: ethers.Wallet | null
): WalletState & {
  createNewAddress: () => Promise<void>;
  sendTokensToNewAddress: (amount: number) => Promise<void>;
} => {
  const [state, setState] = useState<WalletState>({
    newWallet: null,
    newWalletBalance: '0',
  });

  const createNewAddress = async () => {
    try {
      const wallet = blockchain.createNewWallet();
      setState(prev => ({ ...prev, newWallet: wallet }));
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  };

  const sendTokensToNewAddress = async (amount: number) => {
    if (!state.newWallet || !userWallet || !provider) {
      throw new Error('Wallet or provider not initialized');
    }

    try {
      await blockchain.sendTokens(userWallet, state.newWallet.address, amount);
      const balance = await blockchain.getBalance(state.newWallet.address, provider);
      setState(prev => ({ ...prev, newWalletBalance: balance }));
    } catch (error) {
      console.error('Error sending tokens:', error);
      throw error;
    }
  };

  return {
    ...state,
    createNewAddress,
    sendTokensToNewAddress,
  };
}; 