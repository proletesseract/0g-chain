import { useState } from 'react';
import { ethers } from 'ethers';
import * as blockchain from '../utils/blockchain';
import { ContractState } from '../types';

export const useContract = (
  provider: ethers.JsonRpcProvider | null,
  wallet: ethers.Wallet | null
): ContractState & {
  deployContract: () => Promise<void>;
  updateStoredValue: (value: number) => Promise<void>;
  refreshStoredValue: () => Promise<void>;
} => {
  const [state, setState] = useState<ContractState>({
    contract: null,
    contractAddress: '',
    storedValue: null,
  });

  const deployContract = async () => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }

    try {
      const contract = await blockchain.deploySimpleStorage(wallet);
      const address = await contract.getAddress();
      const value = await blockchain.getStoredValue(contract);

      setState({
        contract,
        contractAddress: address,
        storedValue: Number(value),
      });
    } catch (error) {
      console.error('Error deploying contract:', error);
      throw error;
    }
  };

  const updateStoredValue = async (value: number) => {
    if (!state.contract) {
      throw new Error('Contract not deployed');
    }

    try {
      await blockchain.setStoredValue(state.contract, value);
      await refreshStoredValue();
    } catch (error) {
      console.error('Error updating stored value:', error);
      throw error;
    }
  };

  const refreshStoredValue = async () => {
    if (!state.contract) {
      throw new Error('Contract not deployed');
    }

    try {
      const value = await blockchain.getStoredValue(state.contract);
      setState(prev => ({ ...prev, storedValue: Number(value) }));
    } catch (error) {
      console.error('Error refreshing stored value:', error);
      throw error;
    }
  };

  return {
    ...state,
    deployContract,
    updateStoredValue,
    refreshStoredValue,
  };
}; 