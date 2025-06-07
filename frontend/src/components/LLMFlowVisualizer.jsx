import React from 'react';

const steps = [
  {
    id: "prompt",
    title: "🧠 User Prompt",
    description: "You ask a question in natural language. Your app receives it and decides it needs internet data to answer.",
  },
  {
    id: "receive",
    title: "🖥️ Your App (on a CPU)",
    description: "Your app receives the question and determines it needs web context. It prepares a tool call for web search.",
  },
  {
    id: "call",
    title: "🌐 App Calls the Web",
    description: "The app sends a secure search request via gpt-4o-search-preview’s built-in tool calling system.",
  },
  {
    id: "result",
    title: "📄 Search Results Received",
    description: "OpenAI fetches search results, extracts relevant snippets, and sends them back to your app.",
  },
  {
    id: "prepare",
    title: "📦 Prompt Assembled",
    description: "Your app combines the question and the search results into a single prompt for the model to process.",
  },
  {
    id: "llm",
    title: "🧠 GPT-4.1 (on GPU)",
    description: "The model runs on a GPU cluster. It cannot browse, but uses the provided info to generate an answer.",
  },
  {
    id: "done",
    title: "✅ Model’s Answer",
    description: "Your app receives the model’s response and sends it back to you in the browser.",
  }
];

const stageIndex = (current) => steps.findIndex(s => s.key === current);

export default function LLMFlowVisualizer({ stage, response }) {
  const currentIndex = stageIndex(stage);
  const progressPercent = ((currentIndex + 1) / steps.length) * 100;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75em',
      alignItems: 'center',
      paddingBottom: '1em',
      width: '100%',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute',
        top: '-16px',
        left: 0,
        height: '6px',
        width: '100%',
        background: '#e2e8f0',
        borderRadius: '6px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: progressPercent + '%',
          height: '100%',
          background: '#4ade80',
          transition: 'width 0.3s ease-in-out',
        }} />
      </div>

      {steps.map((step, index) => {
        const isActive = step.key === stage;
        const isPast = index < currentIndex;

        return (
          <div
            key={step.key}
            style={{
              position: 'relative',
              padding: '1em',
              borderRadius: '12px',
              border: '2px solid',
              borderColor: isActive || isPast ? '#4ade80' : '#ccc',
              background: isActive ? '#4ade80' : '#f9fafb',
              color: isActive ? 'white' : 'black',
              textAlign: 'center',
              transition: 'all 0.4s ease',
              width: '100%',
              maxWidth: '680px',
              fontSize: '0.95rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box',
              animation: isActive ? 'pulse 1.5s infinite' : 'none',
            }}
          >
            <div style={{ fontSize: '1.25em' }}>
              {step.emoji} <strong>{step.title}</strong>
            </div>
            <div style={{ marginTop: '0.4em' }}>{step.description}</div>
          </div>
        );
      })}

      {stage === 'done' && response?.answer && (
        <div
          style={{
            marginTop: '1em',
            padding: '1em',
            background: '#1e293b',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            width: '100%',
            maxWidth: '680px',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            whiteSpace: 'pre-wrap',
            overflow: 'visible',
            wordWrap: 'break-word',
          }}
        >
          <h3 style={{ marginBottom: '0.5em', color: 'white' }}>Model's Answer:</h3>
          <p>{response.answer}</p>
        </div>
      )}

      <style>
        {`@keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6); }
            70% { box-shadow: 0 0 0 10px rgba(74, 222, 128, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
          }`}
      </style>
    </div>
  );
}
