import React from 'react';
import styled from 'styled-components';

interface StatusCardProps {
  connected: boolean;
  blockHeight: string | number;
  userAddress: string | undefined;
  userBalance: string | null;
}

const Card = styled.div`
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

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 1.25rem;
`;

const StatusItem = styled.div`
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

const ConnectionStatus = styled.div<{ connected: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: ${props => props.connected ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.connected ? '#166534' : '#991b1b'};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.connected ? '#064e3b' : '#7f1d1d'};
    color: ${props => props.connected ? '#86efac' : '#fca5a5'};
  }
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 6px;
    background-color: ${props => props.connected ? '#22c55e' : '#ef4444'};
  }
`;

const StatusCard: React.FC<StatusCardProps> = ({
  connected,
  blockHeight,
  userAddress,
  userBalance,
}) => {
  return (
    <Card>
      <Title>Blockchain Status</Title>
      
      <StatusItem>
        <Label>Connection Status</Label>
        <ConnectionStatus connected={connected}>
          {connected ? 'Connected' : 'Disconnected'}
        </ConnectionStatus>
      </StatusItem>
      
      <StatusItem>
        <Label>Current Block Height</Label>
        <Value>{blockHeight}</Value>
      </StatusItem>
      
      <StatusItem>
        <Label>Your Address</Label>
        <Value>{userAddress || 'Not connected'}</Value>
      </StatusItem>
      
      <StatusItem>
        <Label>Your Balance</Label>
        <Value>{userBalance ? `${userBalance} ua0gi` : '0 ua0gi'}</Value>
      </StatusItem>
    </Card>
  );
};

export default StatusCard; 