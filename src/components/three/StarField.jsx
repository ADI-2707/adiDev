import { Stars } from '@react-three/drei';

const StarField = () => {
  return (
    <Stars
      radius={100}
      depth={60}
      count={4000}
      factor={4}
      saturation={0.3}
      fade
      speed={0.5}
    />
  );
};

export default StarField;
