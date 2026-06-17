import React from 'react';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube
} from '@tabler/icons-react';

function Footer() {
  return (
    <footer className="bg-sky-950 border-t border-gray-200 pt-16 pb-8 px-4 sm:px-6 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo + Tagline */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="text-2xl font-bold text-white">Healer <span className='text-sky-400'>Ai</span></h3>
          <p className="text-white text-sm">
            Experience personalized medical care from the comfort of your home.
          </p>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-white">
            <li className=' hover:text-sky-400 cursor-pointer'>Getting Started</li>
            <li className=' hover:text-sky-400 cursor-pointer'>FAQs</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Help Articles</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Report an Issue</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Contact Help Desk</li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2  text-sm text-white">
            <li className=' hover:text-sky-400 cursor-pointer'>Booking Appointments</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Online Consultations</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Prescriptions</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Medicine Refills</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Medical Notes</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2  text-sm text-white">
            <li className=' hover:text-sky-400 cursor-pointer'>Terms & Conditions</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Privacy Policy</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Cookie Notice</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Cookie Preferences</li>
            <li className=' hover:text-sky-400 cursor-pointer'>Trust Center</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-200 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-white">
        <p>© 2025 HealerAi. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-sky-400 transition">
            <IconBrandFacebook size={20} />
          </a>
          <a href="#" className="hover:text-sky-400 transition">
            <IconBrandInstagram size={20} />
          </a>
          <a href="#" className="hover:text-sky-400 transition">
            <IconBrandLinkedin size={20} />
          </a>
          <a href="#" className="hover:text-sky-400 transition">
            <IconBrandYoutube size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
