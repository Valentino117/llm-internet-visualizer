const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

const SERPER_API_KEY = 'df7f55ceebb3883b4ce8ab961badc31ae1c59757'; // Replace with your real key

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

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  const searchResult = await searchWeb(prompt);
  const fakeLLMResponse = `Based on the search, here's what I found: ${searchResult}`;

  res.json({ answer: fakeLLMResponse });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
