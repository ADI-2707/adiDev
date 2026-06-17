import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import RevealSection from '../../ui/RevealSection/RevealSection';
import { SectionTag } from '../../ui/Button/Button';
import EarthGlobe from '../../three/EarthGlobe';
import styles from './Contact.module.css';

const INITIAL_FORM = { name: '', email: '', message: '' };

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle');
  const formRef = useRef(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
      setForm(INITIAL_FORM);
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.header}>
        <RevealSection>
          <SectionTag label="Contact" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className={styles.heading}>
            Let's Build{' '}
            <span className={styles.gradientSpan}>
              Something.
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className={styles.subtext}>
            Have a project in mind? A collab idea? Or just want to say hi — I'm always listening.
          </p>
        </RevealSection>
      </div>

      <div className={styles.grid}>
        <RevealSection delay={0.1}>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className={styles.form}
          >
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Adi Doe"
                required
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="adi@example.com"
                required
                className={styles.fieldInput}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Hey Adi, let's build something awesome..."
                required
                rows={5}
                className={`${styles.fieldInput} ${styles.textarea}`}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className={styles.submitBtn}
            >
              {status === 'sending' && (
                <span className={styles.spinner} />
              )}
              {status === 'idle' && 'Send Transmission ✦'}
              {status === 'sending' && 'Transmitting...'}
              {status === 'sent' && '✓ Message Received!'}
              {status === 'error' && 'Failed — try again'}
            </button>

            {status === 'sent' && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.successMsg}
              >
                Thanks! I'll get back to you within 24 hours. 🚀
              </motion.p>
            )}
          </form>
        </RevealSection>

        <RevealSection direction="left" delay={0.2}>
          <div className={styles.globeWrapper}>
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[3, 3, 3]} intensity={1.2} color="#33c2cc" />
              <pointLight position={[-3, -2, 2]} intensity={0.6} color="#7a57db" />
              <Suspense fallback={null}>
                <EarthGlobe />
                <Environment preset="night" />
              </Suspense>
            </Canvas>

            <div className={styles.globeLabels}>
              <div className={styles.globeLabelInner}>
                <span className={styles.statusIndicator}>
                  <span className={styles.onlineDot} />
                  Online &amp; Available
                </span>
                <span>India 🇮🇳</span>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default Contact;
