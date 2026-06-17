import { motion } from "motion/react"; // eslint-disable-line no-unused-vars

// Import organ images
import brainImg from "../../assets/brain.png";
import heartImg from "../../assets/heart.png";
import boneImg from "../../assets/icons8-orthopedic-100.png";
import spinalImg from "../../assets/icons8-spinal-cord-100.png";
import eyeImg from "../../assets/eye.png";
import surgeryImg from "../../assets/cosmetic-surgery.png";
import dentalImg from "../../assets/dentistry.png";
import anasthesiaImg from "../../assets/anesthesia.png";
import lungsImg from "../../assets/icons8-anatomy-100.png";
import liverImg from "../../assets/icons8-liver-100.png";
import entImg from "../../assets/sore-throat.png";
import nephrologyImg from "../../assets/kidney.png";
import stomachImg from "../../assets/stomach.png";
import ureterImg from "../../assets/icons8-urology-100.png";
import pancreasImg from "../../assets/icons8-pancreas-100.png";
import childDoctorsImg from "../../assets/icons8-child-100.png";

import { specialties } from "./mockData";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import HowItWorks from "../HowItWorks/HowItWorks";
import Testimonials from "../Testimonials/Testimonials";
import FAQS from "../FAQS/FAQS";

// Map specialties to their images
const specialtyImageMap = {
  brain: brainImg,
  heart: heartImg,
  bone: boneImg,
  spinal: spinalImg,
  eye: eyeImg,
  surgery: surgeryImg,
  dental: dentalImg,
  anasthesia: anasthesiaImg,
  lungs: lungsImg,
  liver: liverImg,
  ent: entImg,
  nephrology: nephrologyImg,
  stomach: stomachImg,
  ureter: ureterImg,
  pancreas: pancreasImg,
  child: childDoctorsImg,
};

const OrganGrid = ({ onSelectSpecialty }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const handleSelectSpecialty = (specialty) => {
    if (onSelectSpecialty) {
      onSelectSpecialty(specialty);
    }
  };

  return (

    <>

<Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-50 px-4 py-12">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 max-w-2xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-sky-400 mb-4">
          Find Your Doctor
        </h1>
        <p className="text-lg text-gray-600">
          Select a medical specialty to find the best doctors in your area. Our
          network includes highly qualified professionals across all major fields
          of medicine.
        </p>
      </motion.div>

      {/* Organ Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        {specialties.map((specialty) => (
          <motion.button
          key={specialty.id}
            variants={itemVariants}
            whileHover={{
              scale: 1.08,
              rotateZ: 3,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelectSpecialty(specialty)}
            className="group relative"
          >
            {/* Card Background */}
            <div
              className="relative h-56 md:h-64 rounded-3xl p-6 bg-white backdrop-blur-xl shadow-xl hover:shadow-2xl border border-sky-400 hover:border-sky-700 transition-all duration-300 cursor-pointer overflow-hidden group"
            >
              {/* Premium Glow Effect */}
              <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-300 pointer-events-none"></div>
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center z-10">
                {/* Icon/Image - Larger and more prominent */}
                <div className="mb-4 flex items-center justify-center h-28 w-28 md:h-32 md:w-32 rounded-full bg-sky-50 border-4 border-sky-400 group-hover:border-sky-700 shadow-lg transition-all duration-300">
                  <img
                    src={specialtyImageMap[specialty.icon]}
                    alt={specialty.name}
                    className="w-24 h-24 md:w-28 md:h-32 object-contain drop-shadow-xl"
                  />
                </div>
                {/* Text Content */}
                <div className="text-center">
                  <h3 className="text-sky-900 font-bold text-base md:text-xl mb-1 tracking-wide drop-shadow-sm">
                    {specialty.name}
                  </h3>
                  <p className="text-sky-700/80 text-xs md:text-base leading-tight font-medium">
                    {specialty.description}
                  </p>
                </div>
              </div>
              {/* Premium Hover Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-end justify-center rounded-3xl pointer-events-none z-20"
              >
                <div className="mb-7 px-7 py-2 bg-gradient-to-r from-sky-400 to-sky-700 shadow-xl rounded-full text-white font-bold text-base md:text-lg tracking-wide border-2 border-white/30 backdrop-blur-md animate-pulse drop-shadow-lg">
                  Discover Doctors
                </div>
              </motion.div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Bottom Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-16 text-center"
      >
        
      </motion.div>
    </div>
    <HowItWorks/>

<Testimonials/>
<FAQS/>
    <Footer/>
                </>
  );
};

export default OrganGrid;
