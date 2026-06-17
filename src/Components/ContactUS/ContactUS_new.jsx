import React from 'react'
import { motion as Motion } from 'framer-motion'
import CountUp from 'react-countup'
import Map from "../../assets/Capture.PNG"
import Image from '../../assets/pexels-pavel-danilyuk-8442105.jpg'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'
import PremiumSendButton from './PremiumSendButton'
import { IconMapPin, IconMail, IconPhone, IconClock } from '@tabler/icons-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
}

const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
}

function ContactUS() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-50">
        {/* Hero Section with Animated Background */}
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative w-full h-72 md:h-80 flex items-center justify-center bg-gradient-to-r from-sky-400 to-sky-600 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-blob"></div>
            <div className="absolute bottom-10 left-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 text-center">
            <Motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg"
            >
              Get in Touch
            </Motion.h1>
            <Motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-3 text-white/95 text-lg md:text-xl font-medium"
            >
              We're ready to provide the right solution according to your needs
            </Motion.p>
          </div>
        </Motion.div>

        {/* Stats Section */}
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 -mt-12 mb-16 relative z-20 px-6"
        >
          {[
            { number: 24, label: 'Hours Support', suffix: '/7' },
            { number: 50, label: 'Locations', suffix: '+' },
            { number: 10000, label: 'Happy Patients', suffix: '+' },
            { number: 150, label: 'Expert Team', suffix: '+' }
          ].map((stat, idx) => (
            <Motion.div
              key={idx}
              variants={itemVariants}
              className="rounded-2xl bg-white/70 backdrop-blur-md border border-sky-200 p-6 shadow-lg text-center hover:shadow-2xl transition"
            >
              <div className="text-3xl md:text-4xl font-bold text-sky-400">
                <CountUp end={stat.number} duration={2.5} />
                {stat.suffix}
              </div>
              <div className="text-sm text-gray-600 mt-2 font-medium">{stat.label}</div>
            </Motion.div>
          ))}
        </Motion.div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto mb-16 px-6">
          <Motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left: Contact Info Cards */}
              <div className="p-8 md:p-12 bg-gradient-to-br from-sky-400/5 to-transparent flex flex-col justify-center">
                <Motion.h2 variants={itemVariants} className="text-3xl font-bold text-sky-400 mb-6">
                  Send us a message
                </Motion.h2>

                <Motion.div variants={containerVariants} className="space-y-4">
                  {[
                    { icon: IconMapPin, title: 'Head Office', desc: ['Mardan University Road', 'Peshawar, Pakistan'] },
                    { icon: IconMail, title: 'Email Us', desc: ['support@yourdomain.tld', 'hello@yourdomain.tld'] },
                    { icon: IconPhone, title: 'Call Us', desc: ['Phone: +6221.2002.2012', 'Fax: +6221.2002.2013'] }
                  ].map((contact, idx) => {
                    const Icon = contact.icon
                    return (
                      <Motion.div key={idx} variants={itemVariants} className="flex gap-4 p-4 rounded-xl bg-white/50 border border-sky-100 hover:bg-sky-50 transition">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-sky-400/10 flex items-center justify-center text-sky-400">
                          <Icon size={24} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{contact.title}</div>
                          {contact.desc.map((line, i) => (
                            <div key={i} className="text-xs text-gray-600">{line}</div>
                          ))}
                        </div>
                      </Motion.div>
                    )
                  })}
                </Motion.div>

                <Motion.div variants={itemVariants} className="mt-8">
                  <div className="font-semibold text-gray-800 mb-3">Follow us</div>
                  <div className="flex gap-3">
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                      <a key={social} href="#" className="w-10 h-10 rounded-lg bg-sky-400/10 text-sky-400 flex items-center justify-center hover:bg-sky-400 hover:text-white transition">
                        <i className={`fab fa-${social}`}></i>
                      </a>
                    ))}
                  </div>
                </Motion.div>
              </div>

              {/* Right: Contact Form */}
              <Motion.div variants={scaleVariants} className="p-8 md:p-12 flex flex-col justify-center">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="Name" className="px-4 py-3 rounded-lg border border-sky-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
                    <input type="text" placeholder="Company" className="px-4 py-3 rounded-lg border border-sky-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
                    <input type="text" placeholder="Phone" className="px-4 py-3 rounded-lg border border-sky-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
                    <input type="email" placeholder="Email" className="px-4 py-3 rounded-lg border border-sky-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
                  </div>
                  <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition" />
                  <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-white/50 backdrop-blur text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition resize-none" />
                  <PremiumSendButton />
                </form>
              </Motion.div>
            </div>
          </Motion.div>
        </div>

        {/* Map Section - Premium Rectangle */}
        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-12 px-6"
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl relative h-96 md:h-[32rem] group">
            <img src={Map} alt="Map" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-900/50 via-transparent to-transparent"></div>

            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 max-w-sm border border-white/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <IconMapPin className="text-sky-400" size={24} />
                <h3 className="text-2xl font-bold text-sky-400">Our Location</h3>
              </div>
              <p className="text-gray-700 text-sm mb-3">Visit our head office or reach out for directions. We're centrally located for your convenience.</p>
              <div className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                <IconClock size={16} className="text-sky-400" />
                Open Mon-Fri: 9AM - 6PM
              </div>
            </Motion.div>
          </div>
        </Motion.div>

        {/* CSS for animations */}
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
      </div>
      <Footer />
    </>
  )
}

export default ContactUS
