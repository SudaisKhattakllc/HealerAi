import React from 'react';
import { motion as Motion } from 'framer-motion';
import CountUp from 'react-countup';
import { IconMapPin, IconUsers, IconHeartHandshake, IconMedicalCross } from '@tabler/icons-react';

function GlobalPresence() {
  const locations = [
    {
      id: 1,
      city: "New York",
      country: "USA",
      description: "State-of-the-art medical facility",
      patients: 2500,
      icon: IconMedicalCross,
      color: "from-sky-400 to-sky-500"
    },
    {
      id: 2,
      city: "London",
      country: "UK",
      description: "Premium healthcare center",
      patients: 1800,
      icon: IconHeartHandshake,
      color: "from-sky-400 to-sky-500"
    },
    {
      id: 3,
      city: "Toronto",
      country: "Canada",
      description: "Advanced treatment facilities",
      patients: 2100,
      icon: IconMapPin,
      color: "from-sky-400 to-sky-500"
    },
    {
      id: 4,
      city: "Sydney",
      country: "Australia",
      description: "Excellence in healthcare delivery",
      patients: 1600,
      icon: IconUsers,
      color: "from-sky-400 to-sky-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-slate-900 via-sky-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <Motion.div
          className="text-center mb-16"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Motion.div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent text-sm font-bold uppercase tracking-widest">
              Global Network
            </span>
          </Motion.div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Our Global Medical Network
          </h2>
          <p className="text-xl text-sky-100 max-w-2xl mx-auto font-light">
            Serving patients worldwide with premium healthcare and cutting-edge technology
          </p>
        </Motion.div>

        {/* Cards Grid */}
        <Motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {locations.map((location) => {
            const IconComponent = location.icon;
            return (
            <Motion.div
              key={location.id}
              variants={cardVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden h-full">
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${location.color} opacity-0 group-hover:opacity-20 transition-all duration-500`}></div>
                
                {/* Card content */}
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-2xl p-8 h-full transition-all duration-500 group-hover:bg-white/10">
                  
                  {/* Icon */}
                  <div className="text-5xl mb-6 transform group-hover:scale-125 transition-transform duration-500 text-sky-400">
                    <IconComponent size={48} />
                  </div>

                  {/* Location Info */}
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {location.city}
                  </h3>
                  <p className="text-sky-300 text-sm mb-4 font-semibold uppercase tracking-wide">
                    {location.country}
                  </p>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    {location.description}
                  </p>

                  {/* Stats */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-sky-400">
                        <CountUp end={location.patients} duration={2.5} />+
                      </span>
                      <span className="text-xs text-gray-400">Active Patients</span>
                    </div>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-full"></div>
                </div>
              </div>
            </Motion.div>
            );
          })}
        </Motion.div>

        {/* Bottom Stats */}
        <Motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { number: 50, label: "Locations", suffix: "+" },
            { number: 8000, label: "Global Patients", suffix: "+" },
            { number: 200, label: "Expert Doctors", suffix: "+" },
            { number: 24, label: "Hours Support", suffix: "/7" }
          ].map((stat, idx) => (
            <Motion.div
              key={idx}
              variants={cardVariants}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <p className="text-3xl md:text-4xl font-bold text-sky-400 mb-2">
                <CountUp end={stat.number} duration={2.5} />
                {stat.suffix}
              </p>
              <p className="text-gray-300 text-sm uppercase tracking-wide">{stat.label}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </div>

      {/* Add CSS for animations if not already in your global CSS */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

export default GlobalPresence;
