'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Menu, X } from 'lucide-react';

type Topic = 'dynamic_base_multiplication' | 'number_line_subtraction' | 'percentage_breakdowns' | 'base50_squaring' | 'even_gap_multiplication' | 'special_multipliers' | 'one_line_multiplication';
type Difficulty = 'easy' | 'medium' | 'hard';

// Question Generator
const generateQuestion = (topic: Topic, difficulty: Difficulty) => {
  if (topic === 'dynamic_base_multiplication') {
    if (difficulty === 'easy') {
      const min = 90;
      const max = 110;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: Math.floor(Math.random() * (max - min + 1)) + min,
      };
    } else if (difficulty === 'medium') {
      const base = Math.random() > 0.5 ? 200 : 300;
      const min = base - 10;
      const max = base + 10;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: Math.floor(Math.random() * (max - min + 1)) + min,
      };
    } else {
      // hard: base 1000
      const min = 980;
      const max = 1020;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: Math.floor(Math.random() * (max - min + 1)) + min,
      };
    }
  } else if (topic === 'number_line_subtraction') {
    if (difficulty === 'easy') {
      let n1 = Math.floor(Math.random() * 90) + 10;
      let n2 = Math.floor(Math.random() * 90) + 10;
      if (n1 === n2) n1 = Math.min(99, n1 + 1);
      return {
        num1: Math.max(n1, n2),
        num2: Math.min(n1, n2),
      };
    } else if (difficulty === 'medium') {
      let n1 = Math.floor(Math.random() * 900) + 100;
      let n2 = Math.floor(Math.random() * 900) + 100;
      if (n1 === n2) n1 = Math.min(999, n1 + 1);
      return {
        num1: Math.max(n1, n2),
        num2: Math.min(n1, n2),
      };
    } else {
      let n1 = Math.floor(Math.random() * 9000) + 1000;
      let n2 = Math.floor(Math.random() * 900) + 100; // 3 or 4 digit
      if (Math.random() > 0.5) n2 = Math.floor(Math.random() * 9000) + 1000;
      if (n1 === n2) n1 = Math.min(9999, n1 + 1);
      return {
        num1: Math.max(n1, n2),
        num2: Math.min(n1, n2),
      };
    }
  } else if (topic === 'percentage_breakdowns') {
    let percentages: number[] = [];
    if (difficulty === 'easy') {
      percentages = [10, 20, 50];
    } else if (difficulty === 'medium') {
      percentages = [11, 15, 16, 21, 51, 26];
    } else {
      percentages = [17.5, 32.5, 49, 99];
    }
    const num1 = percentages[Math.floor(Math.random() * percentages.length)];
    let num2 = Math.floor(Math.random() * 900) + 100;
    while (num2 % 2 !== 0 && num2 % 5 !== 0) {
      num2 = Math.floor(Math.random() * 900) + 100;
    }
    return { num1, num2 };
  } else if (topic === 'even_gap_multiplication') {
    let gap = 2;
    if (difficulty === 'easy') {
      gap = 2;
    } else if (difficulty === 'medium') {
      gap = Math.random() > 0.5 ? 4 : 6;
    } else {
      gap = [8, 10, 12][Math.floor(Math.random() * 3)];
    }
    const min = 10 + gap / 2;
    const max = 99 - gap / 2;
    const middle = Math.floor(Math.random() * (max - min + 1)) + min;
    return {
      num1: middle - gap / 2,
      num2: middle + gap / 2,
    };
  } else if (topic === 'special_multipliers') {
    let min = 10;
    let max = 99;
    if (difficulty === 'easy') {
      min = 10; max = 99;
    } else if (difficulty === 'medium') {
      min = 100; max = 999;
    } else {
      min = 1000; max = 9999;
    }
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const ops = [11, 12, 5];
    const num2 = ops[Math.floor(Math.random() * ops.length)];
    return { num1, num2 };
  } else if (topic === 'one_line_multiplication') {
    if (difficulty === 'hard') {
      const min = 100;
      const max = 999;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: Math.floor(Math.random() * (max - min + 1)) + min,
      };
    } else {
      const min = 10;
      const max = 99;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: Math.floor(Math.random() * (max - min + 1)) + min,
      };
    }
  } else {
    // base50_squaring
    if (difficulty === 'easy') {
      const min = 40;
      const max = 60;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: 0,
      };
    } else if (difficulty === 'medium') {
      const min = 31;
      const max = 69;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: 0,
      };
    } else {
      const min = 70;
      const max = 130;
      return {
        num1: Math.floor(Math.random() * (max - min + 1)) + min,
        num2: 0,
      };
    }
  }
};

