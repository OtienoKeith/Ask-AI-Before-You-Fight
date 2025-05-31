"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send } from "lucide-react"
import ResponseCard from "@/components/response-card"
import EmojiBurst from "@/components/emoji-burst"
import { cn } from "@/lib/utils"
import { generateAIResponse } from "@/lib/generate-response"

export default function Home() {
  const [inputText, setInputText] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isResponding, setIsResponding] = useState(false)
  const [showEmojiBurst, setShowEmojiBurst] = useState(false)
  const [bgColor, setBgColor] = useState("from-red-900/30 to-amber-700/30")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputText.trim()) {
      setError("Please enter your complaint before submitting.")
      return
    }

    setError(null)
    setIsResponding(true)

    try {
      const response = await generateAIResponse(inputText)
      setAiResponse(response)
      setBgColor("from-blue-900/30 to-purple-700/30")
      setShowEmojiBurst(true)
      setTimeout(() => setShowEmojiBurst(false), 2000)
    } catch (err) {
      console.error("Error getting AI response:", err)
      setError("Failed to get AI response. Please try again.")
    } finally {
      setIsResponding(false)
    }
  }

  const clearForm = () => {
    setInputText("")
    setAiResponse("")
    setError(null)
    setBgColor("from-red-900/30 to-amber-700/30")
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
            <p>Type your beef.</p>
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

        <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="What's your beef? Tell me what's bothering you..."
              className="w-full h-32 bg-transparent text-white placeholder-white/60 resize-none outline-none text-lg"
              disabled={isResponding}
            />
            <div className="flex justify-between items-center mt-4">
              <button
                type="button"
                onClick={clearForm}
                className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                disabled={isResponding}
              >
                Clear
              </button>
              <motion.button
                type="submit"
                className={cn(
                  "px-6 py-3 rounded-full flex items-center gap-2",
                  "bg-gradient-to-br from-red-500 to-amber-500 shadow-lg",
                  "hover:shadow-xl transition-all duration-300 text-white font-medium",
                  isResponding ? "opacity-50 cursor-not-allowed" : "",
                )}
                whileTap={{ scale: 0.95 }}
                disabled={isResponding || !inputText.trim()}
              >
                {isResponding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Get Roasted
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>

        {inputText && !isResponding && !aiResponse && (
          <div className="w-full mb-8 px-4">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white">
              <p className="font-medium">Your complaint:</p>
              <p className="italic">{inputText}</p>
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