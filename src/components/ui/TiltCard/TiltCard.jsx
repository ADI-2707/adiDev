/* eslint-disable */
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TiltCard = ({ children, className = '', intensity = 8 }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({
      x: ((y - centerY) / centerY) * -intensity,
      y: ((x - centerX) / centerX) * intensity,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.05s ease' : 'transform 0.4s ease',
        willChange: 'transform',
      }}
      animate={{
        boxShadow: isHovered
          ? '0 20px 60px rgba(92, 51, 204, 0.3), 0 0 40px rgba(51, 194, 204, 0.1)'
          : '0 4px 20px rgba(0,0,0,0.4)',
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
