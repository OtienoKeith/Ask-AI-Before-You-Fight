/**
 * Ask AI Before You Fight - Main Application Structure
 * 
 * This application is a voice-activated AI response system that helps users
 * get witty responses to their complaints using Google's Gemini AI.
 * 
 * Main Components:
 * 1. Home (app/page.tsx)
 *    - Main application component
 *    - Handles voice input and AI response
 *    - Manages UI state and animations
 * 
 * 2. ResponseCard (components/response-card.tsx)
 *    - Displays AI responses with typing animation
 *    - Includes text-to-speech functionality
 * 
 * 3. EmojiBurst (components/emoji-burst.tsx)
 *    - Visual feedback animation
 * 
 * Key Features:
 * - Voice Input: Uses Web Speech API for speech-to-text
 * - AI Integration: Uses Google Gemini AI for responses
 * - Text-to-Speech: Uses Web Speech API for response playback
 * - Animated UI: Uses Framer Motion for smooth animations
 * 
 * File Structure:
 * /app
 *   ├── page.tsx           # Main application component
 *   ├── layout.tsx         # Root layout
 *   └── globals.css        # Global styles
 * 
 * /components
 *   ├── response-card.tsx  # Response display component
 *   └── emoji-burst.tsx    # Animation component
 * 
 * /lib
 *   ├── generate-response.ts  # AI response generation
 *   └── utils.ts             # Utility functions
 * 
 * Environment Variables:
 * - NEXT_PUBLIC_GEMINI_API_KEY: Google Gemini AI API key
 * 
 * Dependencies:
 * - @google/generative-ai: Google Gemini AI SDK
 * - framer-motion: Animation library
 * - lucide-react: Icon library
 * - tailwindcss: Styling
 * 
 * Browser Requirements:
 * - Chrome or Edge for speech recognition
 * - Microphone access
 * - Internet connection
 * 
 * Usage:
 * 1. Click the microphone button to start recording
 * 2. Speak your complaint
 * 3. Click again to stop recording
 * 4. Wait for AI response
 * 5. Use speaker button to hear response
 * 
 * Error Handling:
 * - Network errors: Automatic retry (3 attempts)
 * - Microphone access: Clear error messages
 * - Browser compatibility: Support checks
 * - AI response: Fallback messages
 */

export {} 