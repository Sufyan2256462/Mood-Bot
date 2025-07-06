# Mood AI Bot

A mood-aware chatbot web app built with Node.js, Express, and OpenRouter AI. The bot detects the user's mood and language, then responds in a friendly, mood-matching tone and the same language/script. The frontend is modern, responsive, and visually appealing.

![Mood AI Bot Icon](public/mood-bot-icon.svg)

## Features

- Detects user mood (Happy, Sad, Angry, Excited, Nervous, Bored, Confused) from messages
- Detects and displays the user's language/script (supports English, Urdu, Hindi, Arabic, Chinese, and more)
- AI-powered responses using OpenRouter API (Llama 4 model)
- Replies in the same language/script as the user
- Short, friendly, mood-aware responses (2-3 lines)
- Modern, responsive chat UI with mood-based message styling
- Real-time status indicator (Online/Thinking/Error)
- Chat history with avatars for user and bot
- Mobile-friendly design

## Demo

![Screenshot](public/mood-bot-icon.svg) <!-- Replace with actual screenshot if available -->

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/mood-ai-bot.git
   cd mood-ai-bot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory:
     ```env
     OPENROUTER_API_KEY=your_openrouter_api_key_here
     ```
   - You can get a free API key from [OpenRouter](https://openrouter.ai/).

### Running the App

```bash
npm start
```

- The app will run at [http://localhost:3000](http://localhost:3000)
- Open in your browser to chat with the Mood AI Bot!

## Project Structure

```
├── public/
│   ├── index.html        # Main frontend HTML
│   ├── app.js            # Frontend JS logic
│   ├── styles.css        # Styling (responsive, mood-based)
│   ├── mood-bot-icon.svg # Bot icon
│   └── favicon.svg       # Favicon
├── server.js             # Express backend, API, mood/language detection
├── package.json          # Project metadata and dependencies
├── .gitignore            # Ignored files
└── README.md             # Project documentation
```

## API

### POST `/api/chat`
- **Request Body:**
  ```json
  {
    "message": "Your message here",
    "history": [ ... ] // Optional chat history
  }
  ```
- **Response:**
  ```json
  {
    "response": "Bot's reply",
    "detectedLanguage": "English",
    "detectedMood": "Happy"
  }
  ```

## Environment Variables

- `OPENROUTER_API_KEY` – Your OpenRouter API key (required)
- `PORT` – (Optional) Port to run the server (default: 3000)

## Customization
- You can modify mood keywords or supported languages in `server.js`.
- Frontend styles and mood colors can be changed in `public/styles.css`.

## Credits
- [OpenRouter](https://openrouter.ai/) for AI API
- [Express](https://expressjs.com/), [Node.js](https://nodejs.org/)
- UI inspired by modern chat apps

## License

ISC. See [LICENSE](LICENSE) for details. 
