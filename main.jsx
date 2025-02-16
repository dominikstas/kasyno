import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const numbers = Array.from({ length: 37 }, (_, i) => i);

export default function Roulette() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const spinRoulette = () => {
    if (spinning) return;
    setSpinning(true);

    const randomIndex = Math.floor(Math.random() * numbers.length);
    const selectedNumber = numbers[randomIndex];

    setTimeout(() => {
      setResult(selectedNumber);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Ruletka Kasynowa</h1>
      <motion.div
        animate={{ rotate: spinning ? 1440 : 0 }}
        transition={{ duration: 3, ease: "easeInOut" }}
        className="w-40 h-40 bg-red-600 rounded-full flex items-center justify-center"
      >
        <span className="text-2xl font-bold">{spinning ? "🎰" : result}</span>
      </motion.div>
      <Button
        onClick={spinRoulette}
        className="mt-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded"
      >
        Zakręć!
      </Button>
    </div>
  );
}
