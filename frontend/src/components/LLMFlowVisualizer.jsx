import React from 'react';

const steps = [
  {
    key: 'prompt',
    emoji: '🧑‍💻',
    title: 'You',
    description: 'You typed a question like “What’s the latest on AI regulation?”',
  },
  {
    key: 'receive',
    emoji: '🖥️',
    title: 'Your App (on a CPU)',
    description: 'The app receives your question and decides it needs more information.',
  },
  {
    key: 'call',
    emoji: '🌐',
    title: 'App Calls the Web',
    description: 'The app sends a secure internet access request to a search API like Bing or Google.',
  },
  {
    key: 'result',
    emoji: '📄',
    title: 'Search Results Received',
    description: "The internet responds with the content of a specific website. Your app extracts what's useful from the results.",
  },
  {
    key: 'prepare',
    emoji: '🧩',
    title: 'App Builds the Prompt for GPT-4',
    description: 'Your app combines the search result content with your question into a single prompt for the model to understand.',
  },
  {
    key: 'llm',
    emoji: '🚀',
    title: 'GPT-4 (on a GPU Cluster)',
    description: 'The model receives both the results and the original question. Without accessing the internet, it generates an answer and sends it to the app.',
  },
  {
    key: 'done',
    emoji: '💬',
    title: 'Final Answer',
    description: 'The app receives the model’s answer and shows it to you!',
  },
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
