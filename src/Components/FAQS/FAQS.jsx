/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconChevronDown } from '@tabler/icons-react';
import illustration from "../../assets/doctor-checking-pregnant-lady.png";
import string from "../../assets/Vector 1.png";
import GroupDotes from "../../assets/Group 29.png";

function FAQS() {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const questions = [
    {
      question: 'What is HealerAi and how does it work?',
      answer: 'HealerAi connects you with licensed healthcare professionals for online consultations, prescription refills, and personalized care—all from the comfort of your home.'
    },
    {
      question: 'Is my medical data secure?',
      answer: 'Absolutely. We use end-to-end encryption and follow strict data protection protocols to keep your information safe.'
    },
    {
      question: 'Can I choose my doctor?',
      answer: 'Yes, you can browse profiles and select a specialist based on your condition and preferences.'
    },
    {
      question: 'Do I need insurance to use HealerAi?',
      answer: 'No insurance is required. We offer transparent pricing and flexible payment options for everyone.'
    },
     {
      question: 'What is HealerAi and how does it work?',
      answer: 'HealerAi connects you with licensed healthcare professionals for online consultations, prescription refills, and personalized care—all from the comfort of your home.'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative bg-gradient-to-b from-white via-sky-50/30 to-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-100/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Decorative String Across Midline */}
      <img
        src={string}
        alt="Decorative String"
        className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none opacity-30 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side: Heading + Paragraph + Illustration */}
        <motion.div
          className="space-y-6 text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
            Frequently Asked <span className="bg-gradient-to-r from-sky-400 to-sky-600 bg-clip-text text-transparent">Questions</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-md mx-auto md:mx-0">
            Everything you need to know about using HealerAi. If you still have questions, feel free to reach out.
          </p>
          <motion.div
            className="relative mt-8 w-full max-w-sm mx-auto md:mx-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 rounded-lg blur opacity-20 -z-10"></div>
            <img
              src={illustration}
              alt="Medical Illustration"
              className="w-full rounded-lg shadow-lg"
            />
            <img
              src={GroupDotes}
              alt="Decorative Dots"
              className="absolute top-64 left-full -translate-x-1/2 w-16 opacity-90 pointer-events-none -z-50"
            />
          </motion.div>
        </motion.div>

        {/* Right Side: FAQ Accordion List */}
        <motion.div
          className="space-y-4 pt-12 md:pt-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {questions.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              {/* Accordion Card */}
              <motion.button
                onClick={() => setExpandedIndex(expandedIndex === index ? -1 : index)}
                className="w-full text-left relative"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400/40 via-sky-300/20 to-sky-500/40 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Card Container */}
                <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-100/30 p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 group-hover:text-sky-600 transition-colors duration-200">
                        {item.question}
                      </h4>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <IconChevronDown
                        size={24}
                        className="text-sky-400 group-hover:text-sky-500 transition-colors"
                      />
                    </motion.div>
                  </div>

                  {/* Expanded Answer */}
                  <motion.div
                    initial={false}
                    animate={{ height: expandedIndex === index ? 'auto' : 0, marginTop: expandedIndex === index ? 16 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: expandedIndex === index ? 1 : 0 }}
                      transition={{ delay: expandedIndex === index ? 0.1 : 0 }}
                      className="text-gray-700 text-base leading-relaxed border-t border-sky-100/30 pt-4"
                    >
                      {item.answer}
                    </motion.p>
                  </motion.div>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FAQS;
