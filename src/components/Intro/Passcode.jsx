import { motion } from "motion/react";

function Passcode({ password }) {
  return (
    <div className="flex justify-center gap-5">

      {[0, 1, 2, 3].map((index) => (

        <motion.div
          key={index}
          animate={{
            scale: password.length === index + 1 ? [1, 1.12, 1] : 1,
          }}
          transition={{
            duration: 0.25,
          }}
          className={`
            h-18
            w-18
            rounded-2xl
            border-2
            flex
            items-center
            justify-center
            text-3xl
            font-bold
            transition-all
            duration-300

            ${
              password[index]
                ? `
                  bg-pink-400
                  border-pink-300
                  text-white
                  shadow-[0_0_30px_rgba(255,90,140,.65)]
                `
                : `
                  bg-white/10
                  border-white/25
                  backdrop-blur-md
                `
            }
          `}
        >
          {password[index] ? "•" : ""}
        </motion.div>

      ))}

    </div>
  );
}

export default Passcode;