const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const openaiResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Answer this briefly in ~3 sentences: ${prompt}`,
          },
        ],
        tools: [{ type: 'retrieval' }],
        tool_choice: 'auto',
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = openaiResponse.data.choices?.[0]?.message?.content || "No answer returned.";
    res.json({ answer });
  } catch (err) {
    console.error('Error fetching from OpenAI:', err.response?.data || err.message);
    res.status(500).json({ answer: "Sorry, something went wrong when contacting the model." });
  }
});

app.listen(port, () => {
  console.log(`🟢 Backend is running on http://localhost:${port}`);
});
