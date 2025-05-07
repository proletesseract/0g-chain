import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import * as blockchain from '../utils/blockchain';
import { BlockchainState } from '../types';

export const useBlockchain = (): BlockchainState & {
  refreshBlockHeight: () => Promise<void>;
  refreshBalance: () => Promise<void>;
} => {
  const [state, setState] = useState<BlockchainState>({
    connected: false,
    blockHeight: 'Unknown',
    userWallet: null,
    userBalance: null,
    provider: null,
    error: '',
  });

  const refreshBlockHeight = async () => {
    if (!state.provider) return;
    try {
      const height = await blockchain.getBlockNumber(state.provider);
      setState(prev => ({ ...prev, blockHeight: height }));
    } catch (error) {
      console.error('Error updating block height:', error);
    }
  };

  const refreshBalance = async () => {
    if (!state.provider || !state.userWallet) return;
    try {
      const balance = await blockchain.getBalance(state.userWallet.address, state.provider);
      setState(prev => ({ ...prev, userBalance: balance }));
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const provider = await blockchain.getProvider();
        const wallet = await blockchain.getDefaultUserWallet();
        const balance = await blockchain.getBalance(wallet.address, provider);
        const height = await blockchain.getBlockNumber(provider);

        setState({
          connected: true,
          blockHeight: height,
          userWallet: wallet,
          userBalance: balance,
          provider,
          error: '',
        });

        // Set up polling for block height
        const interval = setInterval(refreshBlockHeight, 5000);
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Initialization error:', error);
        setState(prev => ({
          ...prev,
          connected: false,
          error: 'Failed to connect to the blockchain. Please make sure the local testnet is running by executing "./localtestnet.sh" in a terminal window.',
        }));
      }
    };

    init();
  }, []);

  return {
    ...state,
    refreshBlockHeight,
    refreshBalance,
  };
}; 