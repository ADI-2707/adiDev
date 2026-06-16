import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import RevealSection from '../ui/RevealSection';
import { SectionTag, Button } from '../ui/Button';
import EarthGlobe from '../three/EarthGlobe';

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
    <section id="contact" className="section-spacing c-space">
      <div className="flex flex-col items-center gap-4 mb-16">
        <RevealSection>
          <SectionTag label="Contact" />
        </RevealSection>
        <RevealSection delay={0.1}>
          <h2 className="text-heading text-center">
            Let's Build{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia to-coral">
              Something.
            </span>
          </h2>
        </RevealSection>
        <RevealSection delay={0.2}>
          <p className="subtext text-center max-w-md">
            Have a project in mind? A collab idea? Or just want to say hi — I'm always listening.
          </p>
        </RevealSection>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">

        {/* Left — Contact form */}
        <RevealSection delay={0.1}>
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 p-8 rounded-2xl border border-white/8 bg-gradient-to-b from-storm/40 to-indigo/20 backdrop-blur-sm"
          >
            {/* Name */}
            <div>
              <label className="field-label text-neutral-300">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Adi Doe"
                required
                className="field-input field-input-focus text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="field-label text-neutral-300">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="adi@example.com"
                required
                className="field-input field-input-focus text-white placeholder:text-neutral-500"
              />
            </div>

            {/* Message */}
            <div>
              <label className="field-label text-neutral-300">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Hey Adi, let's build something awesome..."
                required
                rows={5}
                className="field-input field-input-focus text-white placeholder:text-neutral-500 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn w-full flex items-center justify-center gap-2 border border-aqua/30 text-aqua hover:bg-aqua/10 transition-all duration-300 disabled:opacity-50"
            >
              {status === 'sending' && (
                <span className="w-4 h-4 border-2 border-aqua/30 border-t-aqua rounded-full animate-spin" />
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
                className="text-mint text-sm text-center"
              >
                Thanks! I'll get back to you within 24 hours. 🚀
              </motion.p>
            )}
          </form>
        </RevealSection>

        {/* Right — 3D Globe */}
        <RevealSection direction="left" delay={0.2}>
          <div className="h-[380px] w-full relative">
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={0.4} />
              <pointLight position={[3, 3, 3]} intensity={1.2} color="#33c2cc" />
              <pointLight position={[-3, -2, 2]} intensity={0.6} color="#7a57db" />
              <Suspense fallback={null}>
                <EarthGlobe />
                <Environment preset="night" />
              </Suspense>
            </Canvas>

            {/* Labels */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse" />
                  Online & Available
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
