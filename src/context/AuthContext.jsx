import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const SUPABASE_URL = 'https://xrqpszhccwafmscantvk.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhycXBzemhjY3dhZm1zY2FudHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNDIyNDAsImV4cCI6MjA4ODkxODI0MH0.NZID4kac880DjiIghbqrD0VeBGcV8AvZMFWCLqj4BIw';

// Fetch role using native HTTP so Supabase JS client deadlocks can't block it
async function fetchRoleNative(userId) {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role&limit=1`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!res.ok) {
      console.error('Role fetch HTTP error:', res.status);
      return null;
    }
    const data = await res.json();
    return data?.[0]?.role ?? null;
  } catch (e) {
    console.error('Role fetch failed:', e);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          const r = await fetchRoleNative(session.user.id);
          if (mounted) setRole(r);
          console.log('AuthContext: role loaded =>', r, 'for user', session.user.email);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: auth event =>', event, session?.user?.email);
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        const r = await fetchRoleNative(session.user.id);
        if (mounted) {
          setRole(r);
          console.log('AuthContext: role after event =>', r);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      if (mounted) setLoading(false);
    });

    // Safety net: never block ui beyond 4 seconds
    const t = setTimeout(() => { if (mounted) setLoading(false); }, 4000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(t);
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, loading, signOut }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-sky-50 flex-col space-y-4">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="text-sky-800 font-bold">Verifying Session...</p>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
