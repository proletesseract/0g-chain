import React from 'react';
import styled from 'styled-components';

const StepContainer = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background-color: ${props => props.active ? '#ebf8ff' : '#f8fafc'};
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  cursor: ${props => props.disabled ? 'not-allowed' : 'default'};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.active ? '#2c5282' : '#2d3748'};
    border-color: #4a5568;
  }
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const StepNumber = styled.div`
  background-color: ${props => props.active ? '#3182ce' : '#a0aec0'};
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
`;

const StepTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
`;

const StepDescription = styled.p`
  margin: 8px 0 16px;
  color: #4a5568;
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
`;

const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.primary ? '#3182ce' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#4a5568'};
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover:not(:disabled) {
    background-color: ${props => props.primary ? '#2b6cb0' : '#cbd5e0'};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.primary ? '#3182ce' : '#4a5568'};
    color: white;
    
    &:hover:not(:disabled) {
      background-color: ${props => props.primary ? '#2b6cb0' : '#2d3748'};
    }
  }
`;

const ResultMessage = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  background-color: ${props => props.type === 'success' ? '#c6f6d5' : props.type === 'error' ? '#fed7d7' : '#e2e8f0'};
  color: ${props => props.type === 'success' ? '#2f855a' : props.type === 'error' ? '#c53030' : '#4a5568'};
  font-size: 0.9rem;
  max-width: 100%;
  overflow-x: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  
  @media (prefers-color-scheme: dark) {
    background-color: ${props => props.type === 'success' ? '#22543d' : props.type === 'error' ? '#742a2a' : '#4a5568'};
    color: white;
  }
`;

const CodeBlock = styled.pre`
  margin: 8px 0;
  padding: 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  font-family: monospace;
  font-size: 0.85rem;
  white-space: pre-wrap;
  
  @media (prefers-color-scheme: dark) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

/**
 * TutorialStep component - Displays a single step in the tutorial with actions and results
 * 
 * @param {number} stepNumber - The sequence number of this step
 * @param {string} title - The title of this step
 * @param {string} description - The description of what this step does
 * @param {boolean} active - Whether this step is currently active
 * @param {boolean} disabled - Whether this step is currently disabled
 * @param {boolean} completed - Whether this step has been completed
 * @param {boolean} loading - Whether this step is currently processing
 * @param {string} result - Result message to display
 * @param {string} resultType - Type of result (success/error/info)
 * @param {Function} onAction - Function to call when action button is clicked
 * @param {string} actionLabel - Label for the action button
 */
const TutorialStep = ({
  stepNumber,
  title,
  description,
  active = false,
  disabled = false,
  completed = false,
  loading = false,
  result = '',
  resultType = 'info',
  onAction,
  actionLabel,
  dataId,
}) => {
  // Function to format result text for display
  const formatResult = (text) => {
    if (!text) return '';
    return text;
  };

  // Handle action button click
  const handleActionClick = (e) => {
    if (dataId) {
      window.location.hash = dataId;
    }
    if (onAction) {
      onAction(e);
    }
  };
  
  return (
    <StepContainer active={active} disabled={disabled}>
      <StepHeader>
        <StepNumber active={active}>{completed ? '✓' : stepNumber}</StepNumber>
        <StepTitle>{title}</StepTitle>
      </StepHeader>
      <StepDescription>{description}</StepDescription>
      
      <ActionArea>
        <ActionButton 
          primary 
          disabled={disabled || loading} 
          onClick={handleActionClick}
          data-id={dataId}
        >
          {loading ? 'Processing...' : actionLabel}
        </ActionButton>
      </ActionArea>
      
      {result && (
        <ResultMessage type={resultType}>
          {formatResult(result)}
        </ResultMessage>
      )}
    </StepContainer>
  );
};

export default TutorialStep; 