"use client";

import { motion } from "framer-motion";
import { ReactNode, Children } from "react";

export function StaggeredGrid({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10, filter: "blur(2px)" },
    show: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 260, damping: 24, mass: 0.9 }
    },
  };

  return (
    <motion.div 
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {Children.map(children, (child, i) => (
        <motion.div key={i} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
