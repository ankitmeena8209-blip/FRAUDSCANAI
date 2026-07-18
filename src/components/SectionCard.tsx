import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description: string;
  children: ReactNode;
  glow?: boolean;
}

export function SectionCard({ title, description, children, glow = false }: SectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45 }}
      className={`glass rounded-[24px] p-6 shadow-premium ${glow ? 'border-cyan-400/30' : ''}`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
      </div>
      {children}
    </motion.section>
  );
}
