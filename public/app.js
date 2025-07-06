// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const statusIndicator = document.getElementById('status-indicator');
const moodDisplay = document.getElementById('mood-display');
const languageDisplay = document.getElementById('language-display');

// Initialize chat history
let chatHistory = [];

// Function to add a message to the chat
function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Add appropriate class based on sender
    if (sender === 'user') {
        messageElement.classList.add('user-message');
    } else {
        messageElement.classList.add('bot-message');
    }
    
    // Create avatar
    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    
    if (sender === 'bot') {
        avatar.classList.add('bot-avatar');
        // Use SVG for bot avatar
        avatar.innerHTML = `<img src="mood-bot-icon.svg" class="bot-icon" alt="Bot">`;
    } else {
        avatar.classList.add('user-avatar');
    }
    
    // Create message content
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    
    if (sender === 'bot') {
        messageContent.classList.add('bot-content');
        
        // Detect mood from bot response
        const mood = detectMood(message);
        if (mood) {
            messageElement.classList.add(mood.toLowerCase());
            moodDisplay.textContent = `Mood: ${mood}`;
            moodDisplay.classList.remove('happy', 'sad', 'angry', 'excited', 'nervous', 'bored', 'confused');
            moodDisplay.classList.add(mood.toLowerCase());
        }
    } else {
        messageContent.classList.add('user-content');
    }
    
    messageContent.textContent = message;
    
    // Append avatar and content to message
    messageElement.appendChild(avatar);
    messageElement.appendChild(messageContent);
    
    // Append message to chat
    chatMessages.appendChild(messageElement);
    
    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to detect mood from bot response
function detectMood(message) {
    const moodKeywords = {
        'happy': ['happy', 'glad', 'joy', 'delighted', 'pleased', '😊', '😄', '🙂'],
        'sad': ['sad', 'sorry', 'unhappy', 'disappointed', 'down', '😔', '😢', '😞'],
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

// Function to send message to server
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Update status
    statusIndicator.textContent = 'Thinking...';
    statusIndicator.classList.add('thinking');
    
    try {
        // Add user message to history
        chatHistory.push({ role: 'user', content: message });
        
        // Send message to server
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                history: chatHistory
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add bot response to chat
        addMessageToChat(data.response, 'bot');
        
        // Add bot response to history
        chatHistory.push({ role: 'assistant', content: data.response });
        
        // Update language display if available
        if (data.detectedLanguage) {
            languageDisplay.textContent = `Language: ${data.detectedLanguage}`;
        }
        
        // Update status
        statusIndicator.textContent = 'Online';
        statusIndicator.classList.remove('thinking');
        
    } catch (error) {
        console.error('Error:', error);
        statusIndicator.textContent = 'Error: ' + error.message;
        statusIndicator.classList.remove('thinking');
        statusIndicator.classList.add('error');
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Initialize status
statusIndicator.textContent = 'Online';