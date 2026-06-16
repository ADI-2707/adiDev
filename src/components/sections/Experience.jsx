import { motion } from 'framer-motion';
import RevealSection from '../ui/RevealSection';
import { SectionTag } from '../ui/Button';
import { experiences } from '../../data/experience';

const TimelineItem = ({ exp, index }) => {
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: 'easeOut' }}
      className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-12 ${isLeft ? '' : 'md:flex-row-reverse'
        }`}
    >
      {/* Content card */}
      <div className={`${isLeft ? 'md:col-start-1' : 'md:col-start-2'}`}>
        <div className="group relative p-6 rounded-2xl border border-white/8 bg-gradient-to-br from-storm/60 to-indigo/40 backdrop-blur-sm hover:border-white/15 transition-all duration-300">
          {/* Accent bar */}
          <div
            className="absolute left-0 top-6 bottom-6 w-0.5 rounded-full"
            style={{ backgroundColor: exp.accent }}
          />

          <div className="pl-4">
            {/* Period badge */}
            <span
              className="text-xs px-2 py-0.5 rounded-full border mb-3 inline-block"
              style={{ borderColor: `${exp.accent}40`, color: exp.accent, backgroundColor: `${exp.accent}10` }}
            >
              {exp.period}
            </span>

            <h3 className="text-lg font-bold">{exp.role}</h3>
            <p className="text-neutral-400 text-sm mb-3">{exp.company}</p>

            <ul className="flex flex-col gap-2 mb-4">
              {exp.description.map((point, i) => (
                <li key={i} className="text-neutral-400 text-sm flex gap-2">
                  <span style={{ color: exp.accent }} className="mt-0.5 shrink-0">▸</span>
                  {point}
                </li>
              ))}
            </ul>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2">
              {exp.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-white/5 border border-white/8 text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for alternating layout */}
      <div className={`hidden md:block ${isLeft ? 'md:col-start-2' : 'md:col-start-1 md:row-start-1'}`} />

      {/* Timeline dot (center column on desktop) */}
      <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 flex-col items-center z-10">
        <div
          className="w-3 h-3 rounded-full border-2 shadow-lg"
          style={{
            borderColor: exp.accent,
            backgroundColor: exp.accent,
            boxShadow: `0 0 12px ${exp.accent}80`,
          }}
        />
      </div>
    </motion.div>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="section-spacing c-space">
      <div className="flex flex-col items-center gap-4 mb-16">
        <RevealSection>
          <SectionTag label="Experience" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-heading text-center">
            Mission{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender to-fuchsia">
              Log
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className="subtext text-center max-w-md">
            A record of every mission I've flown, every problem I've solved.
          </p>
        </RevealSection>
      </div>

      {/* Timeline */}
      <div className="relative max-w-4xl mx-auto">
        {/* Center line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-aqua/0 via-aqua/20 to-aqua/0 -translate-x-1/2" />

        {experiences.map((exp, index) => (
          <TimelineItem key={exp.id} exp={exp} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Experience;
