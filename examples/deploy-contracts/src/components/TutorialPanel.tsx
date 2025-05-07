import React from 'react';
import styled from 'styled-components';
import { ethers } from 'ethers';

interface TutorialPanelProps {
  activeStep: number;
  newWallet: ethers.Wallet | null;
  newWalletBalance: string;
  contractAddress: string;
  storedValue: number | null;
}

const Panel = styled.div`
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  
  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
    border-color: #374151;
  }
`;

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.25rem;
`;

const Section = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 1.1rem;
`;

const InfoItem = styled.div`
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 4px;
  
  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

const Value = styled.div`
  font-size: 1rem;
  word-break: break-all;
`;

const TutorialPanel: React.FC<TutorialPanelProps> = ({
  activeStep,
  newWallet,
  newWalletBalance,
  contractAddress,
  storedValue,
}) => {
  return (
    <Panel>
      <Title>Tutorial Progress</Title>
      
      <Section>
        <SectionTitle>Step {activeStep + 1} of 4</SectionTitle>
        <InfoItem>
          <Label>Current Step</Label>
          <Value>
            {activeStep === 0 && 'Create a new wallet'}
            {activeStep === 1 && 'Send tokens to the new wallet'}
            {activeStep === 2 && 'Deploy the contract'}
            {activeStep === 3 && 'Update the stored value'}
          </Value>
        </InfoItem>
      </Section>
      
      {newWallet && (
        <Section>
          <SectionTitle>New Wallet</SectionTitle>
          <InfoItem>
            <Label>Address</Label>
            <Value>{newWallet.address}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Balance</Label>
            <Value>{newWalletBalance} ua0gi</Value>
          </InfoItem>
        </Section>
      )}
      
      {contractAddress && (
        <Section>
          <SectionTitle>Deployed Contract</SectionTitle>
          <InfoItem>
            <Label>Contract Address</Label>
            <Value>{contractAddress}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Stored Value</Label>
            <Value>{storedValue !== null ? storedValue : 'Not set'}</Value>
          </InfoItem>
        </Section>
      )}
    </Panel>
  );
};

export default TutorialPanel; 