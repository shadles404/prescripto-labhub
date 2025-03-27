
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

const variants = {
  hidden: { opacity: 0, y: 5 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 5 },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full min-h-full flex-1"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
