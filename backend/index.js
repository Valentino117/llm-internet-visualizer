const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

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

async function callOpenAI(prompt, searchResults) {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4o-search-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a concise assistant. Use the provided search result to answer the question clearly and briefly.',
        },
        {
          role: 'user',
          content: `Question: ${prompt}\n\nSearch Result: ${searchResults}`,
        },
      ],
      max_tokens: 150,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.choices[0].message.content.trim();
}

app.post('/api/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    const searchResult = await searchWeb(prompt);
    const openaiAnswer = await callOpenAI(prompt, searchResult);

    res.json({ answer: openaiAnswer });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`🟢 Backend is running on port ${port}`);
});
