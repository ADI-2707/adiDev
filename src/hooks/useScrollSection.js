/* eslint-disable */
import { useEffect, useRef, useState } from 'react';

export const useScrollSection = (sectionIds = []) => {
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '');
  const observerRef = useRef(null);

  useEffect(() => {
    const observers = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [sectionIds]);

  return activeSection;
};
