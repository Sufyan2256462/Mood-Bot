require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// API endpoint to process user messages
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    const history = req.body.history || [];
    
    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Function to detect language (simple detection based on character sets)
    function detectLanguage(text) {
      // Check for common scripts/character ranges
      const scripts = {
        // Arabic
        arabic: /[\u0600-\u06FF]/,
        // Chinese
        chinese: /[\u4E00-\u9FFF]/,
        // Cyrillic (Russian, etc.)
        cyrillic: /[\u0400-\u04FF]/,
        // Devanagari (Hindi, etc.)
        devanagari: /[\u0900-\u097F]/,
        // Greek
        greek: /[\u0370-\u03FF]/,
        // Hebrew
        hebrew: /[\u0590-\u05FF]/,
        // Japanese
        japanese: /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF]/,
        // Korean
        korean: /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/,
        // Thai
        thai: /[\u0E00-\u0E7F]/,
        // Latin (English, Spanish, French, etc.)
        latin: /[A-Za-z]/
      };

      // Map script names to user-friendly language names
      const languageNames = {
        arabic: 'Arabic',
        chinese: 'Chinese',
        cyrillic: 'Russian',
        devanagari: 'Hindi',
        greek: 'Greek',
        hebrew: 'Hebrew',
        japanese: 'Japanese',
        korean: 'Korean',
        thai: 'Thai',
        latin: 'English',
        unknown: 'Unknown'
      };

      // Check which script has the most matches
      let detectedScript = 'unknown';
      let maxCount = 0;

      for (const [script, regex] of Object.entries(scripts)) {
        const matches = text.match(regex);
        const count = matches ? matches.length : 0;
        
        if (count > maxCount) {
          maxCount = count;
          detectedScript = script;
        }
      }

      // Return user-friendly language name
      return languageNames[detectedScript];
    }

    // Function to detect mood from user message
    function detectMood(message) {
      const moodKeywords = {
        'happy': ['happy', 'glad', 'joy', 'delighted', 'pleased', '😊', '😄', '🙂'],
        'sad': ['sad', 'sorry', 'unhappy', 'disappointed', 'down', '😔', '😢', '😞', 'hrab', 'pareeshan', 'pareeshani', 'udaas'],
        'angry': ['angry', 'upset', 'frustrated', 'annoyed', 'mad', '😠', '😡', '😤'],
        'excited': ['excited', 'thrilled', 'enthusiastic', 'eager', 'pumped', '🎉', '😃', '🤩'],
        'nervous': ['nervous', 'anxious', 'worried', 'concerned', 'uneasy', '😰', '😨', '😬'],
        'bored': ['bored', 'dull', 'uninterested', 'monotonous', 'tedious', '😐', '😑', '😴'],
        'confused': ['confused', 'puzzled', 'perplexed', 'unsure', 'uncertain', '🤔', '😕', '❓']
      };
      const lowerMessage = message.toLowerCase();
      for (const [mood, keywords] of Object.entries(moodKeywords)) {
        for (const keyword of keywords) {
          if (lowerMessage.includes(keyword.toLowerCase())) {
            return mood.charAt(0).toUpperCase() + mood.slice(1);
          }
        }
      }
      return null;
    }

    // Detect the language and mood of the user's message
    const detectedLanguage = detectLanguage(userMessage);
    const detectedMood = detectMood(userMessage);
    console.log(`Detected language: ${detectedLanguage}`);
    console.log(`Detected mood: ${detectedMood}`);

    // Construct the prompt for the mood detection and response
    const prompt = `You are a mood-based chatbot. Always reply in the same language and script as the user's message (e.g., Urdu, Roman Urdu, Hindi, etc.). Do not mention the detected language or say anything about language detection. Only answer the user's question according to their mood.\n\nDetect the user's mood from the message and reply in a tone that matches the mood.\n\nMoods: Happy, Sad, Angry, Excited, Nervous, Bored, Confused.\n\nKeep responses short (2-3 lines), friendly, and mood-aware.\n\nExample:\nUser: Ugh, today was such a mess, nothing went right.\nBot: Sounds like you're feeling a bit down 😔. I'm here for you — want to talk about it?\n\nNow here's the user's message:\n"${userMessage}"`;

    // Build messages array for OpenRouter API
    const systemPrompt = {
      role: 'system',
      content: `You are a mood-aware chatbot. Always reply in the same language and script as the user's message (e.g., Urdu, Roman Urdu, Hindi, etc.). Do not mention the detected language or say anything about language detection. Only answer the user's question according to their mood.`
    };
    let messages = [systemPrompt];
    if (Array.isArray(history) && history.length > 0) {
      messages = [systemPrompt, ...history.slice(-8), { role: 'user', content: userMessage }];
    } else {
      messages = [systemPrompt, { role: 'user', content: userMessage }];
    }

    // Make request to OpenRouter API
    console.log('Sending request to OpenRouter API...');
    let response;
    try {
      // Log the request body for debugging
      const requestBody = {
        model: 'meta-llama/llama-4-scout:free',
        messages,
        max_tokens: 150
      };
      console.log('Request body:', JSON.stringify(requestBody));
      
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:3000', // Replace with your actual domain in production
          'X-Title': 'Mood AI Bot'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API Error - Status:', response.status, 'Response:', errorText);
        return res.status(response.status).json({ error: `Error from AI service: ${response.status} - ${errorText}` });
      }
    } catch (fetchError) {
      console.error('Fetch Error:', fetchError);
      return res.status(500).json({ error: 'Error connecting to AI service: ' + fetchError.message });
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('OpenRouter API Error:', data.error);
      return res.status(500).json({ error: 'Error from AI service: ' + JSON.stringify(data.error) });
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenRouter API response format:', data);
      return res.status(500).json({ error: 'Unexpected response format from AI service' });
    }

    const botResponse = data.choices[0].message.content.trim();
    res.json({ 
      response: botResponse,
      detectedLanguage,
      detectedMood
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});