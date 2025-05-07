import React from 'react';
import styled from 'styled-components';
import StatusCard from './components/StatusCard';
import TutorialStep from './components/TutorialStep';
import TutorialPanel from './components/TutorialPanel';
import { useBlockchain } from './hooks/useBlockchain';
import { useWallet } from './hooks/useWallet';
import { useContract } from './hooks/useContract';
import { useTutorial } from './hooks/useTutorial';
import { generateRandomValue } from './utils/blockchain';

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0;
  padding: 0 20px;
  min-height: 100vh;
  box-sizing: border-box;
`;

const Header = styled.header`
  margin-top: 0;
  margin-bottom: 20px;
  padding: 0;
`;

const HeaderCard = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  
  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
    border-color: #374151;
  }
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

const ThreeColumnLayout = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: calc(100vh - 40px);
`;

const LeftColumn = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  width: calc(25% - 30px);
  height: calc(100vh - 40px);
  overflow-y: auto;
  
  @media (max-width: 1400px) {
    width: calc(33.33% - 30px);
  }
  
  @media (max-width: 900px) {
    position: static;
    width: calc(100% - 40px);
    height: auto;
    margin-bottom: 20px;
  }
`;

const MiddleColumn = styled.div`
  margin-left: calc(25% + 10px);
  width: calc(25% - 20px);
  padding-top: 20px;
  padding-right: 20px;
  
  @media (max-width: 1400px) {
    margin-left: calc(33.33% + 10px);
    width: calc(66.67% - 30px);
  }
  
  @media (max-width: 900px) {
    margin-left: 0;
    width: calc(100% - 40px);
    padding: 20px 0;
  }
`;

const RightColumn = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  width: calc(50% - 30px);
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1400px) {
    display: none;
  }
`;

const FixedPanelContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const LeftPanelContainer = styled(FixedPanelContainer)`
  height: auto;
`;

const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-top: 0;
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
  const {
    connected,
    blockHeight,
    userWallet,
    userBalance,
    provider,
    error: blockchainError,
  } = useBlockchain();

  const {
    newWallet,
    newWalletBalance,
    createNewAddress,
    sendTokensToNewAddress,
  } = useWallet(provider, userWallet);

  const {
    contract,
    contractAddress,
    storedValue,
    deployContract,
    updateStoredValue,
  } = useContract(provider, newWallet);

  const {
    activeStep,
    stepStatus,
    updateStepStatus,
    completeStep,
  } = useTutorial();

  const handleCreateNewAddress = async () => {
    updateStepStatus(0, true, '', '');
    try {
      await createNewAddress();
      updateStepStatus(
        0,
        false,
        `New wallet created with address: ${newWallet?.address}${
          newWallet?.mnemonic?.phrase
            ? `\n\nMnemonic: ${newWallet.mnemonic.phrase}\n\nPlease save this mnemonic phrase securely.`
            : ''
        }`,
        'success'
      );
      completeStep(0);
    } catch (error) {
      updateStepStatus(0, false, `Error creating wallet: ${error.message}`, 'error');
    }
  };

  const handleSendTokens = async () => {
    if (!newWallet) {
      updateStepStatus(1, false, 'Please create a new wallet first', 'error');
      return;
    }

    updateStepStatus(1, true, '', '');
    try {
      await sendTokensToNewAddress(1000);
      updateStepStatus(
        1,
        false,
        `Successfully sent 1000 ua0gi tokens to ${newWallet.address}\nNew balance: ${newWalletBalance} ua0gi`,
        'success'
      );
      completeStep(1);
    } catch (error) {
      updateStepStatus(1, false, `Error sending tokens: ${error.message}`, 'error');
    }
  };

  const handleDeployContract = async () => {
    if (!newWallet) {
      updateStepStatus(2, false, 'Please create a new wallet first', 'error');
      return;
    }

    updateStepStatus(2, true, '', '');
    try {
      await deployContract();
      updateStepStatus(
        2,
        false,
        `Contract deployed successfully!\nContract address: ${contractAddress}`,
        'success'
      );
      completeStep(2);
    } catch (error) {
      updateStepStatus(2, false, `Error deploying contract: ${error.message}`, 'error');
    }
  };

  const handleUpdateValue = async () => {
    if (!contract) {
      updateStepStatus(3, false, 'Please deploy the contract first', 'error');
      return;
    }

    updateStepStatus(3, true, '', '');
    try {
      const newValue = generateRandomValue();
      await updateStoredValue(newValue);
      updateStepStatus(
        3,
        false,
        `Successfully updated stored value to ${storedValue}`,
        'success'
      );
      completeStep(3, true);
    } catch (error) {
      updateStepStatus(3, false, `Error updating value: ${error.message}`, 'error');
    }
  };

  return (
    <Container>
      <Header>
        <HeaderCard>
          <Title>0G Chain Tutorial</Title>
          <Description>
            Learn how to interact with the 0G Chain by following these steps.
          </Description>
        </HeaderCard>
      </Header>

      {blockchainError && <ErrorBox>{blockchainError}</ErrorBox>}

      <ThreeColumnLayout>
        <LeftColumn>
          <LeftPanelContainer>
            <StatusCard
              connected={connected}
              blockHeight={blockHeight}
              userAddress={userWallet?.address}
              userBalance={userBalance}
            />
          </LeftPanelContainer>
        </LeftColumn>

        <MiddleColumn>
          <Steps>
            <TutorialStep
              title="Step 1: Create a New Wallet"
              description="Create a new wallet to interact with the blockchain."
              status={stepStatus[0]}
              onAction={handleCreateNewAddress}
              disabled={!connected}
            />

            <TutorialStep
              title="Step 2: Send Tokens"
              description="Send 1000 ua0gi tokens to your new wallet."
              status={stepStatus[1]}
              onAction={handleSendTokens}
              disabled={!connected || !newWallet}
            />

            <TutorialStep
              title="Step 3: Deploy Contract"
              description="Deploy a simple storage contract to the blockchain."
              status={stepStatus[2]}
              onAction={handleDeployContract}
              disabled={!connected || !newWallet}
            />

            <TutorialStep
              title="Step 4: Update Value"
              description="Update the stored value in the contract."
              status={stepStatus[3]}
              onAction={handleUpdateValue}
              disabled={!connected || !contract}
            />
          </Steps>
        </MiddleColumn>

        <RightColumn>
          <TutorialPanel
            activeStep={activeStep}
            newWallet={newWallet}
            newWalletBalance={newWalletBalance}
            contractAddress={contractAddress}
            storedValue={storedValue}
          />
        </RightColumn>
      </ThreeColumnLayout>
    </Container>
  );
}

export default App; 