const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SERPER_API_KEY = process.env.SERPER_API_KEY;

app.use(cors());
app.use(express.json());

async function searchWeb(query) {
  const res = await axios.post(
    'https://google.serper.dev/search',
    { q: query },
    {
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
  const topResult = res.data.organic?.[0]?.snippet || "No results found.";
  return topResult;
}

async function askLLM(prompt, context) {
  const fullPrompt = `Answer concisely in 1-2 sentences.\n\nQuestion: ${prompt}\n\nContext: ${context}`;
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-search-preview',
      messages: [{ role: 'user', content: fullPrompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.choices[0].message.content;
}

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  const searchResult = await searchWeb(prompt);
  const answer = await askLLM(prompt, searchResult);

  res.json({ answer });
});

app.listen(port, () => {
  console.log(`✅ Backend running on http://localhost:${port}`);
});
