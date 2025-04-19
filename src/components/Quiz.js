import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { BsClock, BsArrowRight, BsTrophy, BsLightningCharge } from 'react-icons/bs';
import { FaGlassMartiniAlt, FaFlask, FaGlassWhiskey, FaRegLightbulb } from 'react-icons/fa';
import { GiWineBottle, GiHops } from 'react-icons/gi';

const Quiz = ({ triviaData }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(true);
  
  // Shuffle and prepare questions
  useEffect(() => {
    if (triviaData && triviaData.length > 0) {
      const shuffled = [...triviaData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10); // Get 10 random questions
      setQuestions(shuffled);
    }
  }, [triviaData]);
  
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex === questions.length - 1) {
      setQuizComplete(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimeLeft(20);
      setTimerActive(true);
    }
  }, [currentQuestionIndex, questions.length]);
  
  const handleTimeout = useCallback(() => {
    setTimerActive(false);
    setIsCorrect(false);
    
    // Auto proceed after timeout
    const timer = setTimeout(() => {
      nextQuestion();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [nextQuestion]);
  
  // Timer countdown
  useEffect(() => {
    if (!timerActive || quizComplete || !questions.length) return;
    
    const timer = timeLeft > 0 && setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    
    if (timeLeft === 0) {
      handleTimeout();
    }
    
    return () => clearInterval(timer);
  }, [timeLeft, timerActive, quizComplete, questions.length, handleTimeout]);
  
  const handleAnswerSelect = (option) => {
    if (selectedAnswer !== null || !timerActive) return; // Prevent multiple selections
    
    setTimerActive(false);
    setSelectedAnswer(option);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isAnswerCorrect = option === currentQuestion.correct;
    
    setIsCorrect(isAnswerCorrect);
    
    if (isAnswerCorrect) {
      setScore(score + 1);
    }
  };
  
  const restartQuiz = () => {
    // Shuffle and get new questions
    const shuffled = [...triviaData]
      .sort(() => 0.5 - Math.random())
      .slice(0, 10);
    setQuestions(shuffled);
    
    // Reset state
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setQuizComplete(false);
    setTimeLeft(20);
    setTimerActive(true);
  };

  // Get random spirit icon
  const getSpiritIcon = () => {
    const icons = [FaGlassMartiniAlt, FaFlask, FaGlassWhiskey, GiWineBottle, GiHops];
    const randomIndex = Math.floor(Math.random() * icons.length);
    const Icon = icons[randomIndex];
    return <Icon />;
  };
  
  // If no questions, show loading
  if (questions.length === 0) {
    return (
      <LoadingContainer>
        <LoadingIcon />
        <LoadingText>Distilling your trivia questions...</LoadingText>
      </LoadingContainer>
    );
  }
  
  // Show results when quiz is complete
  if (quizComplete) {
    return (
      <ResultsContainer>
        <TrophyAnimation>
          <TrophyIcon />
          <TrophyGlow />
        </TrophyAnimation>
        <ResultsTitle>Quiz Complete!</ResultsTitle>
        <FinalScoreText>
          Your Score: <ScoreHighlight>{score}</ScoreHighlight> / {questions.length}
        </FinalScoreText>
        <ResultsMessage>
          {score === questions.length 
            ? "Perfect score! You're a true spirits connoisseur! Your knowledge is as refined as an aged whiskey." 
            : score >= questions.length / 2 
              ? "Great job! You know your spirits well! With a bit more tasting, you'll be a master soon." 
              : "Keep learning about spirits and try again! Every connoisseur starts somewhere."}
        </ResultsMessage>
        <ResultsQuote>
          <FaRegLightbulb style={{ marginRight: "8px" }} />
          "In spirits there is wisdom, in beer there is strength, in water there is bacteria."
        </ResultsQuote>
        <RestartButton onClick={restartQuiz}>
          <BsLightningCharge style={{ marginRight: "8px" }} />
          Try Again
        </RestartButton>
      </ResultsContainer>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <QuizContainer>
      <QuizHeader>
        <QuestionCounter>
          <CounterText>Question</CounterText>
          <CounterChip>{currentQuestionIndex + 1} <span style={{opacity: 0.6}}>of</span> {questions.length}</CounterChip>
        </QuestionCounter>
        <TimerWrapper>
          <ClockIcon />
          <TimerText timeRunningOut={timeLeft <= 5}>{timeLeft}</TimerText>
          <TimerBar timeLeft={timeLeft} totalTime={20} timeRunningOut={timeLeft <= 5} />
        </TimerWrapper>
        <ScoreDisplay>
          <ScoreLabel>Score</ScoreLabel>
          <ScoreNumber>{score}</ScoreNumber>
        </ScoreDisplay>
      </QuizHeader>
      
      <QuestionSection>
        <QuestionText>
          <GlassIconWrapper>{getSpiritIcon()}</GlassIconWrapper>
          {currentQuestion.question}
        </QuestionText>
        
        <OptionsContainer>
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <OptionButton 
              key={key}
              onClick={() => handleAnswerSelect(key)}
              selected={selectedAnswer === key}
              correct={selectedAnswer !== null && key === currentQuestion.correct}
              incorrect={selectedAnswer === key && key !== currentQuestion.correct}
              disabled={selectedAnswer !== null}
            >
              <OptionKey>{key.toUpperCase()}</OptionKey>
              <OptionText>{value}</OptionText>
            </OptionButton>
          ))}
        </OptionsContainer>
      </QuestionSection>
      
      {selectedAnswer !== null && (
        <FeedbackSection correct={isCorrect}>
          <FeedbackText correct={isCorrect}>
            {isCorrect ? "Correct!" : "Incorrect!"}
          </FeedbackText>
          <ExplanationText>
            <ExplanationIcon />
            {currentQuestion.explanation}
          </ExplanationText>
          <NextButton onClick={nextQuestion}>
            {currentQuestionIndex === questions.length - 1 ? "See Results" : "Next Question"}
            <ArrowIcon />
          </NextButton>
        </FeedbackSection>
      )}
    </QuizContainer>
  );
};

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 15px var(--accent); }
  50% { box-shadow: 0 0 25px var(--accent), 0 0 40px var(--primary); }
  100% { box-shadow: 0 0 15px var(--accent); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled components
const QuizContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 10px 30px var(--card-shadow);
  padding: var(--spacing-lg);
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  animation: ${fadeInUp} 0.5s ease-out;
  font-size: 0.95rem;
  
  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const QuizHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
`;

const QuestionCounter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CounterText = styled.div`
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 4px;
`;

const CounterChip = styled.div`
  background-color: var(--primary);
  color: white;
  font-weight: 600;
  font-size: var(--fs-sm);
  padding: 4px 12px;
  border-radius: 15px;
`;

const TimerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  position: relative;
  min-width: 120px;
`;

const TimerBar = styled.div`
  height: 6px;
  width: 100%;
  background-color: ${props => props.timeRunningOut ? 'var(--incorrect)' : 'var(--primary)'};
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => (props.timeLeft / props.totalTime) * 100}%;
    background-color: ${props => 
      props.timeRunningOut 
        ? 'rgba(255, 255, 255, 0.7)' 
        : 'rgba(255, 255, 255, 0.4)'};
    transition: width 1s linear;
  }
`;

const ClockIcon = styled(BsClock)`
  color: var(--primary);
  font-size: 20px;
  ${props => props.timeRunningOut && css`
    animation: ${pulse} 1s infinite;
    color: var(--incorrect);
  `}
`;

const TimerText = styled.span`
  font-weight: bold;
  font-size: var(--fs-md);
  color: ${props => props.timeRunningOut ? 'var(--incorrect)' : 'var(--text)'};
  transition: color 0.3s ease;
`;

const ScoreDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ScoreLabel = styled.div`
  font-size: var(--fs-sm);
  font-weight: 500;
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 4px;
`;

const ScoreNumber = styled.div`
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  font-weight: 700;
  font-size: var(--fs-md);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-circle);
`;

const QuestionSection = styled.div`
  margin-bottom: var(--spacing-lg);
  animation: ${fadeInUp} 0.5s ease-out;
`;

const GlassIconWrapper = styled.span`
  color: var(--accent);
  margin-right: var(--spacing-sm);
  font-size: 1.5em;
  vertical-align: middle;
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  width: 45px;
  height: 45px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-circle);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 5px;
`;

const QuestionText = styled.h2`
  font-size: var(--fs-lg);
  margin-bottom: var(--spacing-lg);
  line-height: 1.4;
  color: var(--text);
  text-align: center;
  padding: 0 var(--spacing-sm);
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  background-color: ${props => {
    if (props.correct) return 'var(--correct)';
    if (props.incorrect) return 'var(--incorrect)';
    if (props.selected) return 'var(--primary)';
    return 'var(--card-bg)';
  }};
  color: ${props => (props.selected || props.correct || props.incorrect) ? 'white' : 'var(--text)'};
  border: 1px solid ${props => {
    if (props.correct) return 'var(--correct)';
    if (props.incorrect) return 'var(--incorrect)';
    return 'var(--border-color)';
  }};
  border-radius: var(--border-radius);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.correct && css`
    animation: ${glow} 2s infinite;
  `}
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover:not(:disabled) {
    background-color: ${props => {
      if (props.correct) return 'var(--correct)';
      if (props.incorrect) return 'var(--incorrect)';
      return 'var(--primary)';
    }};
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    
    &:before {
      left: 100%;
    }
  }
`;

const OptionKey = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-sm);
  font-weight: 600;
  font-size: var(--fs-sm);
  flex-shrink: 0;
