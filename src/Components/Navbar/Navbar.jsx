import { useState } from 'react';
import { IconMenu2, IconX, IconBell, IconLogout } from '@tabler/icons-react';
import Login from "../../Components/Navbar/LoginForms/Login";
import Signin from '../Navbar/LoginForms/Signin';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignin, setShowSignin] = useState(false);

  const { user, role, signOut } = useAuth();

  const handleLogout = () => signOut();
  const displayRole = role ? `${role.charAt(0).toUpperCase()}${role.slice(1).toLowerCase()}` : 'User';

  const navLinks = [
    { name: 'Home', href: '/', active: true },
    { name: 'Services', href: '/#services' },
    { name: 'FindDoctors', href: '/finddoctors' },
    { name: 'About us', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact us', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 text-2xl font-bold text-gray-900">
            Healer<span className="text-sky-400">Ai</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-md ${link.active
                    ? 'text-sky-400'
                    : 'text-gray-600 hover:text-sky-400'
                  }`}
              >
                {link.name}
              </a>
            ))}
            <div className="flex space-x-4 items-center">
              {user ? (
                <>
                  <span className="px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-[0.18em] border border-sky-100">
                    Role: {displayRole}
                  </span>
                  <NotificationDropdown />
                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="text-gray-500 hover:text-red-500 transition cursor-pointer"
                  >
                    <IconLogout size={20} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowLogin(true)}
                    className="text-sm px-4 cursor-pointer font-medium py-2 rounded-md border border-sky-400 text-sky-400 hover:bg-sky-100 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setShowSignin(true)}
                    className="text-sm font-medium cursor-pointer px-4 py-2 rounded-md bg-sky-900 text-white hover:bg-sky-700 transition"
                  >
                    SignUp
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {mobileOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`block text-sm font-medium ${link.active
                  ? 'text-sky-400'
                  : 'text-gray-700 hover:text-sky-400'
                }`}
            >
              {link.name}
            </a>
          ))}
          <div className="flex flex-col space-y-3 mt-4 border-t pt-4">
            {user ? (
              <>
                <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-medium text-gray-700">Role: {displayRole}</span>
                  <NotificationDropdown />
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 font-bold rounded-md border border-red-400 text-red-500 hover:bg-red-50 transition w-full flex justify-center items-center gap-2"
                >
                  <IconLogout size={16} /> Logout
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm px-4 py-2 font-bold rounded-md border border-sky-400 text-sky-400 hover:bg-sky-100 transition w-full"
                >
                  Login
                </button>
                <button
                  onClick={() => setShowSignin(true)}
                  className="text-sm px-4 py-2 rounded-md bg-sky-900 text-white hover:bg-sky-700 transition w-full"
                >
                  SignUp
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignin && <Signin onClose={() => setShowSignin(false)} onSwitchToLogin={() => { setShowSignin(false); setShowLogin(true); }} />}
    </nav>
  );
};

export default Navbar;