export default function GitGudMathApp() {
  const [currentTopic, setCurrentTopic] = useState<Topic>('dynamic_base_multiplication');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState({ num1: 98, num2: 99 });
  const [userAnswer, setUserAnswer] = useState('');
  
  // Percentage Breakdowns Scratchpad State
  const [scratchpadValues, setScratchpadValues] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number>(0);
  
  const [showHint, setShowHint] = useState<0 | 1 | 2>(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Gamification & Timer State
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [averageTime, setAverageTime] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState<number | null>(null);
  const [maxPointsForCurrent, setMaxPointsForCurrent] = useState(100);
  const [showFlame, setShowFlame] = useState(false);

  // Simulated tracking object
  const [practiceLog, setPracticeLog] = useState<Record<string, number>>({});
  
  // Daily Commute State
  const [isDailyCommute, setIsDailyCommute] = useState(false);
  const [commuteProgress, setCommuteProgress] = useState(1);
  const [commuteTopics, setCommuteTopics] = useState<Topic[]>([]);
  const [topicStats, setTopicStats] = useState<Record<string, { attempts: number, correct: number }>>({});
  
  // App Navigation & Settings
  type Screen = 'home' | 'practice' | 'summary';
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [typingDirection, setTypingDirection] = useState<'ltr' | 'rtl'>('ltr');

  // Session Tracking
  const [sessionAttempts, setSessionAttempts] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotalTime, setSessionTotalTime] = useState(0);

  // Reset session when starting practice
  const startPractice = (topic: Topic) => {
    setCurrentTopic(topic);
    setSessionAttempts(0);
    setSessionCorrect(0);
    setSessionTotalTime(0);
    setCurrentScreen('practice');
    setIsMenuOpen(false);
  };

  const endSession = () => {
    setCurrentScreen('summary');
    setIsDailyCommute(false);
  };

  // One-Line Multiplication Hint State
  const [hintStep, setHintStep] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentQuestion(generateQuestion(currentTopic, difficulty));
    setUserAnswer('');
    setScratchpadValues([]);
    setActiveInputIndex(0);
    setShowHint(0);
    setIsCorrect(null);
    setTimer(0);
    setIsActive(true);
    setMaxPointsForCurrent(100);
    setEarnedPoints(null);
  }, [currentTopic, difficulty]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && currentScreen === 'practice') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        setSessionTotalTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, currentScreen]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const checkAnswer = useCallback(() => {
    if (!userAnswer) return;
    
    let correctAnswer: number;
    if (currentTopic === 'dynamic_base_multiplication') {
      correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    } else if (currentTopic === 'number_line_subtraction') {
      correctAnswer = currentQuestion.num1 - currentQuestion.num2;
    } else if (currentTopic === 'percentage_breakdowns') {
      correctAnswer = Math.round(currentQuestion.num1 * currentQuestion.num2) / 100;
    } else if (currentTopic === 'even_gap_multiplication') {
      correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    } else if (currentTopic === 'special_multipliers') {
      if (currentQuestion.num2 === 5) {
        correctAnswer = currentQuestion.num1 / 5;
      } else {
        correctAnswer = currentQuestion.num1 * currentQuestion.num2;
      }
    } else if (currentTopic === 'one_line_multiplication') {
      correctAnswer = currentQuestion.num1 * currentQuestion.num2;
    } else {
      correctAnswer = currentQuestion.num1 * currentQuestion.num1;
    }

    if (parseFloat(userAnswer) === correctAnswer) {
      setIsCorrect(true);
      setIsActive(false); // Stop timer
      
      // Update stats
      setTopicStats(prev => ({
        ...prev,
        [currentTopic]: {
          attempts: (prev[currentTopic]?.attempts || 0) + 1,
          correct: (prev[currentTopic]?.correct || 0) + 1
        }
      }));
      setSessionAttempts(prev => prev + 1);
      setSessionCorrect(prev => prev + 1);

      // Calculate points
      const points = maxPointsForCurrent;
      setScore((prev) => prev + points);
      setEarnedPoints(points);

      // Streak & Flame logic
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      const isFastAndNoHints = maxPointsForCurrent === 100 && (averageTime === 0 || timer < averageTime);
      if (newStreak > 3 || isFastAndNoHints) {
        setShowFlame(true);
      } else {
        setShowFlame(false);
      }

      // Update average time
      const newTotal = totalQuestions + 1;
      setAverageTime((prev) => ((prev * totalQuestions) + timer) / newTotal);
      setTotalQuestions(newTotal);
      
      // Log practice
      setPracticeLog((prev) => ({ ...prev, [currentTopic]: Date.now() }));

      // Move to next question after a short delay
      setTimeout(() => {
        if (isDailyCommute) {
          if (commuteProgress < 15) {
            const nextTopic = commuteTopics[commuteProgress];
            setCommuteProgress(prev => prev + 1);
            setCurrentTopic(nextTopic);
            setCurrentQuestion(generateQuestion(nextTopic, difficulty));
          } else {
            setIsDailyCommute(false);
            setCommuteProgress(1);
            setCurrentScreen('summary');
          }
        } else {
          setCurrentQuestion(generateQuestion(currentTopic, difficulty));
        }
        setUserAnswer('');
        setScratchpadValues([]);
        setActiveInputIndex(0);
        setShowHint(0);
        setHintStep(0);
        setIsCorrect(null);
        setTimer(0);
        setIsActive(true);
        setMaxPointsForCurrent(100);
        setEarnedPoints(null);
      }, 1500);
    } else {
      setIsCorrect(false);
      
      // Update stats
      setTopicStats(prev => ({
        ...prev,
        [currentTopic]: {
          attempts: (prev[currentTopic]?.attempts || 0) + 1,
          correct: (prev[currentTopic]?.correct || 0)
        }
      }));
      setSessionAttempts(prev => prev + 1);

      setStreak(0); // Reset streak on wrong answer
      setShowFlame(false);
      // Shake animation or visual feedback could be added here
      setTimeout(() => setIsCorrect(null), 500);
    }
  }, [userAnswer, currentTopic, currentQuestion, maxPointsForCurrent, streak, averageTime, timer, totalQuestions, difficulty, isDailyCommute, commuteProgress, commuteTopics]);

  const startDailyCommute = () => {
    const allTopics: Topic[] = [
      'dynamic_base_multiplication',
      'number_line_subtraction',
      'percentage_breakdowns',
      'base50_squaring',
      'even_gap_multiplication',
      'special_multipliers',
      'one_line_multiplication'
    ];

    // Priority 1: Older than 48 hours
    const now = Date.now();
    const fortyEightHours = 48 * 60 * 60 * 1000;
    let selected: Topic[] = [];

    const oldTopics = allTopics.filter(t => !practiceLog[t] || (now - practiceLog[t] > fortyEightHours));
    selected.push(...oldTopics);

    // Priority 2: Lowest accuracy
    const remaining = allTopics.filter(t => !selected.includes(t));
    remaining.sort((a, b) => {
      const accA = topicStats[a] ? (topicStats[a].correct / topicStats[a].attempts) : 0;
      const accB = topicStats[b] ? (topicStats[b].correct / topicStats[b].attempts) : 0;
      return accA - accB;
    });

    selected.push(...remaining);

    // We need 15 questions. We can repeat topics.
    const sessionTopics: Topic[] = [];
    let i = 0;
    while (sessionTopics.length < 15) {
      sessionTopics.push(selected[i % selected.length]);
      i++;
    }

    // Shuffle the session topics
    for (let j = sessionTopics.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [sessionTopics[j], sessionTopics[k]] = [sessionTopics[k], sessionTopics[j]];
    }

    setCommuteTopics(sessionTopics);
    setCommuteProgress(1);
    setIsDailyCommute(true);
    setCurrentTopic(sessionTopics[0]);
    setIsMenuOpen(false);
    setSessionAttempts(0);
    setSessionCorrect(0);
    setSessionTotalTime(0);
    setCurrentScreen('practice');
  };

  const handleKeyPress = useCallback((key: string) => {
    if (isCorrect) return; // Don't allow input if already correct and waiting for next question

    if (currentTopic === 'percentage_breakdowns' || currentTopic === 'special_multipliers') {
      let numInputs = 1;
      if (currentTopic === 'percentage_breakdowns') {
        const pct = currentQuestion.num1;
        let chunks: number[] = [];
        if (pct === 10 || pct === 20 || pct === 50) chunks = [pct];
        else if (pct === 11) chunks = [10, 1];
        else if (pct === 15) chunks = [10, 5];
        else if (pct === 16) chunks = [10, 5, 1];
        else if (pct === 21) chunks = [10, 10, 1];
        else if (pct === 51) chunks = [50, 1];
        else if (pct === 26) chunks = [25, 1];
        else if (pct === 17.5) chunks = [10, 5, 2.5];
        else if (pct === 32.5) chunks = [25, 5, 2.5];
        else if (pct === 49) chunks = [50, 1];
        else if (pct === 99) chunks = [100, 1];
        else chunks = [pct];
        numInputs = chunks.length + 1;
      } else if (currentTopic === 'special_multipliers') {
        numInputs = 3;
      }

      if (key === 'Enter') {
        if (activeInputIndex === numInputs - 1) {
          checkAnswer();
        } else {
          setActiveInputIndex((prev) => Math.min(prev + 1, numInputs - 1));
        }
      } else if (key === 'Backspace') {
        if (activeInputIndex === numInputs - 1) {
          setUserAnswer((prev) => typingDirection === 'ltr' ? prev.slice(0, -1) : prev.slice(1));
        } else {
          setScratchpadValues((prev) => {
            const newVals = [...prev];
            newVals[activeInputIndex] = typingDirection === 'ltr' 
              ? (newVals[activeInputIndex] || '').slice(0, -1)
              : (newVals[activeInputIndex] || '').slice(1);
            return newVals;
          });
        }
      } else if (key === '.') {
        if (activeInputIndex === numInputs - 1) {
          setUserAnswer((prev) => {
            if (prev.includes('.')) return prev;
            if (prev.length >= 6) return prev;
            return typingDirection === 'ltr' ? prev + key : key + prev;
          });
        } else {
          setScratchpadValues((prev) => {
            const newVals = [...prev];
            const currentVal = newVals[activeInputIndex] || '';
            if (currentVal.includes('.')) return newVals;
            if (currentVal.length >= 6) return newVals;
            newVals[activeInputIndex] = typingDirection === 'ltr' ? currentVal + key : key + currentVal;
            return newVals;
          });
        }
      } else {
        if (activeInputIndex === numInputs - 1) {
          setUserAnswer((prev) => {
            if (prev.length >= 6) return prev;
            return typingDirection === 'ltr' ? prev + key : key + prev;
          });
        } else {
          setScratchpadValues((prev) => {
            const newVals = [...prev];
            const currentVal = newVals[activeInputIndex] || '';
            if (currentVal.length >= 6) return newVals;
            newVals[activeInputIndex] = typingDirection === 'ltr' ? currentVal + key : key + currentVal;
            return newVals;
          });
        }
      }
    } else {
      // Normal input for other topics
      if (key === 'Enter') {
        checkAnswer();
      } else if (key === 'Backspace') {
        setUserAnswer((prev) => typingDirection === 'ltr' ? prev.slice(0, -1) : prev.slice(1));
      } else if (key === '.') {
        setUserAnswer((prev) => {
          if (prev.includes('.')) return prev;
          if (prev.length >= 6) return prev;
          return typingDirection === 'ltr' ? prev + key : key + prev;
        });
      } else {
        setUserAnswer((prev) => {
          // Limit length to prevent overflow
          if (prev.length >= 6) return prev;
          return typingDirection === 'ltr' ? prev + key : key + prev;
        });
      }
    }
  }, [isCorrect, checkAnswer, currentTopic, currentQuestion.num1, activeInputIndex, typingDirection]);

  const cycleHint = () => {
    setShowHint((prev) => {
      if (prev === 0) {
        setMaxPointsForCurrent((m) => Math.min(m, 50));
        return 1;
      }
      if (prev === 1) {
        setMaxPointsForCurrent((m) => Math.min(m, 10));
        return 2;
      }
      return 0;
    });
  };

  const toggleSolution = () => {
    if (showHint === 2) {
      setShowHint(0);
    } else {
      setMaxPointsForCurrent((m) => Math.min(m, 10));
      setShowHint(2);
    }
  };

  // Dynamic Base Math Logic
  let base = 100;
  if (currentTopic === 'dynamic_base_multiplication') {
    if (difficulty === 'easy') base = 100;
    else if (difficulty === 'medium') {
      base = Math.abs(currentQuestion.num1 - 200) < Math.abs(currentQuestion.num1 - 300) ? 200 : 300;
    } else {
      base = 1000;
    }
  }

  const diff1 = currentQuestion.num1 - base;
  const diff2 = currentQuestion.num2 - base;
  let crossAdd = currentQuestion.num1 + diff2;
  
  const baseMultiplier = base === 1000 ? 1 : base / 100;
  let leftSide = crossAdd * baseMultiplier;
  
  let multDiff = diff1 * diff2;
  const rightSideDigits = base === 1000 ? 3 : 2;
  const rightSideMod = Math.pow(10, rightSideDigits);
  
  if (multDiff < 0) {
    leftSide -= 1;
    multDiff += rightSideMod;
  } else if (multDiff >= rightSideMod) {
    const carry = Math.floor(multDiff / rightSideMod);
    leftSide += carry;
    multDiff = multDiff % rightSideMod;
  }
  
  const multDiffStr = multDiff.toString().padStart(rightSideDigits, '0');
  const finalAnswerDynamicBase = `${leftSide}${multDiffStr}`;

  const globalAttempts = Object.values(topicStats).reduce((acc, curr) => acc + curr.attempts, 0);
  const globalCorrect = Object.values(topicStats).reduce((acc, curr) => acc + curr.correct, 0);
  const globalAccuracy = globalAttempts > 0 ? Math.round((globalCorrect / globalAttempts) * 100) : 0;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fef08a] font-sans text-gray-800 selection:bg-yellow-200 overflow-hidden relative">
      {/* Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="w-4/5 max-w-sm h-full bg-[#fef08a] border-r-4 border-gray-800 shadow-[8px_0px_0px_rgba(31,41,55,1)] p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold tracking-wider">TOPICS</h2>
                <button onClick={() => setIsMenuOpen(false)} className="active:scale-90 transition-transform">
                  <X size={32} strokeWidth={3} className="text-gray-800" />
                </button>
              </div>

              <div className="mb-6">
                <button
                  onClick={startDailyCommute}
                  className="w-full py-4 rounded-2xl border-4 border-gray-800 bg-[#3b82f6] text-white font-black text-xl md:text-2xl tracking-wider uppercase shadow-[4px_4px_0px_rgba(31,41,55,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_rgba(31,41,55,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  <span>🚀</span> Start Daily Commute
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-gray-600">Difficulty</h3>
                <div className="flex gap-2">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`flex-1 py-2 rounded-xl border-2 border-gray-800 font-bold capitalize transition-all ${difficulty === d ? 'bg-[#f87171] text-white shadow-[2px_2px_0px_rgba(31,41,55,1)] translate-x-[-1px] translate-y-[-1px]' : 'bg-white hover:bg-gray-50'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 overflow-y-auto pb-4">
                <button 
                  onClick={() => {
                    setCurrentTopic('dynamic_base_multiplication');
                    setIsMenuOpen(false);
                  }}
                  className={`p-4 rounded-2xl border-4 border-gray-800 text-left font-bold text-xl transition-all ${currentTopic === 'dynamic_base_multiplication' ? 'bg-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  Dynamic Base Multiplication
                </button>
                <button 
                  onClick={() => {
                    setCurrentTopic('number_line_subtraction');
                    setIsMenuOpen(false);
                  }}
                  className={`p-4 rounded-2xl border-4 border-gray-800 text-left font-bold text-xl transition-all ${currentTopic === 'number_line_subtraction' ? 'bg-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  Number Line Subtraction
                </button>
                <button 
                  onClick={() => {
                    setCurrentTopic('percentage_breakdowns');
                    setIsMenuOpen(false);
                  }}
                  className={`p-4 rounded-2xl border-4 border-gray-800 text-left font-bold text-xl transition-all ${currentTopic === 'percentage_breakdowns' ? 'bg-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  Percentage Breakdowns
                </button>
                <button 
                  onClick={() => {
                    setCurrentTopic('base50_squaring');
                    setIsMenuOpen(false);
                  }}
                  className={`p-4 rounded-2xl border-4 border-gray-800 text-left font-bold text-xl transition-all ${currentTopic === 'base50_squaring' ? 'bg-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  Base 50 Squaring
                </button>
                <button 
                  onClick={() => {
                    setCurrentTopic('even_gap_multiplication');
                    setIsMenuOpen(false);
                  }}
                  className={`p-4 rounded-2xl border-4 border-gray-800 text-left font-bold text-xl transition-all ${currentTopic === 'even_gap_multiplication' ? 'bg-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  Even Gap Multiplication
                </button>
                <button 
                  onClick={() => {
                    setCurrentTopic('special_multipliers');
                    setIsMenuOpen(false);
                    setIsDailyCommute(false);
                  }}
                  className={`p-4 rounded-2xl border-4 border-gray-800 text-left font-bold text-xl transition-all ${currentTopic === 'special_multipliers' ? 'bg-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  Special Multipliers
                </button>
                <button 
                  onClick={() => {
                    setCurrentTopic('one_line_multiplication');
                    setIsMenuOpen(false);
                    setIsDailyCommute(false);
                  }}
                  className={`p-4 rounded-2xl border-4 border-gray-800 text-left font-bold text-xl transition-all ${currentTopic === 'one_line_multiplication' ? 'bg-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-50'}`}
                >
                  One-Line Multiplication
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentScreen === 'home' && (
        <div className="flex-1 flex flex-col overflow-y-auto w-full max-w-2xl mx-auto p-4 md:p-6 pb-24">
          <div className="flex flex-col items-center justify-center mt-8 mb-12">
            <h1 className="text-5xl md:text-6xl font-black tracking-widest text-gray-800 mb-2">GIT GUD.</h1>
            <p className="text-xl font-bold text-gray-600 uppercase tracking-widest">Speed Maths</p>
          </div>

          <div className="bg-white border-4 border-gray-800 rounded-3xl p-6 shadow-[8px_8px_0px_rgba(31,41,55,1)] mb-10">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-6 border-b-4 border-gray-800 pb-2">Global Stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#bbf7d0] border-2 border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-[4px_4px_0px_rgba(31,41,55,1)]">
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Lifetime Score</div>
                <div className="text-3xl font-black text-gray-800">{score}</div>
              </div>
              <div className="bg-[#fecaca] border-2 border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-[4px_4px_0px_rgba(31,41,55,1)]">
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Accuracy</div>
                <div className="text-3xl font-black text-gray-800">
                  {globalAccuracy}%
                </div>
              </div>
              <div className="bg-[#bfdbfe] border-2 border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center shadow-[4px_4px_0px_rgba(31,41,55,1)] col-span-2">
                <div className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">Global Avg Time</div>
                <div className="text-3xl font-black text-gray-800">{averageTime > 0 ? averageTime.toFixed(1) : '0.0'}s</div>
              </div>
            </div>
          </div>

          <button
            onClick={startDailyCommute}
            className="w-full py-6 rounded-3xl border-4 border-gray-800 bg-[#3b82f6] text-white font-black text-2xl md:text-3xl tracking-wider uppercase shadow-[8px_8px_0px_rgba(31,41,55,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_rgba(31,41,55,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-4 mb-10"
          >
            <span>🚀</span> Start Daily Commute
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black uppercase tracking-wider mb-6 border-b-4 border-gray-800 pb-2">Q - Quants</h2>
            <div className="flex flex-col gap-4">
              {[
                { id: 'dynamic_base_multiplication', name: 'Dynamic Base Multiplication' },
                { id: 'number_line_subtraction', name: 'Number Line Subtraction' },
                { id: 'percentage_breakdowns', name: 'Percentage Breakdowns' },
                { id: 'base50_squaring', name: 'Base 50 Squaring' },
                { id: 'even_gap_multiplication', name: 'Even Gap Multiplication' },
                { id: 'special_multipliers', name: 'Special Multipliers' },
                { id: 'one_line_multiplication', name: 'One-Line Multiplication' }
              ].map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => startPractice(topic.id as Topic)}
                  className="w-full text-left bg-white border-4 border-gray-800 rounded-2xl p-5 shadow-[4px_4px_0px_rgba(31,41,55,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all flex justify-between items-center group"
                >
                  <span className="font-bold text-lg md:text-xl text-gray-800">{topic.name}</span>
                  <span className="text-2xl opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'summary' && (
        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto w-full max-w-2xl mx-auto p-4 md:p-6">
          <div className="bg-white border-4 border-gray-800 rounded-3xl p-8 shadow-[12px_12px_0px_rgba(31,41,55,1)] w-full max-w-md flex flex-col items-center">
            <h2 className="text-4xl font-black uppercase tracking-wider mb-2 text-center">Session End</h2>
            <p className="text-xl font-bold text-gray-500 mb-8 uppercase tracking-widest">Summary</p>
            
            <div className="w-full flex flex-col gap-4 mb-10">
              <div className="flex justify-between items-center border-b-4 border-gray-800/20 pb-4">
                <span className="text-lg font-bold text-gray-600 uppercase tracking-wider">Questions</span>
                <span className="text-3xl font-black text-gray-800">{sessionAttempts}</span>
              </div>
              <div className="flex justify-between items-center border-b-4 border-gray-800/20 pb-4">
                <span className="text-lg font-bold text-gray-600 uppercase tracking-wider">Accuracy</span>
                <span className="text-3xl font-black text-gray-800">
                  {sessionAttempts > 0 ? Math.round((sessionCorrect / sessionAttempts) * 100) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-lg font-bold text-gray-600 uppercase tracking-wider">Avg Time</span>
                <span className="text-3xl font-black text-gray-800">
                  {sessionAttempts > 0 ? (sessionTotalTime / sessionAttempts).toFixed(1) : '0.0'}s
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentScreen('home')}
              className="w-full py-5 rounded-2xl border-4 border-gray-800 bg-[#fde047] text-gray-800 font-black text-xl tracking-wider uppercase shadow-[6px_6px_0px_rgba(31,41,55,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_rgba(31,41,55,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <span>🏠</span> Back to Home
            </button>
          </div>
        </div>
      )}

      {currentScreen === 'practice' && (
        <>
          {/* Header */}
      <header className="p-4 md:p-6 flex items-center justify-between relative z-10 w-full max-w-2xl mx-auto">
        <div className="flex-1 flex justify-start">
          <div 
            onClick={() => setIsMenuOpen(true)}
            className="w-12 h-12 bg-[#a7f3d0] rounded-2xl border-2 border-gray-800 flex flex-col justify-center items-center shadow-[2px_2px_0px_rgba(31,41,55,1)] cursor-pointer active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            <Menu className="text-gray-800" size={24} strokeWidth={2.5} />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider">GIT GUD.</h1>
          {isDailyCommute ? (
            <div className="text-sm md:text-base font-bold text-[#3b82f6] mt-1 bg-white px-3 py-1 rounded-full border-2 border-gray-800 shadow-[2px_2px_0px_rgba(31,41,55,1)]">
              Commute: {commuteProgress}/15
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1">
              <p className="text-lg md:text-xl font-medium">streak {streak}</p>
              <AnimatePresence>
                {showFlame && (
                  <motion.span 
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="text-xl"
                  >
                    🔥
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col items-end justify-center">
          <div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-xl border-2 border-gray-800 shadow-[2px_2px_0px_rgba(31,41,55,1)] font-mono text-lg font-bold">
            {formatTime(timer)}
          </div>
          <div className="text-sm font-bold mt-1 text-gray-600">
            Score: {score}
          </div>
          <button 
            onClick={endSession}
            className="mt-2 text-xs font-bold bg-white border-2 border-gray-800 px-2 py-1 rounded-lg shadow-[2px_2px_0px_rgba(31,41,55,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
          >
            ⏹️ End Session
          </button>
        </div>
      </header>

      {/* Main Display Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 w-full max-w-2xl mx-auto pb-8">
        
        {/* Question */}
        <div className="text-5xl md:text-6xl lg:text-7xl text-[#3b82f6] font-bold mb-8 md:mb-12 tracking-widest drop-shadow-sm text-center">
          {currentTopic === 'dynamic_base_multiplication' && `${currentQuestion.num1} x ${currentQuestion.num2} ?`}
          {currentTopic === 'number_line_subtraction' && `${currentQuestion.num1} - ${currentQuestion.num2} ?`}
          {currentTopic === 'percentage_breakdowns' && `${currentQuestion.num1}% of ${currentQuestion.num2} ?`}
          {currentTopic === 'base50_squaring' && `${currentQuestion.num1}² ?`}
          {currentTopic === 'even_gap_multiplication' && `${currentQuestion.num1} x ${currentQuestion.num2} ?`}
          {currentTopic === 'special_multipliers' && (currentQuestion.num2 === 5 ? `${currentQuestion.num1} ÷ 5 ?` : `${currentQuestion.num1} x ${currentQuestion.num2} ?`)}
          {currentTopic === 'one_line_multiplication' && `${currentQuestion.num1} x ${currentQuestion.num2} ?`}
        </div>

        {/* Input Box & Floating Points */}
        <div className="relative mb-8 md:mb-12 w-full flex flex-col items-center">
          {currentTopic === 'percentage_breakdowns' || currentTopic === 'special_multipliers' ? (
            <div className="flex flex-col gap-4 w-full max-w-sm">
              {(() => {
                let labels: string[] = [];
                let numInputs = 1;
                
                if (currentTopic === 'percentage_breakdowns') {
                  const pct = currentQuestion.num1;
                  let chunks: number[] = [];
                  if (pct === 10 || pct === 20 || pct === 50) chunks = [pct];
                  else if (pct === 11) chunks = [10, 1];
                  else if (pct === 15) chunks = [10, 5];
                  else if (pct === 16) chunks = [10, 5, 1];
                  else if (pct === 21) chunks = [10, 10, 1];
                  else if (pct === 51) chunks = [50, 1];
                  else if (pct === 26) chunks = [25, 1];
                  else if (pct === 17.5) chunks = [10, 5, 2.5];
                  else if (pct === 32.5) chunks = [25, 5, 2.5];
                  else if (pct === 49) chunks = [50, 1]; // 50% - 1%
                  else if (pct === 99) chunks = [100, 1]; // 100% - 1%
                  else chunks = [pct];
                  
                  labels = chunks.map(c => `${c}%`);
                  numInputs = chunks.length + 1;
                } else if (currentTopic === 'special_multipliers') {
                  numInputs = 3;
                  if (difficulty === 'easy') {
                    if (currentQuestion.num2 === 11) labels = ['x10:', 'x1:'];
                    else if (currentQuestion.num2 === 12) labels = ['x10:', 'x2:'];
                    else if (currentQuestion.num2 === 5) labels = ['x2:', '÷10:'];
                  } else {
                    labels = ['', '']; // Blank labels for medium/hard
                  }
                }

                return (
                  <>
                    {numInputs > 1 && (
                      <div className="flex flex-col gap-2 w-full">
                        {labels.map((label, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 text-right font-bold text-xl text-gray-600">{label}</div>
                            <div 
                              onClick={() => setActiveInputIndex(idx)}
                              className={`flex-1 h-14 bg-white border-2 border-gray-800 rounded-xl flex items-center px-4 text-2xl font-bold tracking-widest cursor-pointer transition-all ${activeInputIndex === idx ? 'ring-4 ring-[#a7f3d0] shadow-[4px_4px_0px_rgba(31,41,55,1)]' : 'opacity-70'}`}
                            >
                              {scratchpadValues[idx] || ''}
                              {activeInputIndex === idx && <span className="w-0.5 h-6 bg-gray-800 animate-pulse ml-1"></span>}
                            </div>
                          </div>
                        ))}
                        <div className="w-full border-t-4 border-gray-800/20 my-2"></div>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {numInputs > 1 && <div className="w-16 text-right font-bold text-2xl text-gray-800">Total</div>}
                      <motion.div 
                        onClick={() => setActiveInputIndex(numInputs - 1)}
                        animate={isCorrect === false && activeInputIndex === numInputs - 1 ? { x: [-10, 10, -10, 10, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        className={`relative flex-1 h-20 md:h-24 bg-[#bbf7d0] border-2 border-gray-800 rounded-2xl flex items-center justify-center text-4xl md:text-5xl font-bold tracking-widest overflow-hidden transition-all cursor-pointer ${isCorrect === true ? 'bg-green-400' : isCorrect === false ? 'bg-red-300' : ''} ${activeInputIndex === numInputs - 1 ? 'ring-4 ring-[#3b82f6] shadow-[4px_4px_0px_rgba(31,41,55,1)] scale-105' : 'shadow-[4px_4px_0px_rgba(31,41,55,1)]'}`}
                      >
                        {userAnswer}
                        {activeInputIndex === numInputs - 1 && <span className="w-0.5 h-10 md:h-12 bg-gray-800 animate-pulse ml-1"></span>}
                        <button
                          onClick={(e) => { e.stopPropagation(); setTypingDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr'); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-gray-800 rounded-xl flex items-center justify-center font-bold text-xs shadow-[2px_2px_0px_rgba(31,41,55,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                          title="Toggle Typing Direction"
                        >
                          {typingDirection === 'ltr' ? '→LTR' : '←RTL'}
                        </button>
                      </motion.div>
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <motion.div 
              animate={isCorrect === false ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`relative w-64 md:w-80 h-20 md:h-24 bg-[#bbf7d0] border-2 border-gray-800 rounded-2xl shadow-[4px_4px_0px_rgba(31,41,55,1)] flex items-center justify-center text-4xl md:text-5xl font-bold tracking-widest overflow-hidden transition-colors ${isCorrect === true ? 'bg-green-400' : isCorrect === false ? 'bg-red-300' : ''}`}
            >
              {userAnswer}
              {!userAnswer && <span className="w-0.5 h-10 md:h-12 bg-gray-800 animate-pulse ml-1"></span>}
              <button
                onClick={(e) => { e.stopPropagation(); setTypingDirection(prev => prev === 'ltr' ? 'rtl' : 'ltr'); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-gray-800 rounded-xl flex items-center justify-center font-bold text-xs shadow-[2px_2px_0px_rgba(31,41,55,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                title="Toggle Typing Direction"
              >
                {typingDirection === 'ltr' ? '→LTR' : '←RTL'}
              </button>
            </motion.div>
          )}

          {/* Floating Points Animation */}
          <AnimatePresence>
            {earnedPoints !== null && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ opacity: 1, y: -60, scale: 1.2 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute top-0 text-3xl font-bold text-green-600 drop-shadow-md z-20 pointer-events-none"
              >
                +{earnedPoints}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-8 md:gap-16 w-full relative z-20">
          {/* Hint Button (Diamond) */}
          <button 
            onClick={cycleHint}
            className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center group active:scale-95 transition-transform"
          >
            <div className="absolute inset-0 bg-[#fecaca] border-2 border-[#ef4444] transform rotate-45 rounded-2xl shadow-[4px_4px_0px_rgba(239,68,68,0.5)] group-active:shadow-[1px_1px_0px_rgba(239,68,68,0.5)] group-active:translate-y-[3px] group-active:translate-x-[3px] transition-all"></div>
            <span className="relative z-10 text-[#ef4444] font-bold text-xl md:text-2xl transform -rotate-0">hint</span>
          </button>

          {/* Solution Button (Circle) */}
          <button 
            onClick={toggleSolution}
            className="w-16 h-16 md:w-20 md:h-20 bg-[#bfdbfe] border-2 border-[#3b82f6] rounded-full flex items-center justify-center shadow-[4px_4px_0px_rgba(59,130,246,0.5)] active:shadow-[1px_1px_0px_rgba(59,130,246,0.5)] active:translate-y-[3px] active:translate-x-[3px] transition-all"
          >
            <span className="text-[#3b82f6] font-bold text-xl md:text-2xl">sol.</span>
          </button>
        </div>
      </main>

      {/* Hint Modal Overlay */}
      <AnimatePresence>
        {showHint > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4"
            onClick={() => setShowHint(0)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#fde68a] border-4 border-gray-800 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_rgba(31,41,55,1)] w-full max-w-sm"
            >
              <button 
                onClick={() => setShowHint(0)}
                className="absolute top-4 right-4 text-gray-800 hover:text-red-500 transition-colors"
              >
                <X size={28} strokeWidth={3} />
              </button>

              {currentTopic === 'dynamic_base_multiplication' ? (
                <>
                  <div className="text-center text-sm md:text-base text-[#ef4444] mb-6 leading-tight font-bold uppercase tracking-wider">
                    difference from {base}
                  </div>
                  
                  <div className="flex justify-center items-center text-5xl md:text-6xl text-[#ef4444] font-bold mb-6">
                    <div className="flex flex-col items-end mr-4 gap-3">
                      <span>{currentQuestion.num1}</span>
                      <span>{currentQuestion.num2}</span>
                    </div>
                    <div className="flex flex-col items-center mx-4 gap-3 text-4xl font-light opacity-50">
                      <span>|</span>
                      <span>|</span>
                    </div>
                    <div className="flex flex-col items-start gap-3">
                      <span>{diff1 > 0 ? `+${diff1}` : diff1}</span>
                      <span>{diff2 > 0 ? `+${diff2}` : diff2}</span>
                    </div>
                  </div>

                  {showHint === 2 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex flex-col items-center overflow-hidden border-t-4 border-gray-800/20 pt-6 mt-2"
                    >
                      <div className="text-base md:text-lg text-[#ef4444] mb-4 font-bold text-center w-full">
                        {currentQuestion.num2}{diff1 > 0 ? `+${diff1}` : diff1} or {currentQuestion.num1}{diff2 > 0 ? `+${diff2}` : diff2} <span className="mx-2 opacity-50">|</span> {diff1} x {diff2} = {diff1 * diff2 > 0 ? `+${diff1 * diff2}` : diff1 * diff2}
                      </div>
                      <div className="flex justify-center items-center text-5xl md:text-6xl text-[#ef4444] font-bold mb-6">
                        <span className="mr-4 flex flex-col items-center">
                          <span>{crossAdd}</span>
                          {baseMultiplier !== 1 && <span className="text-2xl mt-1 opacity-80">x {baseMultiplier} = {crossAdd * baseMultiplier}</span>}
                        </span>
                        <span className="border-l-4 border-[#ef4444] pl-4 relative">
                          {diff1 * diff2 > 0 ? `+${diff1 * diff2}` : diff1 * diff2}
                          <svg className="absolute -bottom-4 left-2 w-full h-5 text-[#ef4444]" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,10 Q50,20 100,5" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                          </svg>
                        </span>
                      </div>
                      <div className="text-sm md:text-base text-[#ef4444] text-center w-full mb-2 font-bold uppercase tracking-wider opacity-80">base {base}</div>
                      <div className="text-5xl md:text-6xl text-[#ef4444] font-black w-full text-center bg-white/40 py-3 rounded-2xl border-2 border-[#ef4444]/20">
                        ={finalAnswerDynamicBase}
                      </div>
                    </motion.div>
                  )}
                </>
              ) : currentTopic === 'number_line_subtraction' ? (
                <>
                  <div className="text-center text-sm md:text-base text-[#ef4444] mb-6 leading-tight font-bold uppercase tracking-wider">
                    Find the distance
                  </div>
                  
                  <div className="flex justify-between items-center text-4xl md:text-5xl text-[#ef4444] font-bold mb-6 relative w-full px-2">
                    <span>{currentQuestion.num2}</span>
                    <div className="flex-1 border-b-4 border-dashed border-[#ef4444] mx-4 relative">
                      <div className="absolute -right-2 -top-2.5 w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-[#ef4444] border-b-[10px] border-b-transparent"></div>
                    </div>
                    <span>{currentQuestion.num1}</span>
                  </div>

                  {showHint === 2 && (() => {
                    const start = currentQuestion.num2;
                    const end = currentQuestion.num1;
                    
                    if (Math.floor(start / 10) === Math.floor(end / 10)) {
                      const jump = end - start;
                      return (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="flex flex-col items-center overflow-hidden border-t-4 border-gray-800/20 pt-6 mt-2 w-full"
                        >
                          <div className="flex flex-col gap-3 w-full text-xl md:text-2xl text-[#ef4444] font-bold mb-4">
                             <div className="flex justify-between w-full"><span>Direct jump:</span><span>{start} + {jump} = {end}</span></div>
                          </div>
                          <div className="text-4xl md:text-5xl text-[#ef4444] font-black w-full text-center bg-white/40 py-3 rounded-2xl border-2 border-[#ef4444]/20 mt-2">
                            ={jump}
                          </div>
                        </motion.div>
                      );
                    }

                    const next10 = Math.ceil(start / 10) * 10;
                    const jump1 = next10 - start;
                    
                    const target10 = Math.floor(end / 10) * 10;
                    const jump2 = target10 - next10;
                    
                    const jump3 = end - target10;
                    
                    const total = jump1 + jump2 + jump3;
                    
                    const jumps = [];
                    if (jump1 > 0) jumps.push(jump1);
                    if (jump2 > 0) jumps.push(jump2);
                    if (jump3 > 0) jumps.push(jump3);

                    return (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex flex-col items-center overflow-hidden border-t-4 border-gray-800/20 pt-6 mt-2 w-full"
                      >
                        <div className="flex flex-col gap-3 w-full text-lg md:text-xl text-[#ef4444] font-bold mb-4">
                          {jump1 > 0 && <div className="flex justify-between w-full"><span>To nearest 10:</span><span>{start} + {jump1} = {next10}</span></div>}
                          {jump2 > 0 && <div className="flex justify-between w-full"><span>To target&apos;s 10:</span><span>{next10} + {jump2} = {target10}</span></div>}
                          {jump3 > 0 && <div className="flex justify-between w-full"><span>To final digit:</span><span>{target10} + {jump3} = {end}</span></div>}
                        </div>
                        
                        <div className="text-3xl md:text-4xl text-[#ef4444] font-black w-full text-center bg-white/40 py-3 rounded-2xl border-2 border-[#ef4444]/20 mt-2">
                          {jumps.join(' + ')} = {total}
                        </div>
                      </motion.div>
                    );
                  })()}
                </>
              ) : currentTopic === 'percentage_breakdowns' ? (
                <>
                  <div className="text-center text-sm md:text-base text-[#ef4444] mb-6 leading-tight font-bold uppercase tracking-wider">
                    Break it down
                  </div>
                  
                  {(() => {
                    const pct = currentQuestion.num1;
                    const val = currentQuestion.num2;
                    let chunks: { p: number, v: number, op: '+' | '-' }[] = [];
                    if (pct === 10 || pct === 20 || pct === 50) chunks = [{p: pct, v: val * (pct/100), op: '+'}];
                    else if (pct === 11) chunks = [{p: 10, v: val * 0.1, op: '+'}, {p: 1, v: val * 0.01, op: '+'}];
                    else if (pct === 15) chunks = [{p: 10, v: val * 0.1, op: '+'}, {p: 5, v: val * 0.05, op: '+'}];
                    else if (pct === 16) chunks = [{p: 10, v: val * 0.1, op: '+'}, {p: 5, v: val * 0.05, op: '+'}, {p: 1, v: val * 0.01, op: '+'}];
                    else if (pct === 21) chunks = [{p: 10, v: val * 0.1, op: '+'}, {p: 10, v: val * 0.1, op: '+'}, {p: 1, v: val * 0.01, op: '+'}];
                    else if (pct === 51) chunks = [{p: 50, v: val * 0.5, op: '+'}, {p: 1, v: val * 0.01, op: '+'}];
                    else if (pct === 26) chunks = [{p: 25, v: val * 0.25, op: '+'}, {p: 1, v: val * 0.01, op: '+'}];
                    else if (pct === 17.5) chunks = [{p: 10, v: val * 0.1, op: '+'}, {p: 5, v: val * 0.05, op: '+'}, {p: 2.5, v: val * 0.025, op: '+'}];
                    else if (pct === 32.5) chunks = [{p: 25, v: val * 0.25, op: '+'}, {p: 5, v: val * 0.05, op: '+'}, {p: 2.5, v: val * 0.025, op: '+'}];
                    else if (pct === 49) chunks = [{p: 50, v: val * 0.5, op: '+'}, {p: 1, v: val * 0.01, op: '-'}];
                    else if (pct === 99) chunks = [{p: 100, v: val * 1, op: '+'}, {p: 1, v: val * 0.01, op: '-'}];
                    else {
                      chunks = [{p: pct, v: val * (pct/100), op: '+'}];
                    }

                    const formatChunkValue = (v: number) => {
                      if (Number.isInteger(v)) return v.toFixed(1);
                      return v.toString();
                    };

                    return (
                      <>
                        <div className="flex justify-center items-center text-3xl md:text-4xl text-[#ef4444] font-bold mb-6 flex-wrap gap-2">
                          {pct}% = {chunks.map((c, i) => i === 0 ? `${c.p}%` : `${c.op} ${c.p}%`).join(' ')}
                        </div>

                        {showHint === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex flex-col items-center overflow-hidden border-t-4 border-gray-800/20 pt-6 mt-2 w-full"
                          >
                            <div className="flex flex-col items-end gap-2 text-2xl md:text-3xl text-[#ef4444] font-bold mb-4">
                              {chunks.map((c, i) => (
                                <div key={i} className="flex justify-between w-48">
                                  <span>{i === 0 ? '' : c.op} {c.p}% =</span>
                                  <span>{formatChunkValue(c.v)}</span>
                                </div>
                              ))}
                            </div>
                            
                            <div className="w-48 border-t-4 border-[#ef4444] my-2"></div>
                            
                            <div className="text-4xl md:text-5xl text-[#ef4444] font-black w-full text-center bg-white/40 py-3 rounded-2xl border-2 border-[#ef4444]/20 mt-2">
                              ={Math.round(chunks.reduce((sum, c) => c.op === '+' ? sum + c.v : sum - c.v, 0) * 100) / 100}
                            </div>
                          </motion.div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : currentTopic === 'even_gap_multiplication' ? (
                <>
                  <div className="text-center text-sm md:text-base text-[#ef4444] mb-6 leading-tight font-bold uppercase tracking-wider">
                    Difference of Squares
                  </div>
                  
                  {(() => {
                    const n1 = currentQuestion.num1;
                    const n2 = currentQuestion.num2;
                    const middle = (n1 + n2) / 2;
                    const gap = Math.abs(n1 - middle);
                    
                    return (
                      <>
                        <div className="flex flex-col items-center text-2xl md:text-3xl text-[#ef4444] font-bold mb-6 gap-2">
                          <div>({middle} - {gap})({middle} + {gap})</div>
                          <div>= {middle}² - {gap}²</div>
                        </div>

                        {showHint === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex flex-col items-center overflow-hidden border-t-4 border-gray-800/20 pt-6 mt-2 w-full"
                          >
                            <div className="flex flex-col items-center gap-2 text-2xl md:text-3xl text-[#ef4444] font-bold mb-4">
                              <div>{middle * middle} - {gap * gap}</div>
                            </div>
                            
                            <div className="text-4xl md:text-5xl text-[#ef4444] font-black w-full text-center bg-white/40 py-3 rounded-2xl border-2 border-[#ef4444]/20 mt-2">
                              ={n1 * n2}
                            </div>
                          </motion.div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : currentTopic === 'special_multipliers' ? (
                <>
                  <div className="text-center text-sm md:text-base text-[#ef4444] mb-6 leading-tight font-bold uppercase tracking-wider">
                    Mental Breakdown
                  </div>
                  
                  {(() => {
                    const n = currentQuestion.num1;
                    const op = currentQuestion.num2;
                    
                    return (
                      <>
                        <div className="flex flex-col items-center text-2xl md:text-3xl text-[#ef4444] font-bold mb-6 gap-2">
                          {op === 11 && <div>{n} x 10 + {n} x 1</div>}
                          {op === 12 && <div>{n} x 10 + {n} x 2</div>}
                          {op === 5 && <div>({n} x 2) ÷ 10</div>}
                        </div>

                        {showHint === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex flex-col items-center overflow-hidden border-t-4 border-gray-800/20 pt-6 mt-2 w-full"
                          >
                            <div className="flex flex-col items-center gap-2 text-2xl md:text-3xl text-[#ef4444] font-bold mb-4">
                              {op === 11 && <div>{n * 10} + {n}</div>}
                              {op === 12 && <div>{n * 10} + {n * 2}</div>}
                              {op === 5 && <div>{n * 2} ÷ 10</div>}
                            </div>
                            
                            <div className="text-4xl md:text-5xl text-[#ef4444] font-black w-full text-center bg-white/40 py-3 rounded-2xl border-2 border-[#ef4444]/20 mt-2">
                              ={op === 5 ? n / 5 : n * op}
                            </div>
                          </motion.div>
                        )}
                      </>
                    );
                  })()}
                </>
              ) : currentTopic === 'one_line_multiplication' ? (
                <>
                  <div className="text-center text-sm md:text-base text-[#ef4444] mb-6 leading-tight font-bold uppercase tracking-wider">
                    One-Line Method
                  </div>
                  
                  {(() => {
                    const n1 = currentQuestion.num1.toString();
                    const n2 = currentQuestion.num2.toString();
                    const is3x3 = n1.length === 3 && n2.length === 3;
                    const totalSteps = is3x3 ? 5 : 3;
                    
                    let stepDetails = [];
                    let carry = 0;
                    let resultStr = '';
                    
                    if (is3x3) {
                      const a = parseInt(n1[0]), b = parseInt(n1[1]), c = parseInt(n1[2]);
                      const d = parseInt(n2[0]), e = parseInt(n2[1]), f = parseInt(n2[2]);
                      
                      let prod = c * f;
                      let stepSum = prod + carry;
                      let digit = stepSum % 10;
                      let nextCarry = Math.floor(stepSum / 10);
                      resultStr = digit.toString() + resultStr;
                      stepDetails.push({ title: 'Units', math: `${c} x ${f}`, sum: prod, carryIn: carry, carryOut: nextCarry, digit, resultSoFar: resultStr, active1: [2], active2: [2] });
                      carry = nextCarry;
                      
                      prod = b * f + c * e;
                      stepSum = prod + carry;
                      digit = stepSum % 10;
                      nextCarry = Math.floor(stepSum / 10);
                      resultStr = digit.toString() + resultStr;
                      stepDetails.push({ title: 'Cross 1', math: `${b}x${f} + ${c}x${e}`, sum: prod, carryIn: carry, carryOut: nextCarry, digit, resultSoFar: resultStr, active1: [1, 2], active2: [1, 2] });
                      carry = nextCarry;
                      
                      prod = a * f + c * d + b * e;
                      stepSum = prod + carry;
                      digit = stepSum % 10;
                      nextCarry = Math.floor(stepSum / 10);
                      resultStr = digit.toString() + resultStr;
                      stepDetails.push({ title: 'Star', math: `${a}x${f} + ${c}x${d} + ${b}x${e}`, sum: prod, carryIn: carry, carryOut: nextCarry, digit, resultSoFar: resultStr, active1: [0, 1, 2], active2: [0, 1, 2] });
                      carry = nextCarry;
                      
                      prod = a * e + b * d;
                      stepSum = prod + carry;
                      digit = stepSum % 10;
                      nextCarry = Math.floor(stepSum / 10);
                      resultStr = digit.toString() + resultStr;
                      stepDetails.push({ title: 'Cross 2', math: `${a}x${e} + ${b}x${d}`, sum: prod, carryIn: carry, carryOut: nextCarry, digit, resultSoFar: resultStr, active1: [0, 1], active2: [0, 1] });
                      carry = nextCarry;
                      
                      prod = a * d;
                      stepSum = prod + carry;
                      resultStr = stepSum.toString() + resultStr;
                      stepDetails.push({ title: 'Hundreds', math: `${a} x ${d}`, sum: prod, carryIn: carry, carryOut: 0, digit: stepSum, resultSoFar: resultStr, active1: [0], active2: [0] });
                      
                    } else {
                      const a = parseInt(n1[0]), b = parseInt(n1[1]);
                      const c = parseInt(n2[0]), d = parseInt(n2[1]);
                      
                      let prod = b * d;
                      let stepSum = prod + carry;
                      let digit = stepSum % 10;
                      let nextCarry = Math.floor(stepSum / 10);
                      resultStr = digit.toString() + resultStr;
                      stepDetails.push({ title: 'Units', math: `${b} x ${d}`, sum: prod, carryIn: carry, carryOut: nextCarry, digit, resultSoFar: resultStr, active1: [1], active2: [1] });
                      carry = nextCarry;
                      
                      prod = a * d + b * c;
                      stepSum = prod + carry;
                      digit = stepSum % 10;
                      nextCarry = Math.floor(stepSum / 10);
                      resultStr = digit.toString() + resultStr;
                      stepDetails.push({ title: 'Cross', math: `${a}x${d} + ${b}x${c}`, sum: prod, carryIn: carry, carryOut: nextCarry, digit, resultSoFar: resultStr, active1: [0, 1], active2: [0, 1] });
                      carry = nextCarry;
                      
                      prod = a * c;
                      stepSum = prod + carry;
                      resultStr = stepSum.toString() + resultStr;
                      stepDetails.push({ title: 'Tens', math: `${a} x ${c}`, sum: prod, carryIn: carry, carryOut: 0, digit: stepSum, resultSoFar: resultStr, active1: [0], active2: [0] });
                    }
                    
                    const currentStep = stepDetails[hintStep];

                    return (
                      <div className="flex flex-col items-center w-full">
                        {showHint === 1 ? (
                          <div className="text-2xl font-bold text-gray-800 mb-4">
                            Requires {totalSteps} steps
                          </div>
                        ) : (
                          <div className="w-full flex flex-col items-center">
                            <div className="font-mono text-5xl md:text-6xl font-bold text-gray-800 mb-6 relative inline-block">
                              <div className="flex justify-end gap-4 md:gap-6">
                                {n1.split('').map((d, i) => (
                                  <span key={`n1-${i}`} className={`${currentStep.active1.includes(i) ? 'text-[#ef4444]' : 'opacity-30'}`}>{d}</span>
                                ))}
                              </div>
                              <div className="flex justify-end gap-4 md:gap-6 mt-2">
                                {n2.split('').map((d, i) => (
                                  <span key={`n2-${i}`} className={`${currentStep.active2.includes(i) ? 'text-[#ef4444]' : 'opacity-30'}`}>{d}</span>
                                ))}
                              </div>
                              <div className="absolute -left-10 md:-left-12 bottom-0 text-4xl opacity-50">x</div>
                              <div className="w-full border-b-4 border-gray-800 mt-4"></div>
                            </div>
                            
                            <div className="bg-white/50 p-4 rounded-xl border-2 border-[#ef4444]/20 w-full mb-6 text-center">
                              <div className="text-[#ef4444] font-bold uppercase tracking-wider mb-2 text-sm">Step {hintStep + 1}: {currentStep.title}</div>
                              <div className="text-2xl font-bold text-gray-800">{currentStep.math} = {currentStep.sum}</div>
                              {currentStep.carryIn > 0 && <div className="text-lg text-green-600 font-bold">+ {currentStep.carryIn} (carry) = {currentStep.sum + currentStep.carryIn}</div>}
                              <div className="text-xl font-bold text-gray-600 mt-2">
                                Write: <span className="text-[#ef4444] text-3xl">{currentStep.digit}</span>
                                {currentStep.carryOut > 0 && <span className="text-sm ml-2">(carry {currentStep.carryOut})</span>}
                              </div>
                            </div>
                            
                            <div className="text-3xl font-black text-gray-800 mb-6">
                              Result: <span className="text-[#ef4444] tracking-widest">{currentStep.resultSoFar.padStart(n1.length + n2.length, '_')}</span>
                            </div>
                            
                            <div className="flex gap-4 w-full">
                              <button 
                                onClick={() => setHintStep(prev => Math.max(0, prev - 1))}
                                disabled={hintStep === 0}
                                className="flex-1 py-3 bg-white border-2 border-gray-800 rounded-xl font-bold disabled:opacity-50 shadow-[2px_2px_0px_rgba(31,41,55,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                              >
                                Prev
                              </button>
                              <button 
                                onClick={() => setHintStep(prev => Math.min(totalSteps - 1, prev + 1))}
                                disabled={hintStep === totalSteps - 1}
                                className="flex-1 py-3 bg-[#a7f3d0] border-2 border-gray-800 rounded-xl font-bold disabled:opacity-50 shadow-[2px_2px_0px_rgba(31,41,55,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all"
                              >
                                Next
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              ) : (
                <>
                  <div className="text-center text-sm md:text-base text-[#ef4444] mb-6 leading-tight font-bold uppercase tracking-wider">
                    Difference from 50
                  </div>
                  
                  {(() => {
                    const num = currentQuestion.num1;
                    const diff = num - 50;
                    const diffStr = diff > 0 ? `+${diff}` : `${diff}`;
                    const left = 25 + diff;
                    const right = diff * diff;
                    const rightMod = right % 100;
                    const rightStr = rightMod < 10 ? `0${rightMod}` : `${rightMod}`;
                    const carry = right >= 100 ? Math.floor(right / 100) : 0;
                    const finalLeft = left + carry;

                    return (
                      <>
                        <div className="flex flex-col items-center text-3xl md:text-4xl text-[#ef4444] font-bold mb-6">
                          <div>Diff: {diffStr}</div>
                          <div className="text-lg opacity-70 mt-2">Base is 25</div>
                        </div>

                        {showHint === 2 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="flex flex-col items-center overflow-hidden border-t-4 border-gray-800/20 pt-6 mt-2 w-full"
                          >
                            <div className="flex justify-center w-full text-2xl md:text-3xl text-[#ef4444] font-bold mb-4">
                              <div className="flex flex-col items-center px-4">
                                <div className="text-sm opacity-70 mb-1">25 + ({diffStr})</div>
                                <div>{left}</div>
                                {carry > 0 && <div className="text-sm text-green-600 mt-1">+ {carry} carry</div>}
                              </div>
                              <div className="border-l-4 border-dashed border-[#ef4444] mx-2"></div>
                              <div className="flex flex-col items-center px-4">
                                <div className="text-sm opacity-70 mb-1">({diffStr})²</div>
                                <div>{rightStr}</div>
                              </div>
                            </div>
                            
                            <div className="text-4xl md:text-5xl text-[#ef4444] font-black w-full text-center bg-white/40 py-3 rounded-2xl border-2 border-[#ef4444]/20 mt-2">
                              ={finalLeft}{rightStr}
                            </div>
                          </motion.div>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Number Pad */}
      <div className="w-full bg-[#fef08a] border-t-4 border-gray-800 pb-safe z-20 relative mt-auto max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-20 md:h-24 lg:h-28 border-r-4 border-b-4 border-gray-800 text-4xl md:text-5xl font-bold flex items-center justify-center active:bg-[#fde047] transition-colors"
              style={{ borderRightWidth: num % 3 === 0 ? '0px' : '4px' }}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleKeyPress('.')}
            className="h-20 md:h-24 lg:h-28 border-r-4 border-gray-800 text-4xl md:text-5xl font-bold flex items-center justify-center active:bg-[#fde047] transition-colors"
          >
            .
          </button>
          <button
            onClick={() => handleKeyPress('0')}
            className="h-20 md:h-24 lg:h-28 border-r-4 border-gray-800 text-4xl md:text-5xl font-bold flex items-center justify-center active:bg-[#fde047] transition-colors"
          >
            0
          </button>
          <div className="flex flex-col h-20 md:h-24 lg:h-28">
            <button
              onClick={() => handleKeyPress('Backspace')}
              className="flex-1 border-b-4 border-gray-800 text-xl font-bold flex items-center justify-center active:bg-[#fde047] transition-colors text-red-500"
            >
              <Delete size={24} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => handleKeyPress('Enter')}
              className="flex-1 text-xl font-bold flex items-center justify-center active:bg-[#fde047] transition-colors text-green-600"
            >
              Enter
            </button>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
