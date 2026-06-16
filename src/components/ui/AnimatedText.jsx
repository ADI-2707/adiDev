import { TypeAnimation } from 'react-type-animation';

const AnimatedText = ({ sequences, className = '', speed = 50, repeat = Infinity }) => {
  return (
    <TypeAnimation
      sequence={sequences}
      wrapper="span"
      speed={speed}
      className={className}
      repeat={repeat}
      cursor={true}
    />
  );
};

export default AnimatedText;