`;

const OptionText = styled.span`
  flex: 1;
  font-size: var(--fs-md);
`;

const FeedbackSection = styled.div`
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  border-top: 1px solid var(--border-color);
  background-color: ${props => props.correct ? 'rgba(0, 200, 83, 0.05)' : 'rgba(255, 23, 68, 0.05)'};
  animation: ${fadeInUp} 0.5s ease;
`;

const FeedbackText = styled.h3`
  color: ${props => props.correct ? 'var(--correct)' : 'var(--incorrect)'};
  margin-bottom: var(--spacing-sm);
  font-size: var(--fs-xl);
  text-align: center;
`;

const ExplanationText = styled.p`
  color: var(--text);
  line-height: 1.5;
  margin-bottom: var(--spacing-lg);
  font-size: var(--fs-md);
  padding: var(--spacing-md);
  background-color: var(--card-bg);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 8px var(--card-shadow);
  max-height: 150px;
  overflow-y: auto;
  word-break: break-word;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary);
    border-radius: 4px;
  }
`;

const ExplanationIcon = styled(FaRegLightbulb)`
  color: var(--accent);
  margin-right: 10px;
  float: left;
  font-size: 24px;
  margin-top: 3px;
`;

const NextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-left: auto;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  font-size: var(--fs-md);
`;

