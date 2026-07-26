import { motion } from "motion/react";
import Countdown from "./Countdown";

function LeftPanel() {
  return (
    <div className="flex w-1/2 flex-col items-center justify-center">

      {/* Photo */}
      <div classname="mx-5 my-100 px-5 py-100" >
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [-3, -2, -3],
          }}
          transition={{
            repeat: Infinity,
            duration: 5,
            ease: "easeInOut",
          }}
          className="
            relative
            rounded-2xl
            bg-white
            p-6
            pb-8
            shadow-[0_25px_60px_rgba(0,0,0,.35)]">

          {/* Glow */}
          <div
            className="
              absolute
              -inset-5
              rounded-full
              bg-pink-300/20
              blur-[90px]
              -z-10"/>

          <img
            src="/images/intro-photo.jpg"
            alt="Our Memory"
            className="
              h-[410px]
              w-[330px]
              rounded-lg
              object-cover"/>

          <h2
            className="
              mt-6
              text-center
              text-2xl
              font-semibold
              text-slate-700
              px-2">
            Your Favourite Picture Of US ❤️
          </h2>
        </motion.div>
      </div>

      {/* Space between Photo and Countdown */}

      <div className="mt-16 w-full max-w-3xl">
        <Countdown />
      </div>

    </div>
  );
}

export default LeftPanel;