import { motion } from 'framer-motion';
import RevealSection from '../../ui/RevealSection/RevealSection';
import TiltCard from '../../ui/TiltCard/TiltCard';
import { SectionTag } from '../../ui/Button/Button';
import { projects } from '../../../data/projects';
import styles from './Projects.module.css';

const ProjectCard = ({ project, index }) => {

  const sizeClass = styles[project.size.replace('-', '')] || '';

  const gridColorClass = styles[project.gridClass.replace(/-([a-z])/g, (g) => g[1].toUpperCase())] || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={sizeClass}
    >
      <TiltCard className={`${styles.card} ${gridColorClass} group`}>

        <div className={styles.imgContainer}>
          {project.image && (
            <img
              src={project.image}
              alt={project.title}
              className={styles.image}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div className={styles.overlay} />
        </div>

        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
            {project.featured && (
              <span
                className={styles.featuredBadge}
                style={{
                  borderColor: `${project.accent}50`,
                  color: project.accent,
                  backgroundColor: `${project.accent}15`,
                }}
              >
                ✦ Featured
              </span>
            )}
            <h3 className={styles.title}>
              {project.title}
            </h3>
            <p className={styles.description}>
              {project.description}
            </p>
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>

            <div className={styles.links}>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.linkLive}
              >
                Live ↗
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.linkGithub}
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
    <section id="projects" className={styles.section}>
      <div className={styles.header}>
        <RevealSection>
          <SectionTag label="Projects" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className={styles.heading}>
            Things I've{' '}
            <span className={styles.gradientSpan}>
              Shipped
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className={styles.subtext}>
            From scalable SaaS platforms to 3D experiments — real work, real impact.
          </p>
        </RevealSection>
      </div>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
