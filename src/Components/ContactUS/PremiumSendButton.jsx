/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function PremiumSendButton() {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 1000);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.03 }}
      className={`w-full py-3 rounded-lg font-semibold text-xl cursor-pointer shadow transition-colors duration-500 overflow-hidden ${
        clicked ? 'bg-sky-700 text-white' : 'bg-sky-400 text-white hover:bg-sky-700'
      }`}
    >
      <div className="relative h-[1.75rem] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={clicked ? 'thanks' : 'send'}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="absolute"
          >
            {clicked ? 'Thanks' : 'Send'}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.button>
  );
}

export default PremiumSendButton;
