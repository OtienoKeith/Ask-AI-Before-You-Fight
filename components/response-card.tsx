"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"

interface ResponseCardProps {
  response: string
}

export default function ResponseCard({ response }: ResponseCardProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [])

  useEffect(() => {
    if (currentIndex < response.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev: string) => prev + response[currentIndex])
        setCurrentIndex(currentIndex + 1)
      }, 30) // Speed of typing animation

      return () => clearTimeout(timer)
    }
  }, [currentIndex, response])

  const toggleSpeech = () => {
    if (!speechSynthesis) return

    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(response)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="w-full max-w-2xl"
    >
      <div className="bg-black/40 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold text-white">AI Response:</h3>
          <button
            onClick={toggleSpeech}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            title={isSpeaking ? "Stop speaking" : "Speak response"}
          >
            {isSpeaking ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        <p className="text-white/90 leading-relaxed">
          {displayText}
          {currentIndex < response.length && (
            <span className="inline-block w-2 h-4 bg-white/70 ml-1 animate-pulse"></span>
          )}
        </p>
      </div>
    </motion.div>
  )
}
