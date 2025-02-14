// LoaderPage.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Binary, Sparkles } from "lucide-react";

const LoaderPage: React.FC = () => {
  // We'll generate particles randomly over time to add some movement
  const [particles, setParticles] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newParticle = {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        id: Date.now() + Math.random()
      };
      setParticles((prev) => [...prev, newParticle]);

      // Remove particle after its animation duration (1 second)
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1000);
    }, 300); // generate a new particle every 300ms

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-[#2D0A54] to-[#6A1B9A] overflow-hidden">
      {/* Animated floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: particle.x, y: particle.y, opacity: 1 }}
          animate={{ y: particle.y - 100, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute pointer-events-none"
        >
          <Binary className="text-[#E040FB] w-4 h-4" />
        </motion.div>
      ))}

      {/* Central content: Glitchy "Loading" text and a subtitle */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <h1 className="relative text-[80px] md:text-[120px] font-bold text-white leading-none">
            {/* Glitch effect layers */}
            <span className="absolute inset-0 text-[#E040FB] opacity-50 animate-glitch-1">
              Loading
            </span>
            <span className="absolute inset-0 text-[#26A69A] opacity-50 animate-glitch-2">
              Loading
            </span>
            Loading
          </h1>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-[#E0B0FF]"
        >
          Please wait as we recalibrate the chronal matrix...
        </motion.div>
      </div>

      {/* Subtle decorative background elements */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ backgroundColor: ["rgba(224,64,251,0.03)", "rgba(38,166,154,0.03)"] }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
      />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
          }}
          animate={{
            y: [0, -20, 0],
            x: i % 2 === 0 ? [0, 20, 0] : [0, -20, 0]
          }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.1 }}
        >
          <Sparkles className="text-[#E040FB]/20 w-4 h-4" />
        </motion.div>
      ))}
    </main>
  );
};

export default LoaderPage;
