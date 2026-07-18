import { motion } from 'framer-motion';

export function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-aurora" />
      <motion.div
        className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-cyan-500/30 blur-3xl"
        animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 right-[-5%] h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl"
        animate={{ x: [0, -20, 0], y: [0, 40, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="grid-overlay absolute inset-0 opacity-50" />
    </div>
  );
}
