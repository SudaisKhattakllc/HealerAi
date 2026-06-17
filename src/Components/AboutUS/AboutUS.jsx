import React from 'react';
import { motion as Motion } from 'framer-motion';
import CountUp from 'react-countup';
import image from "../../assets/pexels-pavel-danilyuk-7108157.jpg";
import Navbar from '../Navbar/Navbar';
import GlobalPresence from './GlobalPresence';
import LatestTechnology from './LatestTechnology';
import Footer from '../Footer/Footer';

function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  return (
    <>
      <Navbar />
      
      {/* Main About Section */}
      <section className="relative bg-gradient-to-br from-white via-sky-50 to-sky-50 py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <Motion.div
          className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Text Section */}
          <Motion.div className="space-y-8" variants={itemVariants}>
            <div className="space-y-4">
              <Motion.div variants={itemVariants} className="inline-block">
              <span className="bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent text-sm font-bold uppercase tracking-widest">
                About Our Excellence
              </span>
              </Motion.div>
              <Motion.h2
                variants={itemVariants}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent leading-tight"
              >
                Your Health, Our Priority
              </Motion.h2>
            </div>

            <Motion.h3 variants={itemVariants} className="text-2xl font-semibold text-gray-800">
              Transforming Healthcare with Excellence
            </Motion.h3>

            <Motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed font-light">
                At our medical practice, <span className="font-semibold text-sky-400">people come first</span>. We help each of our patients achieve optimal wellness through a comprehensive approach to healthcare — focusing on patient-centered care, preventive medicine, advanced diagnostics, and treatment options tailored to individual needs.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-light">
                We love creating <span className="font-semibold text-sky-400">healthier, happier lives</span>. Our clinic uses advanced technologies including digital imaging, precision diagnostic tools, and modern treatment methodologies to ensure accuracy, comfort, and faster recovery.
              </p>
            </Motion.div>

            {/* Stats */}
            <Motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-8 border-t border-sky-200">
              {[
                { number: 15, label: "Years Experience", suffix: "+" },
                { number: 10000, label: "Happy Patients", suffix: "+" },
                { number: 99, label: "Satisfaction Rate", suffix: "%" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl font-bold text-sky-400">
                    <CountUp end={stat.number} duration={4.5} />
                    {stat.suffix}
                  </p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </Motion.div>
          </Motion.div>

          {/* Image Section */}
          <Motion.div variants={imageVariants} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Motion.img
                src={image}
                alt="Dental professional at work"
                className="w-full h-auto object-cover rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 via-transparent to-transparent rounded-2xl"></div>
            </div>
          </Motion.div>
        </Motion.div>
      </section>

      {/* Global Presence Section */}
      <GlobalPresence />

      {/* Latest Technology Section */}
      <LatestTechnology />
      <Footer/>
    </>
  );
}

export default AboutUs;
