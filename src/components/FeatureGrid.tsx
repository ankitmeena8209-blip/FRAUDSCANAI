import { motion } from 'framer-motion';
import { BrainCircuit, Eye, LockKeyhole, Radar } from 'lucide-react';

const cards = [
  { title: 'Explainable AI signals', description: 'Highlighting urgency, impersonation, and falsified authority cues.', icon: BrainCircuit },
  { title: 'Cross-channel scanning', description: 'Analyze text, links, email, and screenshots with one consistent flow.', icon: Radar },
  { title: 'Real-time evidence', description: 'Capture the strongest indicators and keep them visible for review.', icon: Eye },
  { title: 'Trusted safety posture', description: 'Protect your team with a calm, high-confidence decision surface.', icon: LockKeyhole },
];

export function FeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="rounded-[24px] border border-white/10 bg-white/5 p-5 shadow-premium"
          >
            <div className="mb-4 inline-flex rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{card.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
