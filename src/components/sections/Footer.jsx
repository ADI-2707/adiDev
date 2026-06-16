const Footer = () => {
  const socials = [
    { label: 'GitHub', href: 'https://github.com', symbol: '⌥' },
    { label: 'LinkedIn', href: 'https://linkedin.com', symbol: 'in' },
    { label: 'Email', href: 'mailto:adi@example.com', symbol: '✉' },
  ];

  return (
    <footer className="border-t border-white/5 bg-midnight/50">
      <div className="c-space py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <a href="#hero" className="text-lg font-bold">
            adi<span className="text-aqua">Dev</span>
          </a>
          <p className="text-neutral-600 text-xs">
            Built with React, Three.js & ☕
          </p>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 hover:text-white hover:border-aqua/40 transition-all duration-300 text-xs"
            >
              {s.symbol}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <a
            href="#hero"
            className="text-xs text-neutral-500 hover:text-aqua transition-colors flex items-center gap-1"
          >
            Back to top ↑
          </a>
          <p className="text-neutral-700 text-xs">
            © {new Date().getFullYear()} adiDev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
