# Ask AI Before You Fight

A voice-activated AI response system that helps users get witty responses to their complaints using Google's Gemini AI.

## Features

- 🎤 Voice Input: Speak your complaints naturally
- 🤖 AI Responses: Get witty, Bronx-style roasts
- 🔊 Text-to-Speech: Listen to AI responses
- ✨ Animated UI: Smooth transitions and feedback
- 🎨 Modern Design: Beautiful, responsive interface

## Prerequisites

- Node.js 18+ and npm
- Google Gemini AI API key
- Chrome or Edge browser
- Microphone access

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ask-ai-before-you-fight
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Click the microphone button to start recording
2. Speak your complaint
3. Click the microphone button again to stop recording
4. Wait for the AI response
5. Use the speaker button to hear the response

## Project Structure

```
/app
  ├── page.tsx           # Main application component
  ├── layout.tsx         # Root layout
  └── globals.css        # Global styles

/components
  ├── response-card.tsx  # Response display component
  └── emoji-burst.tsx    # Animation component

/lib
  ├── generate-response.ts  # AI response generation
  └── utils.ts             # Utility functions
```

## Dependencies

- [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai): Google Gemini AI SDK
- [framer-motion](https://www.npmjs.com/package/framer-motion): Animation library
- [lucide-react](https://www.npmjs.com/package/lucide-react): Icon library
- [tailwindcss](https://www.npmjs.com/package/tailwindcss): Styling

## Error Handling

The application includes comprehensive error handling for:
- Network errors (automatic retry)
- Microphone access issues
- Browser compatibility
- AI response failures

## Browser Support

- Chrome (recommended)
- Edge
- Other browsers may have limited speech recognition support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for the AI capabilities
- Web Speech API for voice recognition
- Framer Motion for animations
- The Bronx community for inspiration "# Ask-AI-Before-You-Fight" 
"# Ask-AI-Before-You-Fight" 
