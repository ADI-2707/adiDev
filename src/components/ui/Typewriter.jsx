import { useState, useEffect } from 'react';
import { playClick } from '../../utils/audio';

export const Typewriter = ({
  text = '',
  speed = 40,
  delay = 0,
  onComplete = null,
  className = '',
  showCursor = true
}) => {

  const [displayedText, setDisplayedText] = useState('');
  const [started, setStarted] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let startTimeout = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    let index = 0;
    setDisplayedText('');
    setComplete(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        const char = text.charAt(index);
        setDisplayedText((prev) => prev + char);
        
        
        if (char.trim() !== '') {
          playClick();
        }
        
        index++;
      } else {
        clearInterval(interval);
        setComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !complete && (
        <span 
          style={{ 
            display: 'inline-block', 
            width: '8px', 
            height: '15px', 
            backgroundColor: 'var(--accent-blue)', 
            marginLeft: '4px',
            animation: 'blink 0.8s infinite'
          }} 
        />
      )}
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
};

export default Typewriter;
