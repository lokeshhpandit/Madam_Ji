import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoveMeter from "./LoveMeter";
import AttemptCounter from "./AttemptCounter";
import Passcode from "./Passcode";
import Keypad from "./Keypad";

const CORRECT_PASSWORD = "1730";

function RightPanel() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [love, setLove] = useState(0);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePress = (num) => {
    if (password.length >= 4) return;

    const newPassword = password + num;
    setPassword(newPassword);

    if (newPassword.length === 4) {
      setTimeout(() => {
        if (newPassword === CORRECT_PASSWORD) {
          setLove(100);

          setSuccess(true);

          setTimeout(() => {
            navigate("/birthday");
          }, 1200);
        } else {
          setAttempts((prev) => prev + 1);

          setShake(true);

          setTimeout(() => {
            setPassword("");
            setShake(false);
          }, 700);
        }
      }, 250);
    }
  };

  return (
    <div
      className={`
        w-[420px]
        rounded-[34px]
        border
        border-white/20
        bg-white/10
        backdrop-blur-2xl
        px-20
        py-20
        shadow-[0_25px_70px_rgba(0,0,0,.35)]
        transition-all
        duration-700

        ${shake ? "animate-pulse" : ""}
        ${success ? "scale-110 opacity-0 blur-md" : ""}
      `}
    >
      <LoveMeter love={love} />

      <AttemptCounter attempts={attempts} />

      {/* Heading */}

      <div className="mt-8 mb-10">

        <h1 className="text-center text-4xl font-bold text-white">
          Enter Passcode
        </h1>

      </div>

      {/* Passcode */}

      <div className="mb-14">

        <Passcode password={password} />

      </div>

      {/* Keypad */}

      <div className="flex justify-center">

        <Keypad onPress={handlePress} />

      </div>
    </div>
  );
}

export default RightPanel;