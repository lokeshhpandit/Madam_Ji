import { motion } from "motion/react";

function AttemptCounter({ attempts }) {
  return (
    <motion.div
      layout
      className="
        mb-10
        rounded-2xl
        border
        border-white/20
        bg-white/10
        backdrop-blur-md
        p-5
        text-center
      "
    >
      <p className="text-sm uppercase tracking-[4px] text-white/70">
        Unsuccessful Attempts
      </p>

      <motion.h2
        key={attempts}
        initial={{
          scale: 0.6,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className="mt-2 text-5xl font-bold text-pink-300"
      >
        {attempts}
      </motion.h2>

      <p className="mt-2 text-sm text-white/60">
        Don't worry... Love always gives another chance ❤️
      </p>
    </motion.div>
  );
}

export default AttemptCounter;