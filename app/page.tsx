"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic } from "lucide-react"
import ResponseCard from "@/components/response-card"
import EmojiBurst from "@/components/emoji-burst"
import { cn } from "@/lib/utils"
import { generateAIResponse } from "@/lib/generate-response"

// Add TypeScript interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  error: string;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export default function Home() {
  const [isListening, setIsListening] = useState(false)
  const [spokenText, setSpokenText] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isResponding, setIsResponding] = useState(false)
  const [showEmojiBurst, setShowEmojiBurst] = useState(false)
  const [bgColor, setBgColor] = useState("from-red-900/30 to-amber-700/30")
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const retryDelay = 2000 // 2 seconds

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const initializeSpeechRecognition = () => {
    if (typeof window === "undefined") return null

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser. Please use Chrome or Edge.")
      return null
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setError(null)
        setIsListening(true)
        setRetryCount(0)
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current)
          retryTimeoutRef.current = null
        }
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")

        setSpokenText(transcript)
      }

      recognition.onerror = (event: SpeechRecognitionError) => {
        console.error("Speech recognition error:", event.error)
        
        // Handle specific error types
        switch (event.error) {
          case "network":
            if (retryCount < maxRetries) {
              setRetryCount(prev => prev + 1)
              setError(`Network error. Retrying... (${retryCount + 1}/${maxRetries})`)
              
              // Clear any existing retry timeout
              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
              }

              // Set new retry timeout with exponential backoff
              const backoffDelay = retryDelay * Math.pow(2, retryCount)
              retryTimeoutRef.current = setTimeout(() => {
                try {
                  if (recognitionRef.current) {
                    recognitionRef.current.stop()
                    // Add a small delay before restarting
                    setTimeout(() => {
                      if (recognitionRef.current) {
                        recognitionRef.current.start()
                      }
                    }, 500)
                  }
                } catch (err) {
                  console.error("Error restarting recognition:", err)
                  setError("Failed to restart speech recognition. Please try again.")
                  setIsListening(false)
                }
              }, backoffDelay)
            } else {
              setError("Network error. Please check your internet connection and try again.")
              setIsListening(false)
              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current)
                retryTimeoutRef.current = null
              }
            }
            break
          case "not-allowed":
            setError("Microphone access denied. Please allow microphone access and try again.")
            setIsListening(false)
            break
          case "aborted":
            setError("Speech recognition was aborted. Please try again.")
            setIsListening(false)
            break
          case "audio-capture":
            setError("No microphone detected. Please connect a microphone and try again.")
            setIsListening(false)
            break
          case "no-speech":
            setError("No speech detected. Please try speaking again.")
            setIsListening(false)
            break
          default:
            setError(`Error: ${event.error}. Please try again.`)
            setIsListening(false)
        }
      }

      recognition.onend = () => {
        if (!error) {
          setIsListening(false)
        }
      }

      return recognition
    } catch (err) {
      console.error("Error initializing speech recognition:", err)
      setError("Failed to initialize speech recognition. Please refresh the page and try again.")
      return null
    }
  }

  useEffect(() => {
    recognitionRef.current = initializeSpeechRecognition()

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (err) {
          console.error("Error stopping speech recognition:", err)
        }
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [])

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not supported in your browser.")
      return
    }

    try {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)

        if (spokenText.trim()) {
          setIsResponding(true)
          try {
            const response = await generateAIResponse(spokenText)
            setAiResponse(response)
          } catch (err) {
            console.error("Error getting AI response:", err)
            setError("Failed to get AI response. Please try again.")
          } finally {
            setIsResponding(false)
          }
          setBgColor("from-blue-900/30 to-purple-700/30")
          setShowEmojiBurst(true)
          setTimeout(() => setShowEmojiBurst(false), 2000)
        }
      } else {
        setSpokenText("")
        setAiResponse("")
        setError(null)
        setRetryCount(0)
        setBgColor("from-red-900/30 to-amber-700/30")
        
        // Add a small delay before starting recognition
        setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.start()
            } catch (err) {
              console.error("Error starting recognition:", err)
              setError("Failed to start speech recognition. Please try again.")
            }
          }
        }, 100)
      }
    } catch (err) {
      console.error("Error toggling speech recognition:", err)
      setError("Failed to toggle speech recognition. Please try again.")
      setIsListening(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/school-hallway-confrontation.png')",
          }}
        />
        <div className={cn("absolute inset-0 bg-gradient-to-br transition-colors duration-1000", bgColor)} />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center flex-1 z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-6 text-white drop-shadow-[0_0_20px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
            Ask AI Before You Fight
          </h1>
          <div className="space-y-1 text-xl text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] [text-shadow:_1px_1px_3px_rgb(0_0_0_/_70%)]">
            <p>Speak your beef.</p>
            <p>Get a savage roast.</p>
            <p>Walk away winning.</p>
          </div>
        </div>

        {error && (
          <div className="w-full max-w-md mb-8 px-4">
            <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-4 text-white border border-red-500/50">
              <p className="font-medium text-red-200">{error}</p>
            </div>
          </div>
        )}

        <motion.button
          onClick={toggleListening}
          className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center mb-12",
            "bg-gradient-to-br from-red-500 to-amber-500 shadow-lg",
            "hover:shadow-xl transition-all duration-300",
            isListening ? "ring-4 ring-white ring-opacity-70" : "",
            error ? "opacity-50 cursor-not-allowed" : "",
          )}
          whileTap={{ scale: 0.95 }}
          animate={
            isListening
              ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(255,255,255,0.7)",
                    "0 0 0 20px rgba(255,255,255,0)",
                    "0 0 0 0 rgba(255,255,255,0)",
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: isListening ? Number.POSITIVE_INFINITY : 0,
            repeatType: "loop",
          }}
          disabled={!!error}
        >
          <Mic size={64} className="text-white" />
        </motion.button>

        <div className="text-center text-white/70 text-sm mb-4">
          {isListening ? "Listening..." : isResponding ? "Processing..." : "Tap to Speak"}
        </div>

        {spokenText && (
          <div className="w-full mb-8 px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <p className="font-medium">You said:</p>
              <p className="italic">{spokenText}</p>
            </div>
          </div>
        )}

        <AnimatePresence>{aiResponse && <ResponseCard response={aiResponse} />}</AnimatePresence>

        {showEmojiBurst && <EmojiBurst />}
      </div>

      <footer className="w-full text-center text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)] text-sm py-4">
        Powered by Google Gemini AI | Bronx Vibes Only
      </footer>
    </main>
  )
}
