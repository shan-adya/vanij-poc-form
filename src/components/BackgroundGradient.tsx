import { motion } from 'framer-motion';

export default function BackgroundGradient() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Main gradient orbs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
        className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-r from-primary to-primary/30 blur-[100px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-r from-secondary to-secondary/30 blur-[100px]"
      />
      
      {/* Accent gradients */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute top-[20%] left-[30%] h-[300px] w-[300px] rounded-full bg-gradient-to-r from-primary/40 to-secondary/40 blur-[100px]"
      />
      
      {/* Subtle animated dots/stars */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(var(--primary-rgb),0.1),transparent)]" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ maskImage: 'radial-gradient(circle at center, transparent, black)' }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('/noise.png')] mix-blend-overlay" />
    </div>
  );
} 