import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: ${props => props.connected ? '#f0fff4' : '#fff5f5'};
  border: 1px solid ${props => props.connected ? '#9ae6b4' : '#feb2b2'};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.connected ? '#22543d' : '#742a2a'};
    border-color: ${props => props.connected ? '#48bb78' : '#f56565'};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: ${props => props.connected ? '#2f855a' : '#c53030'};
  margin-bottom: 8px;
  
  @media (prefers-color-scheme: dark) {
    color: ${props => props.connected ? '#9ae6b4' : '#feb2b2'};
  }
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (prefers-color-scheme: dark) {
    border-color: #333;
  }
`;

const Label = styled.span`
  font-weight: 500;
  margin-bottom: 4px;
`;

const Value = styled.span`
  font-family: monospace;
  background: rgba(0, 0, 0, 0.05);
  padding: 4px 8px;
  border-radius: 4px;
  word-break: break-all;
  
  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StatusCard = ({ 
  connected = false, 
  blockHeight, 
  userAddress, 
  userBalance, 
  newAddress, 
  newBalance, 
  contractAddress, 
  storedValue 
}) => {
  return (
    <Card connected={connected}>
      <Title connected={connected}>
        {connected ? '✅ Connected to 0G Chain' : '❌ Not Connected to 0G Chain'}
      </Title>
      
      {connected && (
        <>
          <StatusItem>
            <Label>Current Block Height:</Label>
            <Value>{blockHeight !== undefined && blockHeight !== null ? blockHeight : 'N/A'}</Value>
          </StatusItem>
          
          {userAddress && (
            <StatusItem>
              <Label>User Address:</Label>
              <Value>{userAddress}</Value>
            </StatusItem>
          )}
          
          {userBalance && (
            <StatusItem>
              <Label>User Balance:</Label>
              <Value>{userBalance} ua0gi</Value>
            </StatusItem>
          )}
          
          {newAddress && (
            <StatusItem>
              <Label>New Wallet Address:</Label>
              <Value>{newAddress}</Value>
            </StatusItem>
          )}
          
          {newBalance && (
            <StatusItem>
              <Label>New Wallet Balance:</Label>
              <Value>{newBalance} ua0gi</Value>
            </StatusItem>
          )}
          
          {contractAddress && (
            <StatusItem>
              <Label>Contract Address:</Label>
              <Value>{contractAddress}</Value>
            </StatusItem>
          )}
          
          {storedValue !== undefined && storedValue !== null && (
            <StatusItem>
              <Label>Stored Value:</Label>
              <Value>{storedValue.toString()}</Value>
            </StatusItem>
          )}
        </>
      )}
    </Card>
  );
};

export default StatusCard; 