import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { BsSun, BsMoonStars } from 'react-icons/bs';
import { FaFlask, FaGlassMartini, FaWineBottle, FaCocktail } from 'react-icons/fa';
import triviaData from './data/trivia_spirits_100-37claude.json';
import './App.css';

// Components
import Quiz from './components/Quiz';
import AdSpace from './components/AdSpace';

// Security
import { initSecurity, apiRateLimiter } from './security/securityConfig';

// Google Fonts
const FontStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Exo+2:wght@300;400;500;600;700&display=swap');
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  
  // Initialize security measures
  useEffect(() => {
    initSecurity();
  }, []);
  
  // Set theme on initial load and when darkMode changes
  useEffect(() => {
    if (!darkMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    // Example of using rate limiting for UI interactions
    if (apiRateLimiter.canMakeRequest()) {
      setDarkMode(!darkMode);
    } else {
      console.warn('Theme toggling rate limited');
    }
  };

  return (
    <AppContainer>
      <FontStyles />
      <Header>
        <LogoContainer>
          <FaCocktail className="logo-icon" />
          <Logo>The Spirit Nerds</Logo>
        </LogoContainer>
        <ThemeToggle onClick={toggleTheme}>
          {darkMode ? <BsSun size={22} /> : <BsMoonStars size={22} />}
        </ThemeToggle>
      </Header>
      
      <MainContent>
        <AdSpace position="left" />
        
        <QuizContainer>
          <Quiz triviaData={triviaData.trivia} />
        </QuizContainer>
        
        <AdSpace position="right" />
      </MainContent>
      
      <Footer>
        <AdSpace position="bottom" />
        <DecoratorRow>
          <DecoratorIcon><FaGlassMartini /></DecoratorIcon>
          <DecoratorIcon><FaWineBottle /></DecoratorIcon>
          <DecoratorIcon><FaFlask /></DecoratorIcon>
          <DecoratorIcon><FaGlassMartini /></DecoratorIcon>
          <DecoratorIcon><FaWineBottle /></DecoratorIcon>
        </DecoratorRow>
        <FooterText>© {new Date().getFullYear()} The Spirit Nerds - Test your spirits knowledge!</FooterText>
      </Footer>
    </AppContainer>
  );
}

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Styled Components
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-xl);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--card-bg);
  box-shadow: 0 2px 10px var(--card-shadow);
  position: relative;
  z-index: 10;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .logo-icon {
    font-size: 32px;
    color: var(--accent);
    animation: ${floatAnimation} 3s ease-in-out infinite;
  }
`;

const Logo = styled.h1`
  font-size: var(--fs-xl);
  margin: 0;
  font-family: 'Audiowide', cursive;
  background: linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--primary));
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${shimmer} 6s linear infinite;
  
  @media (max-width: 768px) {
    font-size: var(--fs-lg);
  }
`;

const ThemeToggle = styled.button`
  background: transparent;
  color: var(--text);
  padding: var(--spacing-sm);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--primary);
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const MainContent = styled.main`
  display: flex;
  flex: 1;
  padding: var(--spacing-lg) 0;
  align-items: flex-start;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-md) 0;
  }
`;

const QuizContainer = styled.div`
  flex: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
`;

const Footer = styled.footer`
  padding: var(--spacing-md);
  text-align: center;
  border-top: 1px solid var(--border-color);
  background-color: var(--card-bg);
  box-shadow: 0 -2px 10px var(--card-shadow);
`;

const DecoratorRow = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-sm);
`;

const DecoratorIcon = styled.div`
  color: var(--primary);
  font-size: 18px;
  opacity: 0.6;
`;

const FooterText = styled.p`
  font-size: var(--fs-sm);
  color: var(--text);
  opacity: 0.8;
  margin-top: var(--spacing-md);
`;

export default App;
