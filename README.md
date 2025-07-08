# Mood AI Bot

<p align="center">
  <img src="public/mood-bot-icon.svg" alt="Mood AI Bot Logo" width="200" height="200">
</p>

A chatbot that understands human emotions through text and responds with empathy. This application uses the OpenRouter API to detect the user's mood from their messages and respond appropriately.

## 🌟 Features

- **Mood Detection**: Analyzes user messages to identify emotional states
- **Empathetic Responses**: Tailors responses based on detected mood
- **Visual Mood Indicators**: Color-coded messages based on emotional context
- **Intuitive UI**: Clean, responsive interface for seamless interaction
- **Real-time Chat**: Instant messaging experience

## 🖼️ Screenshots

<p align="center">
  <img src="https://via.placeholder.com/800x450.png?text=Mood+AI+Bot+Screenshot" alt="Mood AI Bot Screenshot">
</p>

## 🚀 Live Demo

[Coming Soon](#)

## 🛠️ Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/mood-ai-bot.git
cd mood-ai-bot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following content:

```
# OpenRouter API Key
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Server Port
PORT=3000
```

> **Important**: You need to obtain an API key from [OpenRouter](https://openrouter.ai/). Sign up, create an API key, and add it to your `.env` file.

## 🚀 Usage

### Start the server

```bash
npm start
```

Open your browser and navigate to `http://localhost:3000`

### Development mode

For development with auto-restart on file changes:

```bash
npm run dev
```

## 🧠 How It Works

1. **User Input**: The user sends a message through the chat interface
2. **API Processing**: The message is sent to the OpenRouter API via our server
3. **Mood Analysis**: The AI model analyzes the text to detect emotional context
4. **Response Generation**: The model generates an appropriate, empathetic response
5. **UI Update**: The response is displayed with visual indicators for the detected mood

## 🎭 Supported Moods

- **Happy**: Celebratory and positive responses
- **Sad**: Comforting and supportive messages
- **Angry**: Calming and understanding replies
- **Excited**: Enthusiastic and engaging conversation
- **Nervous**: Reassuring and steady communication
- **Bored**: Interesting and stimulating suggestions
- **Confused**: Clear explanations and guidance

## 🎨 Customization

### Modifying the AI Prompt

You can customize the bot's behavior by modifying the prompt in the `server.js` file:

```javascript
const prompt = `You are a friendly chatbot that understands human emotions through text. 

Step 1: Detect the user's mood from the given message...
```

### Changing the UI

Modify the CSS in `public/styles.css` to change the appearance of the chat interface.

### Updating the Bot Icon

Replace the SVG files in the `public` directory:
- `mood-bot-icon.svg`: Main bot icon
- `favicon.svg`: Browser tab icon

## 🔄 API Model Configuration

The application is configured to use the Meta Llama 4 Scout model through OpenRouter:

```javascript
const requestBody = {
  model: 'meta-llama/llama-4-scout:free',
  // other configuration...
};
```

You can change this to any other model supported by OpenRouter by modifying the `model` parameter in `server.js`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenRouter](https://openrouter.ai/) for providing the AI capabilities
- [Express.js](https://expressjs.com/) for the server framework
- [Font Awesome](https://fontawesome.com/) for the icons
- [Meta Llama](https://ai.meta.com/) for the underlying AI model

---

<p align="center">
Made with ❤️ by [M.Sufyan]
</p>
