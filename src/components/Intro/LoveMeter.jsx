import { motion } from "motion/react";

function LoveMeter({ love }) {
  return (
    <div className="mb-10">

      <div className="flex items-center justify-between mb-3">

        <h3 className="text-lg font-semibold text-white tracking-wide">
          ❤️ Love Meter
        </h3>

        <motion.span
          key={love}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.25 }}
          className="text-pink-300 text-lg font-bold"
        >
          {love}%
        </motion.span>

      </div>

      <div className="h-4 w-full overflow-hidden rounded-full bg-white/15 backdrop-blur-md">

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${love}%` }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="h-full rounded-full bg-gradient-to-r
          from-pink-500
          via-rose-400
          to-red-500
          shadow-[0_0_25px_rgba(255,70,120,.7)]"
        />

      </div>

    </div>
  );
}

export default LoveMeter;