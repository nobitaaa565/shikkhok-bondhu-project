
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="pt-20 pb-10 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 focus-border flex items-center justify-center font-black text-lg">S</div>
            <span className="font-bold tracking-tighter text-lg uppercase">SHIKKHOK <span className="focus-text">BONDHU</span></span>
          </div>
          <p className="text-sm text-white/40 leading-relaxed">
            Empowering educators worldwide with high-quality, curated teaching resources. Our mission is to transform education through collaboration.
          </p>
        </div>

        <div>
          <div className="font-bold mb-6 text-xs uppercase tracking-widest text-white">Platform</div>
          <div className="space-y-3 text-sm text-white/40">
            <div className="hover:text-white cursor-pointer transition-colors">Features</div>
            <div className="hover:text-white cursor-pointer transition-colors">Pricing</div>
            <div onClick={() => navigate('/resources')} className="hover:text-white cursor-pointer transition-colors">Resources</div>
            <div className="hover:text-white cursor-pointer transition-colors">Community</div>
          </div>
        </div>

        <div>
          <div className="font-bold mb-6 text-xs uppercase tracking-widest text-white">Company</div>
          <div className="space-y-3 text-sm text-white/40">
            <div className="hover:text-white cursor-pointer transition-colors">About Us</div>
            <div className="hover:text-white cursor-pointer transition-colors">Careers</div>
            <div className="hover:text-white cursor-pointer transition-colors">Blog</div>
            <div className="hover:text-white cursor-pointer transition-colors">Privacy Policy</div>
          </div>
        </div>

        <div>
          <div className="font-bold mb-6 text-xs uppercase tracking-widest text-white">Support</div>
          <div className="space-y-3 text-sm text-white/40">
            <div className="hover:text-white cursor-pointer transition-colors">Help Center</div>
            <div className="hover:text-white cursor-pointer transition-colors">Live Chat</div>
            <div className="hover:text-white cursor-pointer transition-colors">Email Us</div>
            <div
              onClick={() => navigate('/admin')}
              className="hover:text-cyan-500 cursor-pointer transition-colors font-bold flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin Login
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-8 border-t border-white/5 mono text-[0.625rem] text-white/30 uppercase font-bold">
        <div>© 2024 SHIKKHOK BONDHU. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer">Twitter</span>
          <span className="hover:text-white cursor-pointer">LinkedIn</span>
          <span className="hover:text-white cursor-pointer">Instagram</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
