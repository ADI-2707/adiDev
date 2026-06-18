/* eslint-disable */
import { motion } from 'framer-motion';
import styles from './Button.module.css';

export const SectionTag = ({ label }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`${styles.base} ${styles.primary}`}
  >
    <span className={styles.shimmer} />
    {label}
  </motion.div>
);

export const Button = ({ children, onClick, href, variant = 'primary', className = '' }) => {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} onClick={onClick} className={`${styles.base} ${styles[variant]} ${className}`}>
      <span className={styles.shimmer} />
      {children}
    </Tag>
  );
};
