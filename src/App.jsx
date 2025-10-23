import { useState, useEffect, useRef } from "react";

const sampleTexts = [
  "Learning never exhausts the mind.",
  "Code is like humor. When you have to explain it, it’s bad.",
  "The best way to predict the future is to invent it.",
  "Experience is the name everyone gives to their mistakes."
];

export default function App() {
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const timerRef = useRef(null);

  useEffect(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
  }, []);

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          endTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;

    // Stop test on Enter key
    if (value.endsWith("\n")) {
      clearInterval(timerRef.current);
      endTest();
      return;
    }

    if (!isRunning && timeLeft > 0) {
      setIsRunning(true);
      startTimer();
    }

    setUserInput(value);
    calculateAccuracy(value);
    calculateWPM(value);
  };

  const calculateAccuracy = (value) => {
    const correctChars = value.split("").filter((ch, i) => ch === text[i]).length;
    const acc = text.length > 0 ? (correctChars / text.length) * 100 : 0;
    setAccuracy(acc.toFixed(1));
  };

  const calculateWPM = (value) => {
    const words = value.trim().split(/\s+/).filter(Boolean).length;
    const elapsedTime = 60 - timeLeft;
    if (elapsedTime > 0) {
      const minutes = elapsedTime / 60;
      const speed = (words / minutes).toFixed(1);
      setWpm(speed);
    }
  };

  const endTest = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    timerRef.current = null;
    calculateWPM(userInput);
  };

  const resetTest = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setUserInput("");
    setTimeLeft(60);
    setIsRunning(false);
    setWpm(0);
    setAccuracy(100);
    setText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
  };

  // Split text into colored spans
  const renderText = () => {
    return text.split("").map((char, idx) => {
      let colorClass = "text-gray-300";
      if (userInput[idx] != null) {
        colorClass = userInput[idx] === char ? "text-green-400" : "text-red-500";
      }
      return (
        <span key={idx} className={colorClass}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white px-4 py-6 sm:px-8 md:px-16 lg:px-24 font-sans">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10 border border-gray-700 flex flex-col gap-6">
        
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-blue-400 tracking-tight">
          ⚡ Typing Speed Tester
        </h1>

        {/* Sample text with colored spans */}
        <p className="text-center text-base sm:text-lg md:text-xl leading-relaxed font-medium">
          {renderText()}
        </p>

        {/* Typing area */}
        <textarea
          className="w-full h-36 sm:h-44 p-4 rounded-xl bg-gray-900 border border-gray-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base sm:text-lg font-medium"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here... (Press Enter to finish)"
          disabled={timeLeft === 0 || !text}
        />

        {/* Stats */}
        <div className="flex flex-col sm:flex-row sm:justify-between text-center sm:text-left gap-3 text-gray-300 text-sm sm:text-base">
          <p className="font-semibold">⏱️ Time Left: <span className="text-white">{timeLeft}s</span></p>
          <p className="font-semibold">💨 WPM: <span className="text-white">{wpm}</span></p>
          <p className="font-semibold">🎯 Accuracy: <span className="text-white">{accuracy}%</span></p>
        </div>

        {/* Restart button */}
        <button
          onClick={resetTest}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-base sm:text-lg transition-all self-center shadow-md"
        >
          Restart
        </button>
      </div>
    </div>
  );
}
