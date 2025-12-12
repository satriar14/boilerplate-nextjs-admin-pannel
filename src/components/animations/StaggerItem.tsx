'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerItemProps {
  children: ReactNode;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut',
      duration: 0.4,
    },
  },
};

export default function StaggerItem({ children }: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants}>
      {children}
    </motion.div>
  );
}

