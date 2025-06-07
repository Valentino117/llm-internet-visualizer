const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o-search-preview",
        messages: [
          {
            role: "system",
            content: "You're a helpful assistant. Answer concisely using real-time web results if needed.",
          },
          {
            role: "user",
            content: prompt,
          },
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = openaiRes.data.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('Error fetching from OpenAI:', error.response?.data || error.message);
    res.status(500).json({ answer: "Sorry, something went wrong when contacting the model." });
  }
});

app.listen(port, () => {
  console.log(`🟢 Backend is running on http://localhost:${port}`);
});
