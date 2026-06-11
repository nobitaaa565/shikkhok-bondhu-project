
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService';

interface AdminLoginProps {
  onLogin: (role: 'admin') => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [adminUsername, setAdminUsername] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!adminUsername || !adminPass) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      await ApiService.login(adminUsername, adminPass);
      onLogin('admin');
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Administrative login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        <div className="tile p-8 md:p-12 relative overflow-hidden group border-t-4 border-t-cyan-500 flex flex-col justify-between transition-all duration-500 hover:shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-slate-900/40 [html[data-theme='light']_&]:bg-slate-50">
          <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-cyan-500 transform -rotate-12 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="mb-10 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 border border-cyan-500/20 shadow-inner">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="mono text-[0.625rem] text-cyan-500 font-black uppercase tracking-[0.2em]">Administrative Portal</div>
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-slate-900">System control</h2>
              <p className="text-white/40 [html[data-theme='light']_&]:text-slate-500 text-sm mt-2 font-medium">Authentication required for administrative access.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="mono text-[0.625rem] uppercase text-white/30 [html[data-theme='light']_&]:text-slate-400 block ml-1 font-bold">Admin Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="contact-input bg-black/20 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900 border-white/5 focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-end mb-1">
                  <label className="mono text-[0.625rem] uppercase text-white/30 [html[data-theme='light']_&]:text-slate-400 block ml-1 font-bold">Security Password</label>
                  <button type="button" className="text-[0.56rem] mono text-cyan-500 uppercase font-bold hover:underline">Emergency Key</button>
                </div>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="admin"
                  className="contact-input bg-black/20 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900 border-white/5 focus:border-cyan-500"
                />
              </div>

              {error && (
                <div className="text-red-500 text-xs font-bold uppercase tracking-tight ml-1 animate-pulse">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="cta-button w-full bg-cyan-600 hover:bg-cyan-700 focus-border border-cyan-500/30 uppercase font-black tracking-tighter text-xs py-4 disabled:opacity-50 mt-4 shadow-[0_10px_30px_-10px_rgba(6,182,212,0.5)]"
              >
                <span className="relative z-10 force-text-white">{loading ? 'Verifying...' : 'Sign In to Admin Panel'}</span>
              </button>
            </form>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="status-pulse"></span>
              <span className="text-[0.6rem] text-white/20 [html[data-theme='light']_&]:text-slate-400 uppercase font-black tracking-widest">System Secure • 256-bit AES</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-[0.65rem] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors"
          >
            Switch to Educator Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
