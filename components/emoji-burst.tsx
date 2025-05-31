"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface EmojiParticle {
  id: number
  emoji: string
  x: number
  y: number
  scale: number
  rotation: number
}

const emojis = ["🔥", "😤", "😂", "✌️"]

export default function EmojiBurst() {
  const [particles, setParticles] = useState<EmojiParticle[]>([])

  useEffect(() => {
    const newParticles: EmojiParticle[] = []

    // Create 15-20 emoji particles
    for (let i = 0; i < 15 + Math.floor(Math.random() * 5); i++) {
      newParticles.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        scale: 0.5 + Math.random() * 1.5,
        rotation: Math.random() * 360,
      })
    }

    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            scale: 0,
            x: 0,
            y: 0,
            rotate: 0,
          }}
          animate={{
            scale: particle.scale,
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
            opacity: [1, 0],
          }}
          transition={{
            duration: 1 + Math.random(),
            ease: "easeOut",
          }}
          className="absolute text-2xl"
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  )
}