const ArrowIcon = styled(BsArrowRight)`
  transition: transform 0.3s ease;
  ${NextButton}:hover & {
    transform: translateX(6px);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: var(--text);
  animation: ${fadeInUp} 0.5s ease;
`;

const LoadingIcon = styled(FaFlask)`
  color: var(--primary);
  font-size: 60px;
  margin-bottom: var(--spacing-md);
  animation: ${spin} 4s infinite linear;
`;

const LoadingText = styled.div`
  font-size: var(--fs-lg);
  font-weight: 500;
  color: var(--text);
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--spacing-lg);
  min-height: 400px;
  animation: ${fadeInUp} 0.5s ease;
  background-color: var(--card-bg);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 10px 30px var(--card-shadow);
`;

const TrophyAnimation = styled.div`
  position: relative;
  margin-bottom: var(--spacing-lg);
`;

const TrophyIcon = styled(BsTrophy)`
  font-size: 75px;
  color: var(--accent);
  position: relative;
  z-index: 2;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const TrophyGlow = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: var(--accent);
  filter: blur(30px);
  opacity: 0.5;
  border-radius: 50%;
  z-index: 1;
  animation: ${glow} 2s infinite ease-in-out;
`;

const ResultsTitle = styled.h2`
  font-size: var(--fs-xl);
  margin-bottom: var(--spacing-md);
  color: var(--primary);
  text-shadow: 0 2px 10px var(--card-shadow);
`;

const FinalScoreText = styled.p`
  font-size: var(--fs-xl);
  margin-bottom: var(--spacing-lg);
  color: var(--text);
`;

const ScoreHighlight = styled.span`
  color: var(--primary);
  font-weight: 700;
  font-size: var(--fs-xxl);
`;

const ResultsMessage = styled.p`
  font-size: var(--fs-md);
  margin-bottom: var(--spacing-md);
  color: var(--text);
  max-width: 550px;
  line-height: 1.5;
`;

const ResultsQuote = styled.div`
  font-style: italic;
  color: var(--text);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: rgba(98, 0, 234, 0.05);
  border-left: 3px solid var(--primary);
  max-width: 450px;
  text-align: left;
  font-size: var(--fs-sm);
  display: flex;
  align-items: center;
`;

const RestartButton = styled.button`
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: var(--fs-md);
  font-weight: 600;
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
`;

export default Quiz; 