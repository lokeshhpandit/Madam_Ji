import { useEffect, useState } from "react";
import { motion } from "motion/react";

function Countdown() {

  const targetDate = new Date("July 30, 2026 00:00:00").getTime();

  const calculateTimeLeft = () => {

    const now = new Date().getTime();

    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }

    return {
      days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
      hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
      minutes: String(Math.floor((difference / (1000 * 60)) % 60)).padStart(2, "0"),
      seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {

    const timer = setInterval(() => {

      setTimeLeft(calculateTimeLeft());

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  const boxes = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (

    <div className="w-full">

      {/* Heading */}
      <h2
        className="
          mb-20
          text-center
          text-4xl
          font-bold
          text-white
        "
      >
        Countdown Begins ❤️
      </h2>

      {/* Cards */}

      <div className="grid grid-cols-4 gap-6">

        {boxes.map((item) => (

          <motion.div
            key={item.label}
            whileHover={{
              y: -8,
              scale: 1.05,
            }}
            className="
              rounded-3xl
              border
              border-white/20
              bg-white/10
              py-6
              backdrop-blur-xl
              text-center
              shadow-xl
            "
          >

            <motion.h1
              key={item.value}
              initial={{ scale: .8 }}
              animate={{ scale: 1 }}
              transition={{ duration: .25 }}
              className="
                text-5xl
                font-bold
                text-pink-300
              "
            >
              {item.value}
            </motion.h1>

            <p
              className="
                mt-3
                text-sm
                uppercase
                tracking-[3px]
                text-white/80
              "
            >
              {item.label}
            </p>

          </motion.div>

        ))}

      </div>

    </div>

  );
}

export default Countdown;