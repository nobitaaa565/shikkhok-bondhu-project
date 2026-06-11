
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService';

interface LoginProps {
  onLogin: (role: 'educator' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [educatorEmail, setEducatorEmail] = useState('');
  const [educatorPass, setEducatorPass] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!educatorEmail || !educatorPass) {
      setError('Please fill in all educator fields.');
      return;
    }

    setLoading(true);
    try {
      // Backend expects username, we use email as username for simplicity in this demo
      // In a real app, registration would handle this.
      await ApiService.login(educatorEmail, educatorPass);
      onLogin('educator');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="tile p-8 md:p-12 relative overflow-hidden group border-t-4 border-t-[var(--amethyst-focus)] flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_50px_rgba(124,58,237,0.15)]">
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-[var(--amethyst-focus)] transform rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--amethyst-focus)]/10 flex items-center justify-center text-[var(--amethyst-focus)] border border-[var(--amethyst-focus)]/20 shadow-inner">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="mono text-[0.625rem] text-[var(--amethyst-focus)] font-black uppercase tracking-[0.2em]">Educator Portal</div>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-slate-900">Access your core</h2>
              <p className="text-white/40 [html[data-theme='light']_&]:text-slate-500 text-sm mt-2 font-medium">Connect to your materials, training, and community.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="mono text-[0.625rem] uppercase text-white/30 [html[data-theme='light']_&]:text-slate-400 block ml-1 font-bold">Email Address</label>
                <input
                  type="email"
                  value={educatorEmail}
                  onChange={(e) => setEducatorEmail(e.target.value)}
                  placeholder="teacher@school.edu"
                  className="contact-input bg-black/20 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900 border-white/5 focus:border-[var(--amethyst-focus)]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end mb-1">
                  <label className="mono text-[0.625rem] uppercase text-white/30 [html[data-theme='light']_&]:text-slate-400 block ml-1 font-bold">Password</label>
                  <button type="button" className="text-[0.56rem] mono text-[var(--amethyst-focus)] uppercase font-bold hover:underline">Forgot?</button>
                </div>
                <input
                  type="password"
                  value={educatorPass}
                  onChange={(e) => setEducatorPass(e.target.value)}
                  placeholder="••••••••"
                  className="contact-input bg-black/20 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900 border-white/5 focus:border-[var(--amethyst-focus)]"
                />
              </div>

              {error && (
                <div className="text-red-500 text-xs font-bold uppercase tracking-tight ml-1 animate-pulse">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="cta-button w-full focus-border uppercase font-black tracking-tighter text-xs py-4 disabled:opacity-50 mt-4 shadow-[0_10px_30px_-10px_rgba(124,58,237,0.5)]"
              >
                <span className="relative z-10">{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100 flex items-center justify-between">
            <p className="text-[0.65rem] text-white/30 [html[data-theme='light']_&]:text-slate-400 uppercase font-black tracking-widest">
              New to the Core?
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="text-[var(--amethyst-focus)] text-[0.65rem] font-black uppercase tracking-widest hover:underline"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
