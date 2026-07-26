import { useState, useRef } from "react";
import { motion } from "motion/react";

const keys = [1,2,3,4,5,6,7,8,9,"",0];

function Keypad({ onPress }) {

  const [activeKey,setActiveKey] = useState(null);

  const clickSound = useRef(new Audio("/sounds/click.mp3"));

  const handleClick = (num)=>{

      setActiveKey(num);

      clickSound.current.currentTime = 0;

      clickSound.current.play().catch(()=>{});

      onPress(num);

      setTimeout(()=>{

          setActiveKey(null);

      },180);

  };

  return (

    <div className="grid grid-cols-3 gap-5">

      {keys.map((num,index)=>{

          if(num==="") return <div key={index}></div>;

          return(

            <motion.button

                key={num}

                whileHover={{
                    scale:1.08,
                    boxShadow:"0 0 30px rgba(255,255,255,.35)"
                }}

                whileTap={{
                    scale:.88
                }}

                onClick={()=>handleClick(num)}

                className={`
                    h-[78px]
                    w-[78px]
                    rounded-full
                    text-3xl
                    font-bold
                    transition-all
                    duration-200

                    ${
                        activeKey===num
                        ?
                        "bg-pink-400 text-white shadow-[0_0_40px_rgba(255,90,140,.9)]"
                        :
                        "bg-white text-slate-700 hover:bg-pink-100"
                    }
                `}
            >

                {num}

            </motion.button>

          );

      })}

    </div>

  );

}

export default Keypad;