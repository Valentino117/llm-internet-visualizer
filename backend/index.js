const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001; // Use dynamic port for Render

const SERPER_API_KEY = 'df7f55ceebb3883b4ce8ab961badc31ae1c59757'; // Replace with environment variable in production

app.use(cors());
app.use(express.json());

// ➕ New root route to fix "Cannot GET /"
app.get('/', (req, res) => {
  res.send('🟢 Backend is running and ready for API requests.');
});

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

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  const searchResult = await searchWeb(prompt);
  const fakeLLMResponse = `Based on the search, here's what I found: ${searchResult}`;

  res.json({ answer: fakeLLMResponse });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
