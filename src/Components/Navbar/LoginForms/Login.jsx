import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import { IconMail, IconLock, IconEye, IconEyeOff, IconX } from '@tabler/icons-react';
import { supabase } from '../../../supabaseClient';

function LogIn({ onClose }) {
	const [showPassword, setShowPassword] = useState(false);
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');

	const container = {
		hidden: { opacity: 0, scale: 0.98 },
		visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
	};

	const inputsContainer = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } }
	};

	const inputItem = {
		hidden: { opacity: 0, x: -18 },
		visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } }
	};

	function handleChange(e) {
		const { name, value } = e.target;
		setForm(prev => ({ ...prev, [name]: value }));
		if (error) setError(null);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		
		const { error: signInError } = await supabase.auth.signInWithPassword({
			email: form.email,
			password: form.password
		});
		
		if (signInError) {
			setError(signInError.message);
			setLoading(false);
		} else {
			setSuccessMessage('Login successful. Redirecting to your dashboard...');
			setTimeout(() => onClose(), 1200);
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
				variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }}
				initial="hidden"
				animate="visible"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed overflow-hidden inset-0 z-50 flex items-center justify-center px-4 py-6 md:py-20">
				<Motion.div
					className="w-full max-w-md relative mx-3 sm:mx-auto max-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden scrollbar-hide"
					variants={container}
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
							<div className="text-center mb-6">
								<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-sky-400 shadow-lg">
									<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
										<path d="M12 3L20 7v6c0 5-4 9-8 9s-8-4-8-9V7l8-4z" fill="currentColor" opacity="0.95" />
									</svg>
								</div>
								<h1 className="mt-4 text-2xl font-extrabold text-gray-900">Welcome Back</h1>
								<p className="mt-2 text-sm text-gray-600">Login to continue to your account</p>
							</div>
						</div>

						{/* Form */}
						<div className="p-4 sm:p-6 md:p-8">
							<Motion.form onSubmit={handleSubmit} className="space-y-4" variants={inputsContainer} initial="hidden" animate="visible">
								<Motion.div variants={inputItem} className="relative">
									<label className="sr-only">Email</label>
									<div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400">
										<IconMail size={18} />
									</div>
									<input
										name="email"
										value={form.email}
										onChange={handleChange}
										type="email"
										required
										placeholder="Email address"
										className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/60 text-gray-900 placeholder-gray-500 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
										aria-label="Email"
									/>
								</Motion.div>

								<Motion.div variants={inputItem} className="relative">
									<label className="sr-only">Password</label>
									<div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-400">
										<IconLock size={18} />
									</div>
									<input
										name="password"
										value={form.password}
										onChange={handleChange}
										type={showPassword ? 'text' : 'password'}
										required
										placeholder="Password"
										className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/60 text-gray-900 placeholder-gray-500 border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
										aria-label="Password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(s => !s)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
										aria-label={showPassword ? 'Hide password' : 'Show password'}
									>
										{showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
									</button>
								</Motion.div>

								<Motion.div variants={inputItem} className="pt-2">
									{error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}
									{successMessage && (
										<div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 text-center shadow-sm">
											{successMessage}
										</div>
									)}
									<Motion.button
										whileTap={{ scale: 0.98 }}
										type="submit"
										disabled={loading}
										className="w-full py-3 cursor-pointer rounded-xl text-white font-semibold bg-gradient-to-r from-sky-400 to-sky-400 shadow-lg hover:shadow-[0_12px_40px_rgba(56,189,248,0.18)] transition-all disabled:opacity-60"
									>
										{loading ? 'Logging in...' : 'Login'}
									</Motion.button>
								</Motion.div>

								<Motion.div variants={inputItem} className="text-center">
									<a href="#" className="text-sm text-sky-400 hover:underline">Forgot Password?</a>
								</Motion.div>
							</Motion.form>
						</div>
					</div>
				</Motion.div>
			</div>
		</>
	);
}

export default LogIn;



