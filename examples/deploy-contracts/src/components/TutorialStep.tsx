import React from 'react';
import styled from 'styled-components';
import { StepStatus } from '../types';

interface TutorialStepProps {
  title: string;
  description: string;
  status: StepStatus;
  onAction: () => Promise<void>;
  disabled: boolean;
}

const StepCard = styled.div`
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

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const StepDescription = styled.p`
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 0.875rem;
  
  @media (prefers-color-scheme: dark) {
    color: #9ca3af;
  }
`;

const ActionButton = styled.button<{ disabled: boolean }>`
  background-color: ${props => props.disabled ? '#e5e7eb' : '#3b82f6'};
  color: ${props => props.disabled ? '#9ca3af' : '#ffffff'};
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.875rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.disabled ? '#e5e7eb' : '#2563eb'};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.disabled ? '#374151' : '#3b82f6'};
    color: ${props => props.disabled ? '#6b7280' : '#ffffff'};
    
    &:hover {
      background-color: ${props => props.disabled ? '#374151' : '#2563eb'};
    }
  }
`;

const ResultBox = styled.div<{ type: StepStatus['resultType'] }>`
  margin-top: 12px;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.875rem;
  white-space: pre-wrap;
  word-break: break-all;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
          
          @media (prefers-color-scheme: dark) {
            background-color: #064e3b;
            color: #86efac;
            border-color: #059669;
          }
        `;
      case 'error':
        return `
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
          
          @media (prefers-color-scheme: dark) {
            background-color: #7f1d1d;
            color: #fca5a5;
            border-color: #ef4444;
          }
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #e5e7eb;
          
          @media (prefers-color-scheme: dark) {
            background-color: #1f2937;
            color: #d1d5db;
            border-color: #374151;
          }
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const TutorialStep: React.FC<TutorialStepProps> = ({
  title,
  description,
  status,
  onAction,
  disabled,
}) => {
  return (
    <StepCard>
      <StepHeader>
        <StepTitle>{title}</StepTitle>
        <ActionButton
          onClick={onAction}
          disabled={disabled || status.loading}
        >
          {status.loading ? (
            <>
              <LoadingSpinner />
              Processing...
            </>
          ) : (
            'Execute'
          )}
        </ActionButton>
      </StepHeader>
      
      <StepDescription>{description}</StepDescription>
      
      {status.result && (
        <ResultBox type={status.resultType}>
          {status.result}
        </ResultBox>
      )}
    </StepCard>
  );
};

export default TutorialStep; 