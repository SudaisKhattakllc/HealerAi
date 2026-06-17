/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import Image1 from '../../assets/doctor-checking-pregnant-lady.png';
import string from '../../assets/Vector 1.png';

function GetToKnow() {
  return (
    <section className="relative flex justify-center py-16 px-4">
      {/* String Accent Across Section */}
      <img
        src={string}
        alt="Decorative String"
        className="absolute top-1/2 left-0 w-full transform -translate-y-1/2 pointer-events-none z-10"
      />

      <div className="max-w-4xl w-full bg-white shadow-[0_4px_20px_rgba(0,132,125,0.45)] p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Left: Image with Motion */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <img
            src={Image1}
            alt="HealNet Team"
            className="w-full h-auto object-cover"
          />
        </motion.div>

        {/* Right: Text with Motion */}
        <motion.div
          className="w-full md:w-1/2 space-y-4"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            HealNet’s Story: <span className="text-sky-400">Get to know us</span>
          </h2>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            HealNet is more than just an online medical service; it’s a movement towards accessible, efficient, and compassionate healthcare for all. Founded by visionary doctors and tech experts, we deliver care wherever you are.
          </p>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">
            Built on trust, innovation, and commitment, our platform connects you with licensed professionals across diverse fields—ensuring personalized care just a click away.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 cursor-pointer inline-block bg-sky-400 hover:bg-sky-700 text-white font-medium py-2 px-5 rounded-md transition-all duration-300"
          >
            Learn more about us
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export default GetToKnow;
