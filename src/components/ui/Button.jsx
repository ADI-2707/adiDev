import { motion } from 'framer-motion';

/**
 * Reusable section tag pill shown above every section heading.
 * Example: ◉ About
 */
export const SectionTag = ({ label }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-aqua/30 bg-aqua/5 text-aqua text-sm font-medium mb-4 w-fit"
  >
    <span className="w-2 h-2 rounded-full bg-aqua animate-pulse" />
    {label}
  </motion.div>
);

/**
 * Primary CTA button with shimmer hover sweep.
 */
export const Button = ({ children, onClick, href, variant = 'primary', className = '' }) => {
  const base =
    'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 overflow-hidden cursor-pointer';

  const variants = {
    primary:
      'bg-aqua text-primary hover:bg-aqua/90 shadow-[0_0_20px_rgba(51,194,204,0.3)] hover:shadow-[0_0_30px_rgba(51,194,204,0.5)]',
    outline:
      'border border-aqua/50 text-aqua hover:bg-aqua/10 hover:border-aqua',
    ghost:
      'border border-white/20 text-white hover:bg-white/5 hover:border-white/40',
  };

  const shimmer = (
    <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
  );

  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {shimmer}
      {children}
    </Tag>
  );
};
