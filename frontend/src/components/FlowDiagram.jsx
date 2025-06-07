import React from 'react';

export default function FlowDiagram({ stage }) {
  const getStyle = (current) => ({
    padding: '10px 15px',
    borderRadius: '8px',
    margin: '5px',
    display: 'inline-block',
    background: stage === current ? '#4ade80' : '#333',
    color: 'white',
    fontWeight: stage === current ? 'bold' : 'normal',
    transition: 'background 0.3s ease',
  });

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Request Flow</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <span style={getStyle('prompt')}>User Prompt</span>
        <span style={getStyle('search')}>Search API</span>
        <span style={getStyle('llm')}>LLM</span>
        <span style={getStyle('done')}>Answer</span>
      </div>
    </div>
  );
}
