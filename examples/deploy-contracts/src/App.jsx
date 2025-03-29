import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StatusCard from './components/StatusCard';
import TutorialStep from './components/TutorialStep';
import TutorialPanel from './components/TutorialPanel';
import * as blockchain from './utils/blockchain';
import { ethers } from 'ethers';

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0;
`;

const Header = styled.header`
  margin-bottom: 32px;
  text-align: center;
  padding: 20px 0;
`;

const Title = styled.h1`
  margin-bottom: 8px;
`;

const Description = styled.p`
  color: #6b7280;
  font-size: 1.1rem;
  
  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

// Three column layout with equal width columns and explicit padding
const ThreeColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  
  @media (max-width: 1400px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-x: hidden;
  padding-top: 0;
  margin-top: 0;
`;

const MiddleColumn = styled.div`
  position: relative;
  min-width: 0;
  width: 100%;
`;

const RightColumn = styled.div`
  min-width: 0;
  width: 100%;
  /* Using the correct header height of 210px */
  height: calc(100vh - 210px);
  position: relative;
  
  @media (max-width: 1400px) {
    display: none;
  }
`;

const StickyPanel = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
  padding-top: 0;
  margin-top: 0;
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const ErrorBox = styled.div`
  background-color: #fef2f2;
  color: #b91c1c;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #f87171;
  
  @media (prefers-color-scheme: dark) {
    background-color: #7f1d1d;
    color: #fca5a5;
    border-color: #ef4444;
  }
`;

// Make the StickyPanel in the right column height-constrained too
const RightStickyPanel = styled(StickyPanel)`
  height: 100%;
  overflow: hidden;
`;

function App() {
  const [connected, setConnected] = useState(false);
  const [blockHeight, setBlockHeight] = useState(null);
  const [userWallet, setUserWallet] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  
  const [newWallet, setNewWallet] = useState(null);
  const [newWalletBalance, setNewWalletBalance] = useState('0');
  
  const [contract, setContract] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [storedValue, setStoredValue] = useState(null);
  
  const [activeStep, setActiveStep] = useState(0);
  const [stepStatus, setStepStatus] = useState([
    { completed: false, loading: false, result: '', resultType: '' },
    { completed: false, loading: false, result: '', resultType: '' },
    { completed: false, loading: false, result: '', resultType: '' },
    { completed: false, loading: false, result: '', resultType: '' },
  ]);
  
  // Initialize connection to blockchain
  useEffect(() => {
    const init = async () => {
      try {
        // Get provider
        const ethProvider = await blockchain.getProvider();
        setProvider(ethProvider);
        setConnected(true);
        setError('');
        
        // Get block height
        const height = await blockchain.getBlockNumber(ethProvider);
        setBlockHeight(height);
        
        // Get user wallet
        const wallet = await blockchain.getDefaultUserWallet();
        setUserWallet(wallet);
        
        // Get user balance
        const balance = await blockchain.getBalance(wallet.address, ethProvider);
        setUserBalance(balance);
        
        // Set 5 second interval to update block height
        const interval = setInterval(async () => {
          try {
            const height = await blockchain.getBlockNumber(ethProvider);
            setBlockHeight(height);
          } catch (error) {
            console.error('Error updating block height:', error);
          }
        }, 5000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error('Initialization error:', error);
        setConnected(false);
        setError('Failed to connect to the blockchain. Please make sure the local testnet is running by executing "./localtestnet.sh" in a terminal window.');
      }
    };
    
    init();
  }, []);
  
  // Step 1: Create new wallet
  const createNewAddress = async () => {
    updateStepStatus(0, true, '', '');
    
    try {
      // Create new wallet
      const wallet = blockchain.createNewWallet();
      setNewWallet(wallet);
      
      updateStepStatus(
        0, 
        false, 
        `New wallet created with address: ${wallet.address}${wallet.mnemonic?.phrase ? `\n\nMnemonic: ${wallet.mnemonic.phrase}\n\nPlease save this mnemonic phrase securely.` : ''}`, 
        'success'
      );
      
      // Mark step as completed and move to next step
      completeStep(0);
    } catch (error) {
      updateStepStatus(0, false, `Error creating wallet: ${error.message}`, 'error');
    }
  };
  
  // Step 2: Send tokens to new address
  const sendTokensToNewAddress = async () => {
    if (!newWallet) {
      updateStepStatus(1, false, 'Please create a new wallet first', 'error');
      return;
    }
    
    updateStepStatus(1, true, '', '');
    
    try {
      // Send 1000 ua0gi tokens from user wallet to new wallet
      const receipt = await blockchain.sendTokens(userWallet, newWallet.address, 1000);
      
      // Get new balance
      const balance = await blockchain.getBalance(newWallet.address, provider);
      setNewWalletBalance(balance);
      
      // Update user balance
      const userBalanceUpdated = await blockchain.getBalance(userWallet.address, provider);
      setUserBalance(userBalanceUpdated);
      
      updateStepStatus(
        1, 
        false, 
        `Successfully sent 1000 ua0gi to ${newWallet.address}${receipt.hash ? `\nTransaction hash: ${receipt.hash}` : ''}${receipt.blockNumber ? `\nBlock: ${receipt.blockNumber}` : ''}`, 
        'success'
      );
      
      // Mark step as completed and move to next step
      completeStep(1);
    } catch (error) {
      updateStepStatus(1, false, `Error sending tokens: ${error.message}`, 'error');
    }
  };
  
  // Step 3: Deploy contract
  const deployContract = async () => {
    updateStepStatus(2, true, '', '');
    
    try {
      // Get current gas price for better estimation
      const gasPrice = await provider.getFeeData().then(data => data.gasPrice);
      
      // Deploy the SimpleStorage contract
      const factory = new ethers.ContractFactory(
        blockchain.SIMPLE_STORAGE_ABI,
        blockchain.SIMPLE_STORAGE_BYTECODE,
        userWallet
      );
      
      const deployedContract = await factory.deploy({
        gasLimit: 2000000, // Higher gas limit for deployment
        gasPrice: gasPrice || ethers.parseUnits('10', 'gwei')
      });
      
      // Wait for deployment to complete
      await deployedContract.waitForDeployment();
      
      const address = await deployedContract.getAddress();
      setContractAddress(address);
      setContract(deployedContract);
      
      // Update user balance after deployment (gas fees used)
      const userBalanceUpdated = await blockchain.getBalance(userWallet.address, provider);
      setUserBalance(userBalanceUpdated);
      
      // Get initial contract value
      try {
        const initialValue = await deployedContract.get({ gasLimit: 100000 });
        setStoredValue(initialValue);
      } catch (getError) {
        // Contract may not have initialized value yet
      }
      
      updateStepStatus(
        2, 
        false, 
        `SimpleStorage contract deployed successfully!\nContract address: ${address}`, 
        'success'
      );
      
      // Mark step as completed and move to next step
      completeStep(2);
    } catch (error) {
      updateStepStatus(2, false, `Error deploying contract: ${error.message}`, 'error');
    }
  };
  
  // Step 4: Update contract value
  const updateStoredValue = async () => {
    if (!contract || !contractAddress) {
      updateStepStatus(3, false, 'Please deploy the contract first', 'error');
      return;
    }
    
    updateStepStatus(3, true, '', '');
    
    try {
      // Generate a random value between 1 and 1,000,000
      const newValue = blockchain.generateRandomValue();
      
      // Get current gas price for better estimation
      const gasPrice = await provider.getFeeData().then(data => data.gasPrice);
      
      // Call the set function on the contract
      const tx = await contract.set(BigInt(newValue), {
        gasLimit: 1000000,
        gasPrice: gasPrice || ethers.parseUnits('10', 'gwei')
      });
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      // Get the updated value from the contract
      const updatedValue = await contract.get({ gasLimit: 100000 });
      setStoredValue(updatedValue);
      
      updateStepStatus(
        3,
        false,
        `Successfully updated the stored value to ${updatedValue}!\nTransaction hash: ${tx.hash}\nBlock: ${receipt.blockNumber}`,
        'success'
      );
      
      // Mark step as completed - this is the final step
      completeStep(3, true);
    } catch (error) {
      updateStepStatus(3, false, `Error updating contract value: ${error.message}`, 'error');
    }
  };
  
  // Helper function to update step status
  const updateStepStatus = (stepIndex, loading, result, resultType) => {
    setStepStatus(prev => {
      const newStatus = [...prev];
      newStatus[stepIndex] = {
        ...newStatus[stepIndex],
        loading,
        result,
        resultType
      };
      return newStatus;
    });
  };
  
  // Helper function to mark a step as completed and move to next step
  const completeStep = (stepIndex, isFinalStep = false) => {
    setStepStatus(prev => {
      const newStatus = [...prev];
      newStatus[stepIndex] = {
        ...newStatus[stepIndex],
        completed: true
      };
      return newStatus;
    });
    
    // Move to next step if not on the last step
    if (!isFinalStep && stepIndex < 3) {
      setActiveStep(stepIndex + 1);
    }
  };
  
  // Define tutorial steps
  const tutorialSteps = [
    {
      title: 'Create New Address',
      description: 'Generate a new Ethereum wallet address. This will create a random private key and address for testing purposes.',
      actionLabel: 'Create New Address',
      onAction: createNewAddress
    },
    {
      title: 'Send Tokens',
      description: 'Send 1000 ua0gi tokens from your user account to the newly created address.',
      actionLabel: 'Send 1000 ua0gi',
      onAction: sendTokensToNewAddress
    },
    {
      title: 'Deploy SimpleStorage Contract',
      description: 'Deploy the SimpleStorage smart contract to the blockchain from your user account.',
      actionLabel: 'Deploy Contract',
      onAction: deployContract
    },
    {
      title: 'Update Stored Value',
      description: 'Set a random value in the SimpleStorage contract to test its functionality.',
      actionLabel: 'Update Value',
      onAction: updateStoredValue
    }
  ];
  
  return (
    <Container>
      <Header>
        <Title>0G Chain Deploy Tutorial</Title>
        <Description>
          Walk through the process of creating a wallet, transferring tokens, and deploying and interacting with a smart contract.
        </Description>
      </Header>
      
      {error && (
        <ErrorBox>
          <strong>Error:</strong> {error}
        </ErrorBox>
      )}
      
      <ThreeColumnLayout>
        <LeftColumn>
          <StickyPanel>
            <StatusCard
              connected={connected}
              blockHeight={blockHeight}
              userAddress={userWallet?.address}
              userBalance={userBalance}
              newAddress={newWallet?.address}
              newBalance={newWalletBalance}
              contractAddress={contractAddress}
              storedValue={storedValue}
            />
          </StickyPanel>
        </LeftColumn>
        
        <MiddleColumn>
          <Steps>
            {tutorialSteps.map((step, index) => (
              <TutorialStep
                key={index}
                stepNumber={index + 1}
                title={step.title}
                description={step.description}
                active={activeStep === index}
                disabled={!connected || activeStep < index}
                completed={stepStatus[index].completed}
                loading={stepStatus[index].loading}
                result={stepStatus[index].result}
                resultType={stepStatus[index].resultType}
                onAction={step.onAction}
                actionLabel={step.actionLabel}
              />
            ))}
          </Steps>
        </MiddleColumn>
        
        <RightColumn>
          <RightStickyPanel>
            <TutorialPanel />
          </RightStickyPanel>
        </RightColumn>
      </ThreeColumnLayout>
    </Container>
  );
}

export default App; 