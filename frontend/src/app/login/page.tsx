'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Compass, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { user, login } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center min-h-screen px-6 py-12 relative theme-auth">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5FFAE0] opacity-[0.06] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C22ED0] opacity-[0.06] rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-2 hover:opacity-90 transition-opacity">
            <Compass className="w-10 h-10 text-cyan-500" />
            <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 via-indigo-500 via-cyan-500 to-emerald-500 font-extrabold tracking-wider">VAGABOND</span>
          </Link>
          <p className="text-slate-500 text-sm text-center">Plan your journeys and track costs with AI</p>
        </div>

        {/* Card Panel */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-200 shadow-xl">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">Welcome Back</h2>

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-650 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-white"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-650 text-xs font-semibold uppercase tracking-wider mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  className="glass-input w-full pl-10 pr-4 py-3 rounded-lg text-sm bg-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 mt-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/15"
              disabled={submitting}
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-200 pt-6">
            New to VAGABOND?{' '}
            <Link href="/register" className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
