const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3001;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('🟢 Backend is running and ready for API requests.');
});

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-search-preview',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = openaiRes.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('Error fetching data from OpenAI:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
