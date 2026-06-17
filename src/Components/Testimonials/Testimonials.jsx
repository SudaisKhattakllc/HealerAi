/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import person1 from '../../assets/Rectangle 8 (1).png';
import person2 from '../../assets/Rectangle 8 (2).png';
import person3 from '../../assets/Rectangle 8 (4).png';
import person4 from '../../assets/Rectangle 8.png';
import Sphere from "../../assets/Vector (2).png";

function Testimonials() {
  const { ref, inView } = useInView({ triggerOnce: true });

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
        className="max-w-3xl mx-auto text-center mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          What Our <span className="text-sky-400">Patients Say</span>
        </h2>
        <p className="mt-3 text-gray-600 text-base md:text-lg">
          Real stories. Real impact. Trusted care from HealerAi.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Testimonials */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sphere behind first testimonial */}
          <img
            src={Sphere}
            alt="Decorative Sphere"
            className="absolute top-0 left-12 w-64 h-64 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40 z-0"
          />

          {[{
            img: person1,
            name: 'Linda A.',
            comment: 'After my knee surgery, the convenience of online consultations made my recovery smoother than I had imagined.'
          }, {
            img: person2,
            name: 'Henry B.',
            comment: 'Managing chronic conditions like diabetes requires vigilance, but HealerAi has simplified my life.'
          }].map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: false, amount: 0.4 }}
              className="relative z-10 bg-white shadow-[0_4px_20px_rgba(0,132,125,0.35)] rounded-xl p-6 text-center"
            >
              <img src={person.img} alt={person.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
              <p className="text-gray-600 text-md mt-2">{person.comment}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats Block */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false, amount: 0.5 }}
          className="flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { label: 'Successful Consultations', value: 10000, suffix: '+' },
            { label: 'Healthcare Professionals', value: 2500, suffix: '+' },
            { label: 'Patient Satisfaction Rate', value: 98, suffix: '%' },
            { label: 'Top Specialists', value: 200, suffix: '+' }
          ].map((stat, index) => (
            <div key={index} className="flex-1 min-w-[150px]">
              <h3 className="text-5xl font-bold bg-gradient-to-r from-sky-300 to-sky-600 text-transparent bg-clip-text">
                {inView && <CountUp end={stat.value} duration={4} />}<span>{stat.suffix}</span>
              </h3>
              <p className="text-gray-700 mt-2 text-base">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Bottom Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[{
            img: person3,
            name: 'Joshua T.',
            comment: 'The prescription refill system is a game-changer. It’s efficient and completely hassle-free.'
          }, {
            img: person4,
            name: 'Samantha K.',
            comment: 'Finding a doctor who truly understands my health needs has never been easier. HealerAi changed my life.'
          }].map((person, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: false, amount: 0.4 }}
              className="bg-white shadow-[0_4px_20px_rgba(0,132,125,0.35)] rounded-xl p-6 text-center"
            >
              <img src={person.img} alt={person.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
              <h4 className="text-lg font-semibold text-gray-900">{person.name}</h4>
              <p className="text-gray-600 text-md mt-2">{person.comment}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
