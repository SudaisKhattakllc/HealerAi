import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { IconMail, IconLock, IconUser, IconEye, IconEyeOff, IconX } from '@tabler/icons-react';
import { supabase } from '../../../supabaseClient';

function Signin({ onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    age: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { duration: 0.5, ease: 'easeOut' } 
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const inputContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: 'easeOut' } 
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (form.phone && !/^\d{10,}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Phone must be 10+ digits';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.age) newErrors.age = 'Age is required';
    if (!form.role) newErrors.role = 'Role is required';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords don\'t match';
    if (!form.agreeToTerms) newErrors.agreeToTerms = 'Tick checkBox to accept Terms and Conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { name: form.name, role: form.role }
        }
      });
      if (error) throw error;
      
      // If identities is empty, the email is already registered in Supabase
      if (data?.user?.identities && data.user.identities.length === 0) {
        setErrors({ submit: 'This email is already registered! Please go to Log In.' });
        setLoading(false);
        return;
      }
      
      if (data?.user) {
        // Insert user into profiles — save ALL fields so Agents can auto-retrieve them
        const { error: profileError } = await supabase.from('profiles').insert([{
            id: data.user.id,
            name: form.name,
            role: form.role,
            age: parseInt(form.age) || null,
            gender: form.gender,
            phone: form.phone,
            email: form.email
        }]);
        if (profileError) console.error("Profile insert failed:", profileError);
      }
      
      setSuccessMessage('Account created successfully. Please verify your email, then log in to continue.');
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
        else onClose();
      }, 1600);
    } catch (err) {
      setErrors({ submit: err.message || 'Signup failed. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* Backdrop */}
      <Motion.div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        onClick={onClose}
      />

      {/* Modal */}
        <div className="fixed overflow-Hidden inset-0 z-50 flex items-center justify-center px-4 py-6 md:py-20">
        <Motion.div
          className="w-full max-w-4xl md:max-w-5xl relative mx-3 sm:mx-auto max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden scrollbar-hide"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          onClick={e => e.stopPropagation()}
        >
          {/* Glowing border accent */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-500 rounded-3xl blur opacity-20 group-hover:opacity-100 transition duration-1000"></div>

          {/* Card Container */}
          <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl overflow-hidden">
            {/* Close Button */}
            <button
              onClick={onClose}
                className="absolute cursor-pointer top-4 md:top-6 right-4 md:right-6 z-10 p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 transition"
              aria-label="Close"
            >
              <IconX size={22} />
            </button>

            {/* Header */}
            <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-sky-50/80 via-white to-sky-50/50 border-b border-sky-100/30">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent">
                Create Account
              </h1>
              <p className="mt-2 text-sm text-gray-600">Join our healthcare community today</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8">
              <Motion.div
                variants={inputContainerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
              >
                {/* Name Input */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <IconUser className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                    <input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      type="text"
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </Motion.div>

                {/* Email Input */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <IconMail className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                    <input
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      type="email"
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </Motion.div>

                {/* Phone Number Input */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </Motion.div>

                {/* Gender Dropdown */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-800 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </Motion.div>

                {/* Age Input */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="age" className="block text-sm font-semibold text-gray-800 mb-2">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    max="150"
                    placeholder="25"
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </Motion.div>

                {/* Role Dropdown */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-800 mb-2">
                    Account Type (Role)
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                  >
                    <option value="">Select Role</option>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                </Motion.div>

                {/* Password Input */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                    <input
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </Motion.div>

                {/* Confirm Password Input */}
                <Motion.div variants={inputVariants} className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <IconLock className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={20} />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 rounded-xl bg-gradient-to-r from-sky-50/30 to-sky-50/20 border border-sky-200/40 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </Motion.div>
              </Motion.div>

              {/* Terms Agreement - Full Width */}
              <Motion.div variants={inputVariants} className="mt-6 flex flex-col md:flex-row items-start gap-3 p-4 rounded-xl bg-sky-50/30 border border-sky-100/40">
                <input
                  name="agreeToTerms"
                  type="checkbox"
                  checked={form.agreeToTerms}
                  onChange={handleChange}
                  id="agreeTerms"
                  className="mt-1 w-5 h-5 rounded border-sky-300 text-sky-400 focus:ring-sky-400 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-700 cursor-pointer leading-relaxed">
                  I agree to the <a href="#" className="text-sky-400 hover:underline font-medium">Terms & Conditions</a> and <a href="#" className="text-sky-400 hover:underline font-medium">Privacy Policy</a>
                </label>
              </Motion.div>
              {errors.agreeToTerms && <p className="text-red-500 text-xs mt-2">{errors.agreeToTerms}</p>}

              {errors.submit && <p className="text-red-500 text-sm mt-3 text-center">{errors.submit}</p>}
              {successMessage && (
                <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 shadow-sm text-center">
                  {successMessage}
                </div>
              )}
              {/* Submit Button - Full Width */}
              <Motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-3.5 cursor-pointer rounded-xl text-white font-bold bg-gradient-to-r from-sky-400 to-sky-400 hover:shadow-[0_8px_32px_rgba(56,189,248,0.3)] shadow-lg transition-all disabled:opacity-60 text-lg"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Motion.button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-700 mt-6">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-sky-400 hover:text-sky-500 font-semibold hover:underline bg-transparent border-none cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </form>
          </div>
        </Motion.div>
      </div>
    </>
  );
}

export default Signin;
