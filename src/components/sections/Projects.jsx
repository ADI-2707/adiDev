import { motion } from 'framer-motion';
import RevealSection from '../ui/RevealSection';
import TiltCard from '../ui/TiltCard';
import { SectionTag } from '../ui/Button';
import { projects } from '../../data/projects';

const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={project.size}
    >
      <TiltCard className={`h-full ${project.gridClass} rounded-2xl cursor-pointer group`}>
        {/* Background image with overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500 scale-105"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            {project.featured && (
              <span
                className="inline-block text-xs px-2 py-0.5 rounded-full border mb-3"
                style={{
                  borderColor: `${project.accent}50`,
                  color: project.accent,
                  backgroundColor: `${project.accent}15`,
                }}
              >
                ✦ Featured
              </span>
            )}
            <h3 className="text-lg font-bold mb-2 group-hover:text-aqua transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs rounded-md bg-white/5 border border-white/8 text-neutral-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Links */}
            <div className="flex gap-3">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-aqua hover:underline flex items-center gap-1"
              >
                Live ↗
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="section-spacing c-space">
      <div className="flex flex-col items-center gap-4 mb-16">
        <RevealSection>
          <SectionTag label="Projects" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-heading text-center">
            Things I've{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-aqua to-mint">
              Shipped
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className="subtext text-center max-w-md">
            From scalable SaaS platforms to 3D experiments — real work, real impact.
          </p>
        </RevealSection>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[15rem] gap-4 max-w-6xl mx-auto">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
