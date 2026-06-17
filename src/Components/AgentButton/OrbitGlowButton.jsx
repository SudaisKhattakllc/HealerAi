/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';

const MidGlowButton = ({ onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-md bg-sky-400 hover:bg-sky-700 px-6 py-3 text-md font-semibold text-white transition-colors duration-300 cursor-pointer w-full max-w-xs"
    >
      {/* Roll-up text animation */}
   <div className="relative overflow-hidden h-[1.25rem] flex items-center justify-center">
  <p className="group-hover:-translate-y-5 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] text-center w-full">
   Identify Symptoms by AI
  </p>
  <p className="absolute top-5 left-0 w-full text-center group-hover:top-0 duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)]">
   Identify Symptoms by AI
  </p>
</div>


      {/* Left-to-right glow */}
      <motion.span
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 5,
          ease: 'linear',
        }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-r from-sky-700/0 via-white/70 to-sky-700/0 opacity-60 blur-sm"
      />

      {/* Top-to-bottom glow */}
      <motion.span
        initial={{ y: '-100%' }}
        animate={{ y: '100%' }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 5,
          ease: 'linear',
          delay: 5,
        }}
        className="absolute inset-0 z-0 scale-125 bg-gradient-to-b from-sky-700/0 via-white/70 to-sky-700/0 opacity-60 blur-sm"
      />
    </motion.button>
  );
};

export default MidGlowButton;
