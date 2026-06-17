/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import DoctorImage from '../../assets/pexels-jrfotosgrand-fotografia-259137805-12660379-Picsart-BackgroundRemover.jpg';
import ImageBG from '../../assets/Rectangle 1.png';
import bar1 from '../../assets/Frame 3 (2).png';
import string from '../../assets/Vector 1.png';
import Companies from '../../assets/Group 10.png';
import MidGlowButton from '../AgentButton/OrbitGlowButton';
import SymptomAIModal from '../SymptomAI/SymptomAIModal';




function HeroSection() {
  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <>
      <section className="relative bg-sky-50 overflow-hidden">
        {/* Decorative string at bottom */}
        <img
          src={string}
          alt="Decorative vector"
          className="absolute bottom-0 left-0 w-full max-h-[300px] object-cover pointer-events-none opacity-100"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-[60%] mb-8 space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Your <span className="text-sky-400">trusted partner</span> in digital healthcare
            </h1>
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
              Empowering Your Health at Every Step. Experience personalized medical care from the comfort of your home. Connect with certified doctors, manage prescriptions, and schedule appointments with ease.
              Get Started Today, or Book an Appointment
            </p>

            {/* Badge */}
            <div className="inline-flex items-center bg-sky-100 text-sky-600 text-sm font-semibold px-4 py-2 rounded-full gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Easy Appointment Booking System
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* <button className="bg-sky-400 cursor-pointer text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-sky-700 transition">
                Launch AI Agent for Symptoms
              </button> */}


              <MidGlowButton onClick={() => setAiOpen(true)} />

              <button
                onClick={() => navigate('/finddoctors')}
                className="border border-sky-400 text-sky-400 px-6 py-3 rounded-md text-sm font-medium hover:bg-sky-100 hover:text-sky-400 cursor-pointer transition"
              >
                Book an Appointment
              </button>
            </div>

            {/* Footer Text */}
            <p className="text-md text-gray-500 pt-2">
              Trusted by millions across the globe
            </p>
            <img className="h-8" src={Companies} alt="Trusted companies" />
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-[40%] relative flex justify-center items-center"
          >
            <div className="relative w-full max-w-[480px]">
              {/* Top-left bar near doctor face */}
              <motion.div
                initial={{ opacity: 0, x: -500 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute top-[-10px] left-[-20px] w-[220px] z-20"
              >
                <img src={bar1} alt="Review box" className="w-full" />
                <div className="absolute inset-0 flex flex-col mb-4 items-center justify-center text-sm font-semibold text-gray-700 text-center px-2">
                  Rated 4.7/5<br />
                  Trusted by Patients
                </div>
              </motion.div>

              {/* Bottom-right bar below doctor */}
              <div className="absolute bottom-[-20px] right-[-10px] w-[220px] z-20">
                <img src={bar1} alt="Review box" className="w-full" />
                <div className="absolute inset-0 flex flex-col mb-2 items-center justify-center text-sm font-semibold text-gray-700 text-center px-2">
                  2400+ Happy Customers<br />
                  Across the Globe
                </div>
              </div>

              {/* Smaller BG behind doctor */}
              <img
                src={ImageBG}
                alt="Background"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-auto object-contain z-0"
              />
              {/* Larger doctor image above */}
              <img
                src={DoctorImage}
                alt="Doctor"
                className="relative z-10 w-full h-auto object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <SymptomAIModal
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
        onContinue={({ specialtyId, diseaseLabel, confidence, symptoms }) => {
          setAiOpen(false);
          navigate('/finddoctors', {
            state: {
              specialtyId,
              fromAI: true,
              diseaseLabel,
              confidence,
              symptoms,
            },
          });
        }}
      />

      {/* Section Divider at bottom */}
      <div className="w-full overflow-hidden -mb-1">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#38BDF8" fill-opacity="1" d="M0,256L120,234.7C240,213,480,171,720,165.3C960,160,1200,192,1320,208L1440,224L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"></path></svg>
      </div>
    </>
  );
}

export default HeroSection;
