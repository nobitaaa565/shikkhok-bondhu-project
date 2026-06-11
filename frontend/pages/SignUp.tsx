
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../ApiService';

interface SignUpProps {
  onLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await ApiService.register({
        username: email, // Use email as username for backend
        email: email,
        password: password,
      });
      // After registration, auto login or redirect to login
      await ApiService.login(email, password);
      onLogin('educator');
      navigate('/dashboard');
    } catch (err: any) {
      try {
        const fullError = JSON.parse(err.message);
        setError(Object.values(fullError).flat().join(' '));
      } catch {
        setError(err.message || 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-lg">
        <div className="tile p-8 md:p-12 focus-border rounded-2xl">
          <div className="text-center mb-10">
            <div className="mono text-[0.625rem] text-[var(--amethyst-focus)] mb-4 font-black uppercase">GET STARTED</div>
            <h2 className="text-4xl font-black uppercase tracking-tighter gradient-text">JOIN THE CORE</h2>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Zannatul Ferdushie"
                  className="contact-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">School / Institution</label>
                <input
                  type="text"
                  placeholder="Global Academy"
                  className="contact-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">Work Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="teacher@school.edu"
                className="contact-input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="mono text-[0.625rem] uppercase text-white/30 block ml-1 font-bold">Create Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="contact-input"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-xs font-bold uppercase tracking-tight ml-1 animate-pulse">{error}</div>
            )}

            <p className="text-[0.625rem] text-white/30 leading-relaxed text-center italic">
              By joining, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span> regarding educational data.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="cta-button w-full focus-border uppercase font-black tracking-tighter text-sm py-4 disabled:opacity-50"
            >
              <span className="relative z-10">{loading ? 'Creating...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-white/30">
              Already have an account? {' '}
              <button
                onClick={() => navigate('/login')}
                className="text-[var(--amethyst-focus)] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
