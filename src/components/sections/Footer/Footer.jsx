import styles from './Footer.module.css';

const Footer = () => {
  const socials = [
    { label: 'GitHub', href: 'https://github.com', symbol: '⌥' },
    { label: 'LinkedIn', href: 'https://linkedin.com', symbol: 'in' },
    { label: 'Email', href: 'mailto:adi@example.com', symbol: '✉' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand */}
        <div className={styles.brand}>
          <a href="#hero" className={styles.logo}>
            adi<span className={styles.logoAqua}>Dev</span>
          </a>
          <p className={styles.logoText}>
            Built with React, Three.js &amp; ☕
          </p>
        </div>

        {/* Socials */}
        <div className={styles.socials}>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className={styles.socialLink}
            >
              {s.symbol}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className={styles.rightSide}>
          <a
            href="#hero"
            className={styles.backToTop}
          >
            Back to top ↑
          </a>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} adiDev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
