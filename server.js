// import {GoogleGenAI} from '@google/genai';  // Import the updated Gemini SDK
// import cors from 'cors';
// import dotenv from 'dotenv';
// import express from 'express';

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// const ai = new GoogleGenAI({});

// app.post('/study', async (req, res) => {
//   try {
//     const notes = req.body.notes;

//     console.log('REQUEST RECEIVED');

//     // FIXED: Using standard OpenAI Chat Completions formatting
//     const response = await ai.models.generateContent({
//       model: 'gemini-3.5-flash',
//       contents:
//           `Analyze and help me study these notes(don't use bolds). Highlight key terms and give a quick summary:\n${
//               notes}`,
//     });

//     // FIXED: Parsing the text correctly from the response object
//     const aiResponse = response.text;

//     res.json({result: aiResponse});

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({result: 'Error: ' + err.message});
//   }
// });

// app.get('/', (req, res) => {
//   res.send('Server is running 🚀');
// });

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
import { setGlobalDispatcher, ProxyAgent } from 'undici';

// Replace 7890 with your actual local VPN client port (e.g., Clash/v2ray/Shadowsocks)
const proxyUrl = 'https://onrender.com/study'; 
setGlobalDispatcher(new ProxyAgent(proxyUrl));
import { GoogleGenAI } from '@google/genai';  // Import the official Gemini SDK
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// FIX 1: Pass the API key explicitly into the configuration object
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/study', async (req, res) => {
  try {
    const notes = req.body.notes;
    console.log('REQUEST RECEIVED');

    // Call the correct SDK method
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Updated to the recommended model
      contents: `Analyze and help me study these notes (don't use markdown bold styling). Highlight key terms and give a quick summary:\n${notes}`,
    });

    // FIX 2: Correctly extract text using the SDK's built-in text getter
    const aiResponse = response.text; 

    res.json({ result: aiResponse });

  } catch (err) {
    console.error(err);
    res.status(500).json({ result: 'Error: ' + err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});