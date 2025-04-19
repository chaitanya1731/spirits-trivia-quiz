import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaAd, FaGift, FaHandshake } from 'react-icons/fa';
import { BiBarcode } from 'react-icons/bi';

// Animations
const pulse = keyframes`
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
`;

const scanLine = keyframes`
  0% { top: 0%; }
  100% { top: 100%; }
`;

// Styled components - Define AdContentPlaceholder first
const AdContentPlaceholder = styled.div`
  background-color: var(--ad-bg);
  border-radius: var(--border-radius);
  border: 1px dashed var(--border-color);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px var(--card-shadow);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:hover {
    opacity: 1;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px var(--card-shadow);
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    background: linear-gradient(to right, transparent, var(--primary), transparent);
    top: 0;
    left: 0;
    animation: ${scanLine} 3s linear infinite;
  }
`;

// Now we can use AdContentPlaceholder in AdContainer
const AdContainer = styled.div`
  ${({ position }) => {
    switch(position) {
      case 'left':
      case 'right':
        return `
          width: 160px;
          height: 600px;
          margin: 0 var(--spacing-md);
          flex-shrink: 0;
          
          @media (max-width: 768px) {
            width: 100%;
            height: 100px;
            margin: var(--spacing-md) 0;
          }
        `;
      case 'bottom':
        return `
          width: 100%;
          height: 90px;
          margin-bottom: var(--spacing-md);
        `;
      default:
        return `
          width: 300px;
          height: 250px;
        `;
    }
  }}
  position: relative;
  
  .adsense-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    
    /* Hide by default - AdSense JS will show when loaded */
    opacity: 0;
    
    &[data-ad-status="filled"] {
      opacity: 1;
      
      /* When ad is loaded, hide the placeholder */
      + ${AdContentPlaceholder} {
        display: none;
      }
    }
  }
`;

const AdIcon = styled.div`
  font-size: ${props => props.position === 'bottom' ? '24px' : '32px'};
  color: var(--primary);
  margin-bottom: ${props => props.position === 'bottom' ? '0' : 'var(--spacing-sm)'};
  animation: ${pulse} 2s infinite ease-in-out;
`;

const AdText = styled.p`
  font-size: var(--fs-sm);
  color: var(--text);
  text-align: center;
  opacity: 0.8;
  margin-bottom: var(--spacing-xs);
  font-family: 'Audiowide', cursive;
  letter-spacing: 1px;
`;

const AdCode = styled.div`
  font-size: 10px;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.7;
  font-family: monospace;
`;

// Helper function to get ad label based on position
const getAdLabel = (position) => {
  switch(position) {
    case 'left': return 'Advertisement';
    case 'right': return 'Sponsored Content';
    case 'bottom': return 'Partners';
    default: return 'Advertisement';
  }
};

// Helper function to get icon based on position
const getAdIcon = (position) => {
  switch(position) {
    case 'left': return <FaAd />;
    case 'right': return <FaGift />;
    case 'bottom': return <FaHandshake />;
    default: return <FaAd />;
  }
};

const AdSpace = ({ position }) => {
  // Initialize ads when component mounts
  useEffect(() => {
    // Check if Google AdSense script is already loaded
    if (window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);
  
  // Get ad slot ID based on position
  const getAdSlotId = (position) => {
    switch(position) {
      case 'left': return '1234567890';
      case 'right': return '0987654321';
      case 'bottom': return '1122334455';
      default: return '1234567890';
    }
  };
  
  // Get ad format based on position
  const getAdFormat = (position) => {
    switch(position) {
      case 'left':
      case 'right':
        return 'auto';
      case 'bottom':
        return 'horizontal';
      default:
        return 'auto';
    }
  };
  
  return (
    <AdContainer position={position}>
      {/* Hidden AdSense Ad (will display when ready) */}
      <div className="adsense-container">
        <ins className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: '100%'
          }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense Publisher ID
          data-ad-slot={getAdSlotId(position)}
          data-ad-format={getAdFormat(position)}
          data-full-width-responsive="true"
        />
      </div>
      
      {/* Fallback/placeholder that shows by default */}
      <AdContentPlaceholder>
        <AdIcon position={position}>
          {getAdIcon(position)}
        </AdIcon>
        <AdText>{getAdLabel(position)}</AdText>
        <AdCode><BiBarcode /> AD-{Math.floor(Math.random() * 1000)}</AdCode>
      </AdContentPlaceholder>
    </AdContainer>
  );
};

export default AdSpace; 