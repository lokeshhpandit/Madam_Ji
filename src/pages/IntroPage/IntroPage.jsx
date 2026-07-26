import { motion } from "motion/react";

import LeftPanel from "../../components/Intro/LeftPanel";
import RightPanel from "../../components/Intro/RightPanel";

function IntroPage() {
  return (
    <section
      className="
      relative
      min-h-screen
      overflow-hidden

      bg-gradient-to-br
      from-[#1ad7cb]
      via-[#0fa9a0]
      to-[#042c33]">

      {/* Top Glow */}
      <div
        className="
        absolute
        -left-40
        -top-40
        h-[550px]
        w-[550px]
        rounded-full
        bg-pink-400/20
        blur-[170px]"/>

      {/* Bottom Glow */}
      <div
        className="
        absolute
        -right-40
        -bottom-40
        h-[500px]
        w-[500px]
        rounded-full
        bg-cyan-300/20
        blur-[170px]"/>

      {/* Floating Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {Array.from({ length: 30 }).map((_, index) => (

          <motion.div
            key={index}
            animate={{
              y: [20, -120],
              opacity: [0, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + Math.random() * 5,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            className="
            absolute
            text-pink-200/30
            text-xl
            "
          >
            ❤️
          </motion.div>

        ))}

      </div>

      {/* Main Content */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.8,
        }}
        
        className="
        relative
        z-10
        mx-auto
        flex
        min-h-screen
        max-w-7xl
        items-center
        justify-between
        gap-24
        px-16">
          
        <LeftPanel />
        <RightPanel />

      </motion.div>
    </section>
  );
}

export default IntroPage;