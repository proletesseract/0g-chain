import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const PanelContainer = styled.div`
  position: fixed;
  top: 0;
  right: ${props => props.isOpen ? '0' : '-800px'};
  width: 800px;
  max-width: 90vw;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  
  @media (prefers-color-scheme: dark) {
    background-color: #1a202c;
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.3);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  
  @media (prefers-color-scheme: dark) {
    border-color: #4a5568;
  }
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4a5568;
  
  &:hover {
    color: #2d3748;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #a0aec0;
    
    &:hover {
      color: #e2e8f0;
    }
  }
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const TutorialButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: ${props => props.isOpen ? '820px' : '20px'};
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 12px 20px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 999;
  
  &:hover {
    background-color: #2b6cb0;
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
`;

const MarkdownContent = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
  }
  
  p {
    margin-bottom: 1em;
  }
  
  code {
    background-color: #f0f0f0;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1em 0;
  }
  
  pre code {
    background-color: transparent;
    padding: 0;
  }
  
  blockquote {
    border-left: 4px solid #e2e8f0;
    padding-left: 1em;
    margin-left: 0;
    color: #4a5568;
  }
  
  ul, ol {
    margin-bottom: 1em;
    padding-left: 2em;
  }
  
  a {
    color: #3182ce;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
    
    code {
      background-color: #2d3748;
    }
    
    pre {
      background-color: #2d3748;
    }
    
    blockquote {
      border-color: #4a5568;
      color: #a0aec0;
    }
    
    a {
      color: #63b3ed;
    }
  }
`;

const TutorialPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tutorialContent, setTutorialContent] = useState('');
  
  useEffect(() => {
    // Load the tutorial markdown content
    fetch('/tutorial.md')
      .then(response => response.text())
      .then(text => {
        setTutorialContent(text);
      })
      .catch(error => {
        console.error('Error loading tutorial:', error);
        setTutorialContent('# Tutorial Not Found\n\nSorry, the tutorial content could not be loaded.');
      });
  }, []);
  
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      <TutorialButton onClick={togglePanel} isOpen={isOpen}>
        {isOpen ? 'Close Tutorial' : 'Open Tutorial'}
      </TutorialButton>
      
      <PanelContainer isOpen={isOpen}>
        <PanelHeader>
          <PanelTitle>0G Chain Tutorial</PanelTitle>
          <CloseButton onClick={togglePanel}>&times;</CloseButton>
        </PanelHeader>
        
        <PanelContent>
          <MarkdownContent>
            <ReactMarkdown>
              {tutorialContent}
            </ReactMarkdown>
          </MarkdownContent>
        </PanelContent>
      </PanelContainer>
    </>
  );
};

export default TutorialPanel; 