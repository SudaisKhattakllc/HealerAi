import React from 'react';
import { motion as Motion } from 'framer-motion';
import Image from '../../assets/pexels-pavel-danilyuk-8442105.jpg';
import Illusion from "../../assets/pexels-kampus-7551652.jpg";
import Map from "../../assets/Capture.PNG";
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';
import PremiumSendButton from './PremiumSendButton';
import { IconMapPin, IconMail, IconPhone, IconBrandFacebook, IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const contactItemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const socialIcons = [
  { icon: IconBrandFacebook, name: 'Facebook', href: '#' },
  { icon: IconBrandInstagram, name: 'Instagram', href: '#' },
  { icon: IconBrandTwitter, name: 'Twitter', href: '#' },
  { icon: IconBrandYoutube, name: 'YouTube', href: '#' },
];

function ContactUS() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
        {/* Header Section */}
        <div className="relative w-full h-64 md:h-72 flex items-center justify-center bg-sky-900">
          <img src={Image} alt="Contact" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">Contact us</h1>
            <p className="mt-2 text-white/90 text-lg md:text-xl font-medium">
              We’re ready to provide the right solution according to your needs
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto -mt-16 mb-12 bg-white rounded-3xl shadow-2xl p-8 md:p-12 z-20 relative">
          <h2 className="text-3xl font-bold text-sky-400 mb-2 text-center">Send us a message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Name" className="px-4 py-3 rounded-lg border border-sky-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              <input type="text" placeholder="Company" className="px-4 py-3 rounded-lg border border-sky-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              <input type="text" placeholder="Phone" className="px-4 py-3 rounded-lg border border-sky-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
              <input type="email" placeholder="Email" className="px-4 py-3 rounded-lg border border-sky-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
            <input type="text" placeholder="Subject" className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            <textarea placeholder="Message" rows={4} className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
            <PremiumSendButton />
          </form>
        </div>

        {/* Premium Get in Touch Section with Illustration */}
        <div className="max-w-[90rem] mx-auto mb-16 bg-white rounded-3xl shadow-[0_0_60px_rgba(56,189,248,0.25)] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-sky-100">
          {/* Left: Contact Info */}
          <Motion.div
            className="p-10 lg:p-16 flex flex-col justify-center gap-8 bg-gradient-to-br from-white via-sky-50 to-white relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Decorative glow */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-sky-300/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-sky-400 tracking-tight mb-2">Get in touch</h2>
              <div className="h-1 w-20 bg-gradient-to-r from-sky-400 to-sky-300 rounded-full"></div>
            </div>

            <p className="text-gray-600 text-base leading-relaxed relative z-10">
              Reach out for any inquiries or support. Our team is ready to help with healthcare solutions tailored to your needs.
            </p>

            <Motion.div className="space-y-6 relative z-10" variants={containerVariants}>
              {[
                {
                  icon: <IconMapPin size={28} className="text-white" />,
                  title: "Head Office",
                  detail: "Mardan University Road\nPeshawar, Pakistan"
                },
                {
                  icon: <IconMail size={28} className="text-white" />,
                  title: "Email Us",
                  detail: "support@yourdomain.tld\nhello@yourdomain.tld"
                },
                {
                  icon: <IconPhone size={28} className="text-white" />,
                  title: "Call Us",
                  detail: "Phone: +6221.2002.2012\nFax: +6221.2002.2013"
                }
              ].map((item, idx) => (
                <Motion.div
                  key={idx}
                  variants={contactItemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ y: -8, boxShadow: '0 25px 60px rgba(56, 189, 248, 0.25)' }}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100/60 cursor-pointer transition-all"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center shadow-lg">
                    {item.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-800 text-lg">{item.title}</div>
                    <div className="text-sm text-gray-600 mt-1 whitespace-pre-line">{item.detail}</div>
                  </div>
                </Motion.div>
              ))}
            </Motion.div>

            <Motion.div
              className="mt-8 pt-8 border-t border-sky-100 relative z-10"
              variants={contactItemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="font-semibold text-gray-800 mb-4 text-lg">Follow us</div>
              <div className="flex gap-4">
                {socialIcons.map((item, idx) => {
                  const IconComponent = item.icon;
                  return (
                    <Motion.a
                      key={idx}
                      href={item.href}
                      whileHover={{ rotate: 40, boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 text-white flex items-center justify-center shadow-lg hover:shadow-sky-400/50 transition-all  group"
                      title={item.name}
                    >
                      <IconComponent size={24} className="group-hover:text-sky-100 transition-colors" />
                    </Motion.a>
                  );
                })}
              </div>
            </Motion.div>
          </Motion.div>

          {/* Right: Illustration */}
          <div className="relative flex items-center justify-center bg-sky-50 p-6">
            <div className="absolute inset-0 z-0 bg-sky-400/20 blur-3xl rounded-3xl"></div>
            <img
              src={Illusion}
              alt="Healthcare Illustration"
              className="relative z-10 w-full h-auto max-h-[520px] object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Final Full-Width Map Section */}
        <div className="max-w-[90rem] mx-auto mb-16 rounded-3xl overflow-hidden shadow-2xl relative">
          <img src={Map} alt="Full Map" className="w-full h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-900/40 via-transparent to-transparent"></div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ContactUS;
