import React, { useState } from 'react';
import LLMFlowVisualizer from './components/LLMFlowVisualizer';

export default function App() {
  const [response, setResponse] = useState(null);
  const [stage, setStage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const prompt = e.target.elements.prompt.value;

    setResponse(null);
    setStage("prompt");
    await new Promise((r) => setTimeout(r, 300));

    setStage("receive");
    await new Promise((r) => setTimeout(r, 300));

    setStage("call");
    await new Promise((r) => setTimeout(r, 300));

    const res = await fetch('http://localhost:3001/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    setStage("result");
    await new Promise((r) => setTimeout(r, 300));

    const data = await res.json();

    setStage("prepare");
    await new Promise((r) => setTimeout(r, 300));

    setStage("llm");
    await new Promise((r) => setTimeout(r, 500));

    setResponse(data);
    setStage("done");
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
        padding: '2em',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2em',
          borderRadius: '16px',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '680px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            marginBottom: '1.5em',
            color: '#1e293b',
            fontSize: '1.75rem',
            fontWeight: '600',
            lineHeight: '1.2',
          }}
        >
          How Does an LLM Access the Internet?
        </h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75em',
            alignItems: 'center',
            marginBottom: '1.5em',
          }}
        >
          <input
            type="text"
            name="prompt"
            placeholder="Ask a question..."
            style={{
              padding: '0.75em',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1em',
              width: '100%',
              maxWidth: '400px',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.75em 1.5em',
              borderRadius: '8px',
              backgroundColor: '#4ade80',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Submit
          </button>
        </form>
        <LLMFlowVisualizer stage={stage} response={response} />
      </div>
    </div>
  );
}
