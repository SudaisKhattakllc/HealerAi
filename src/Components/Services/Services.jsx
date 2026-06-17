/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import {
  IconCalendar,
  IconMessageCircle,
  IconClipboardText,
  IconBottle,
  IconSearch,
  IconAlertCircle,
  IconShieldCheck,
  IconDownload,
  IconEye,
  IconX,
  IconShare,
  IconClock,
  IconUserCheck,
  IconBell,
  IconStar,
} from '@tabler/icons-react';

import PlusIcon from '../../assets/Group 27.png';

function Services() {
  const services = [
    {
      title: 'AI Agent for Symptoms',
      description: [
        'Describe how you feel and get instant condition suggestions.',
        'Receive first-aid tips and treatment options.',
        'Built for early detection and fast decision-making.',
        'Private, multilingual, and always available.',
      ],
      icon: <IconMessageCircle size={24} className="text-sky-400" />,
    },
    {
      title: 'Booking Appointments',
      description: [
        'Pick your time, choose your doctor, and book in seconds.',
        'Get reminders and calendar sync.',
        'Reschedule anytime with full control.',
        '24/7 support for booking issues.',
      ],
      icon: <IconCalendar size={24} className="text-sky-400" />,
    },
    {
      title: 'Medical Notes',
      description: '',
      icon: <IconClipboardText size={24} className="text-sky-400" />,
      tall: true,
    },
    {
      title: 'Medicine Refills',
      description: [
        'Refill prescriptions online—no queues.',
        'Set reminders for dosage and renewals.',
        'Choose delivery or pharmacy pickup.',
        'Track refill history and medication schedule.',
      ],
      icon: <IconBottle size={24} className="text-sky-400" />,
    },
    {
      title: 'Find A Doctor',
      description: [
        'Search by specialty, location, or language.',
        'View profiles, ratings, and availability.',
        'Filter by gender, experience, or clinic type.',
        'Connect instantly via call or message.',
      ],
      icon: <IconSearch size={24} className="text-sky-400" />,
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="services" className="bg-white pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
   <motion.div
  className="max-w-7xl mx-auto relative z-10"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  transition={{ staggerChildren: 0.15 }}
  variants={fadeUp}
>
  <motion.div variants={fadeUp} className="relative mb-8">
    <h2 className="text-4xl md:text-6xl font-bold text-gray-900 text-center">
      Top <span className="text-sky-400">Services</span> We Offer
    </h2>
    <img
      src={PlusIcon}
      alt="Plus Icon"
      className="absolute top-0 -right-4 w-6 h-8 md:w-20 md:h-20 object-contain"
    />
  </motion.div>

  <motion.p
    variants={fadeUp}
    className="text-gray-600 text-base md:text-lg text-center max-w-3xl mx-auto mb-10"
  >
    In today’s fast-paced world, digital healthcare services are essential. We’ve built a system that’s fast, secure, and accessible. So you can focus on your health, not the hassle.
  </motion.p>
</motion.div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">
        {services.map((service, index) => (
          <motion.div
            key={index}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`bg-white border border-sky-400 rounded-xl p-6 shadow-[0_4px_20px_rgba(0,132,125,0.1)] hover:shadow-[0_6px_28px_rgba(0,132,255,0.35)] transition duration-300 cursor-pointer flex flex-col justify-between ${
              service.tall ? 'h-full lg:row-span-2' : 'min-h-[220px]'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {service.icon}
              <h3 className="text-lg font-semibold text-sky-400">
                {service.title}
              </h3>
            </div>

            {service.title === 'Medical Notes' ? (
              <div className="text-gray-700 text-sm leading-relaxed space-y-4">
                <div className="flex items-start gap-2">
                  <IconClipboardText size={18} className="text-sky-400 mt-1" />
                  <p>Includes diagnosis summary, doctor’s signature, and official timestamp.</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconDownload size={18} className="text-sky-400 mt-1" />
                  <p>Download notes instantly in PDF format.</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconShare size={18} className="text-sky-400 mt-1" />
                  <p>Share securely with employers, schools, or labs.</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconAlertCircle size={18} className="text-sky-400 mt-1" />
                  <p>Submit accurate details to avoid delays or rejection.</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconShieldCheck size={18} className="text-sky-400 mt-1" />
                  <p>Notes are encrypted and verified—never use unofficial copies.</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconEye size={18} className="text-sky-400 mt-1" />
                  <p>Preview before sending to ensure accuracy.</p>
                </div>
                 <div className="flex items-start gap-2">
                  <IconDownload size={18} className="text-sky-400 mt-1" />
                  <p>Download notes instantly in PDF format.</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconX size={18} className="text-sky-400 mt-1" />
                  <p>Do not edit or tamper with official documents.</p>
                </div>
                <div className="flex items-start gap-2">
                  <IconStar size={18} className="text-sky-400 mt-1" />
                  <p>Accepted by most institutions and HR departments.</p>
                </div>
              </div>
            ) : (
              <ul className="text-gray-700 text-sm leading-relaxed space-y-2">
                {Array.isArray(service.description)
                  ? service.description.map((line, i) => <li key={i}>{line}</li>)
                  : <li>{service.description}</li>}
              </ul>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Services;
