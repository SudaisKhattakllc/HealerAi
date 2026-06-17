/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { IconStar } from '@tabler/icons-react';
import number1 from '../../assets/Frame 22 (2).png';
import number2 from '../../assets/Frame 23 (1).png';
import number3 from '../../assets/Frame 24 (1).png';
import DoctorBG from '../../assets/Frame 18.png';
import zigzag from '../../assets/Group.png';
import Doctor from '../../assets/pexels-klaus-nielsen-6303556-Photoroom.png';

function HowItWorks() {
  return (
    <section className="bg-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Heading with Motion */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: false, amount: 0.5 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900">
            How our <span className="text-sky-400">platform</span> works
          </h2>
          <p className="mt-4 text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Navigating your healthcare journey with HealNet is seamless. Just follow the steps below to get started with your selected services. You can also explore our FAQ section for more guidance.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 ml-12 lg:grid-cols-2 gap-10 items-center">
          {/* Left Side: Steps with slide-in from left */}
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            {[{ img: number1, title: 'Create Your Profile', desc: 'Fill in your medical history securely. Setting up your profile ensures you stay up-to-date with your medical processes.' },
              { img: number2, title: 'Choose Your Service', desc: 'Select from a range of services and book a consultation. Booking with HealNet is simple and straightforward.' },
              { img: number3, title: 'Meet Your Doctor', desc: 'Have a virtual consultation with a certified specialist or visit a clinic for an in-person check-up.' }
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-5">
                <img src={step.img} alt={`Step ${index + 1}`} className="w-14 h-14 object-contain" />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 text-lg mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right Side: Doctor Image with slide-in from right */}
          <motion.div
            className="relative w-full h-full flex justify-center items-center"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {/* Background behind doctor */}
            <img
              src={DoctorBG}
              alt="Background"
              className="absolute w-[350px] h-[350px] object-contain z-0"
              style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)' }}
            />

            {/* Doctor image */}
            <img
              src={Doctor}
              alt="Doctor"
              className="relative -mt-12 z-10 w-[100%] max-w-[400px] object-contain"
            />

            {/* Zigzag accent */}
            <motion.img
              src={zigzag}
              alt="Zigzag"
              className="absolute bottom-0 right-0 w-36 h-36 object-contain z-20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat:Infinity}}
            />

            {/* Highlight Bar attached to doctor bottom */}
            <motion.div
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white shadow-[0_0_30px_rgba(255,255,255,0.6)] px-10 py-3 rounded-md border-2 border-sky-400 text-gray-800 text-sm font-medium flex items-center gap-2 z-30"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.5 }}
            >
              <IconStar size={20} className="text-sky-400" />
              Certified specialists with us
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
