import React from 'react';
import { motion as Motion } from 'framer-motion';
import image from "../../assets/pexels-pavel-danilyuk-8442105.jpg";
import { IconVideo, IconBrain, IconHeartbeat, IconShield } from '@tabler/icons-react';

function LatestTechnology() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
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

  const technologies = [
    {
      id: 1,
      title: "AI-Powered Diagnostics",
      description: "Advanced artificial intelligence for precise disease detection",
      icon: IconBrain
    },
    {
      id: 2,
      title: "Real-Time Monitoring",
      description: "Continuous patient health tracking and alerts",
      icon: IconHeartbeat
    },
    {
      id: 3,
      title: "Secure Data Management",
      description: "HIPAA-compliant encrypted patient records",
      icon: IconShield
    },
    {
      id: 4,
      title: "Telemedicine Integration",
      description: "Seamless virtual consultations and follow-ups",
      icon: IconVideo
    }
  ];

  return (
    <section className="relative py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-white via-sky-50 to-sky-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Image Section */}
          <Motion.div variants={imageVariants} className="relative group lg:col-span-2 order-2 lg:order-1">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 via-sky-400 to-sky-400 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Motion.img
                src={image}
                alt="Latest medical technology"
                className="w-full h-auto object-cover rounded-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/20 via-transparent to-transparent rounded-2xl"></div>
            </div>
          </Motion.div>

          {/* Content Section */}
          <Motion.div className="space-y-4 order-1 lg:order-2 lg:col-span-1" variants={itemVariants}>
            <div className="space-y-3">
              <Motion.div variants={itemVariants} className="inline-block">
                <span className="bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent text-xs font-bold uppercase tracking-widest">
                  Cutting-Edge Innovation
                </span>
              </Motion.div>
              <Motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent leading-tight"
              >
                Latest Healthcare Technology
              </Motion.h2>
            </div>

            <Motion.p variants={itemVariants} className="text-sm text-gray-700 leading-relaxed font-light">
              We stay at the forefront of medical innovation with cutting-edge technologies.
            </Motion.p>

            {/* Technology Features */}
            <Motion.div variants={containerVariants} className="space-y-2">
              {technologies.map((tech) => {
                const IconComponent = tech.icon;
                return (
                  <Motion.div
                    key={tech.id}
                    variants={itemVariants}
                    className="flex gap-3 p-3 rounded-lg bg-white/50 border border-sky-100 hover:bg-sky-50 hover:border-sky-300 transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent size={20} className="text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-800 text-xs mb-0.5">{tech.title}</h3>
                      <p className="text-xs text-gray-600">{tech.description}</p>
                    </div>
                  </Motion.div>
                );
              })}.
            </Motion.div>
          </Motion.div>
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
      `}</style>
    </section>
  );
}

export default LatestTechnology;