import { ethers } from 'ethers';

export interface StepStatus {
  completed: boolean;
  loading: boolean;
  result: string;
  resultType: 'success' | 'error' | 'info' | '';
}

export interface BlockchainState {
  connected: boolean;
  blockHeight: number | string;
  userWallet: ethers.Wallet | null;
  userBalance: string | null;
  provider: ethers.JsonRpcProvider | null;
  error: string;
}

export interface WalletState {
  newWallet: ethers.Wallet | null;
  newWalletBalance: string;
}

export interface ContractState {
  contract: ethers.Contract | null;
  contractAddress: string;
  storedValue: number | null;
}

export interface AppState extends BlockchainState, WalletState, ContractState {
  activeStep: number;
  stepStatus: StepStatus[];
} 