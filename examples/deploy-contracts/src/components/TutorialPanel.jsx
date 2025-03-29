import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const PanelContainer = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  /* Height is calculated dynamically based on scrollY, but capped at 100vh - 40px */
  height: ${props => `calc(min(100vh - 40px, 100vh - ${Math.max(0, 210 - props.scrollY)}px))`};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  transition: height 0.1s ease-out;
  margin-top: 0px;
  
  @media (prefers-color-scheme: dark) {
    background-color: #1a202c;
    border-color: #4a5568;
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
  font-size: 1.2rem;
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto; /* Enable vertical scrolling */
  height: calc(100% - 53px); /* Account for header height */
`;

const MarkdownContent = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
  
  h1 {
    font-size: 1.5rem;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }
  
  h2 {
    font-size: 1.3rem;
    margin-top: 1.2em;
    margin-bottom: 0.5em;
  }
  
  h3, h4, h5, h6 {
    margin-top: 1em;
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
    font-size: 0.85em;
  }
  
  pre {
    background-color: #f5f5f5;
    padding: 0.8em;
    border-radius: 5px;
    overflow-x: auto;
    margin: 1em 0;
    font-size: 0.85em;
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
    padding-left: 1.5em;
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
  const [tutorialContent, setTutorialContent] = useState('');
  const [scrollY, setScrollY] = useState(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize scroll position
    handleScroll();
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Load tutorial content
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
  
  return (
    <PanelContainer scrollY={scrollY}>
      <PanelHeader>
        <PanelTitle>0G Chain Tutorial</PanelTitle>
      </PanelHeader>
      
      <PanelContent>
        <MarkdownContent>
          <ReactMarkdown>
            {tutorialContent}
          </ReactMarkdown>
        </MarkdownContent>
      </PanelContent>
    </PanelContainer>
  );
};

export default TutorialPanel; 