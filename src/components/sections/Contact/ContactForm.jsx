import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContactForm.module.css';
import Typewriter from '../../ui/Typewriter';
import { playTone, playSuccess } from '../../../utils/audio';

const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', content: '' });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    playTone(300 + Math.random() * 100, 0.02, 0.01);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to transmit message.');
      }

      playSuccess();
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ name: '', email: '', content: '' });
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Transmission Failed');
      setStatus('error');
      playTone(150, 0.5, 0.1); // Error tone
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={styles.modalContent}
      >
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>COMMUNICATION_LINK_ESTABLISHED</span>
          <button className={styles.closeBtn} onClick={onClose}>[X]</button>
        </div>

        <div className={styles.modalBody}>
          {status === 'success' ? (
            <div className={styles.statusScreen}>
              <span className={styles.successIcon}>✓</span>
              <Typewriter text="TRANSMISSION SUCCESSFUL. DATA RECEIVED." speed={30} showCursor={false} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">IDENTIFIER (NAME)</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending'}
                  className={styles.inputField}
                  autoComplete="off"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email">RETURN_ADDRESS (EMAIL)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending'}
                  className={styles.inputField}
                  autoComplete="off"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="content">PAYLOAD (MESSAGE)</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending'}
                  rows="4"
                  className={styles.textAreaField}
                />
              </div>

              {status === 'error' && (
                <div className={styles.errorMessage}>
                  ERROR: {errorMsg}
                </div>
              )}

              <div className={styles.actionRow}>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className={styles.submitBtn}
                >
                  {status === 'sending' ? '[ ENCRYPTING & TRANSMITTING... ]' : '[ INITIATE_TRANSMISSION ]'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactForm;
