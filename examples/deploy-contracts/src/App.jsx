import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import StatusCard from './components/StatusCard';
import TutorialStep from './components/TutorialStep';
import * as blockchain from './utils/blockchain';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 32px;
  text-align: center;
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

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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
      console.error('Error creating new wallet:', error);
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
      console.error('Error sending tokens:', error);
      updateStepStatus(1, false, `Error sending tokens: ${error.message}`, 'error');
    }
  };
  
  // Step 3: Deploy contract
  const deployContract = async () => {
    updateStepStatus(2, true, '', '');
    
    try {
      // Deploy the SimpleStorage contract
      const deployedContract = await blockchain.deploySimpleStorage(userWallet);
      console.log("Contract deployed:", deployedContract);
      
      const address = await deployedContract.getAddress();
      console.log(`Contract address: ${address}`);
      
      setContractAddress(address);
      setContract(deployedContract);
      
      // Update user balance
      const userBalanceUpdated = await blockchain.getBalance(userWallet.address, provider);
      setUserBalance(userBalanceUpdated);
      
      // Verify contract works by calling get()
      try {
        const initialValue = await deployedContract.get();
        console.log(`Initial contract value: ${initialValue}`);
        setStoredValue(initialValue);
      } catch (getError) {
        console.error("Error getting initial value:", getError);
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
      console.error('Error deploying contract:', error);
      updateStepStatus(2, false, `Error deploying contract: ${error.message}`, 'error');
    }
  };
  
  // Step 4: Update stored value
  const updateStoredValue = async () => {
    if (!contractAddress) {
      updateStepStatus(3, false, 'Please deploy the contract first', 'error');
      return;
    }
    
    updateStepStatus(3, true, '', '');
    
    try {
      // Make sure we have a valid contract instance
      let currentContract = contract;
      
      // If the contract instance seems problematic, recreate it from the address
      if (!currentContract || !currentContract.runner) {
        console.log("Re-creating contract instance from address");
        currentContract = blockchain.getSimpleStorage(contractAddress, userWallet);
        
        // Store the recreated contract instance
        setContract(currentContract);
      }
      
      // Double-check the contract instance
      if (!currentContract) {
        throw new Error("Unable to get a valid contract instance");
      }
      
      // Verify contract is properly connected
      const contractAddr = await currentContract.getAddress();
      console.log(`Contract address: ${contractAddr}`);
      console.log(`User wallet address: ${userWallet.address}`);
      
      // Generate random value
      const randomValue = blockchain.generateRandomValue();
      console.log(`Attempting to set value to: ${randomValue}`);
      
      // Update stored value with more detailed logging
      const receipt = await blockchain.setStoredValue(currentContract, randomValue);
      console.log('Transaction receipt:', receipt);
      
      // Get the updated value after a short delay to allow the blockchain to update
      setTimeout(async () => {
        try {
          const updatedValue = await blockchain.getStoredValue(currentContract);
          console.log(`Retrieved updated value: ${updatedValue}`);
          setStoredValue(updatedValue);
        } catch (getError) {
          console.error('Error retrieving updated value:', getError);
        }
      }, 2000);
      
      updateStepStatus(
        3, 
        false, 
        `Successfully updated stored value to ${randomValue}${receipt.hash ? `\nTransaction hash: ${receipt.hash}` : ''}${receipt.blockNumber ? `\nBlock: ${receipt.blockNumber}` : ''}`, 
        'success'
      );
      
      // Mark step as completed
      completeStep(3);
    } catch (error) {
      console.error('Error updating stored value:', error);
      
      // Get a more detailed error message
      const errorMessage = error.reason || error.message || String(error);
      const errorData = error.data ? `\nError data: ${error.data}` : '';
      const errorCode = error.code ? `\nError code: ${error.code}` : '';
      const txHash = error.receipt?.hash ? `\nTransaction hash: ${error.receipt.hash}` : '';
      
      updateStepStatus(
        3, 
        false, 
        `Error updating stored value: ${errorMessage}${errorCode}${errorData}${txHash}`, 
        'error'
      );
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
  const completeStep = (stepIndex) => {
    setStepStatus(prev => {
      const newStatus = [...prev];
      newStatus[stepIndex] = {
        ...newStatus[stepIndex],
        completed: true
      };
      return newStatus;
    });
    
    // Move to next step if not on the last step
    if (stepIndex < 3) {
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
      description: 'Update the stored value in the contract to a random integer between 1 and 1 million.',
      actionLabel: 'Update Value',
      onAction: updateStoredValue,
      secondaryActionLabel: 'Update Again',
      onSecondaryAction: updateStoredValue
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
            secondaryActionLabel={step.secondaryActionLabel}
            onSecondaryAction={step.onSecondaryAction}
          />
        ))}
      </Steps>
    </Container>
  );
}

export default App; 