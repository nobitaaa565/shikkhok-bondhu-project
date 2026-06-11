
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HomeProps {
  isAuthenticated: boolean;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="space-y-32 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-20 relative">
        <div className="flex items-center justify-center gap-3 mono text-[0.6rem] md:text-xs text-[var(--amethyst-focus)] mb-8 font-black uppercase tracking-widest">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--amethyst-focus)]"></span>
          </span>
          Empowering 15,000+ Educators Worldwide
        </div>

        <div className="relative inline-block z-10">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black leading-none mb-8 tracking-tighter text-white [html[data-theme='light']_&]:bg-gradient-to-r [html[data-theme='light']_&]:from-black [html[data-theme='light']_&]:via-purple-600 [html[data-theme='light']_&]:to-purple-800 [html[data-theme='light']_&]:bg-clip-text [html[data-theme='light']_&]:text-transparent">
            TEACHING<br />EXCELLENCE<br />AMPLIFIED
          </h1>
        </div>

        <p className="max-w-3xl mx-auto text-white/60 leading-relaxed text-base md:text-xl mb-12 font-medium">
          Your complete platform for <span className="text-white border-b-2 border-[var(--amethyst-focus)] pb-0.5">high-quality teaching materials</span>. Curated resources, collaborative tools, and a community dedicated to educational excellence.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {isAuthenticated ? (
            <button onClick={() => handleNavigation('/dashboard')} className="cta-button focus-border group text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)]">
              <span className="relative z-10">Go to Dashboard</span>
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          ) : (
            <button onClick={() => handleNavigation('/signup')} className="cta-button focus-border group text-sm shadow-[0_0_30px_rgba(124,58,237,0.5)]">
              <span className="relative z-10">Start Free Today</span>
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          )}
          <button className="px-8 py-4 font-bold uppercase transition-all text-xs tracking-widest text-white/40 hover:text-white border border-transparent hover:border-white/10 rounded-xl flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </span>
            Watch Walkthrough
          </button>
        </div>
      </section>

      {/* Stats / Why Choose Us - Dashboard Style Tiles */}
      <section id="why-us" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2.5 h-8 md:h-10 bg-[#7c3aed] rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
            Why Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {[
            {
              icon: (
                <svg className="w-5 h-5 md:w-8 md:h-8 text-[var(--amethyst-focus)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              label: 'Curated Quality',
              value: '100%',
              desc: 'Peer-reviewed content',
              color: 'border-l-[var(--amethyst-focus)]'
            },
            {
              icon: (
                <svg className="w-5 h-5 md:w-8 md:h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              label: 'Global Network',
              value: '120+',
              desc: 'Countries represented',
              color: 'border-l-blue-500'
            },
            {
              icon: (
                <svg className="w-5 h-5 md:w-8 md:h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              label: 'Resources',
              value: '50k+',
              desc: 'Ready-to-use modules',
              color: 'border-l-orange-500'
            },
            {
              icon: (
                <svg className="w-5 h-5 md:w-8 md:h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              label: 'Satisfaction',
              value: '4.9/5',
              desc: 'Average user rating',
              color: 'border-l-emerald-500'
            }
          ].map((stat, i) => (
            <div key={i} className={`tile p-4 md:p-8 group hover:-translate-y-1 transition-all duration-300 border-l-4 ${stat.color} flex flex-col justify-between min-h-[140px] md:min-h-0`}>
              <div className="flex justify-between items-start mb-2 md:mb-6">
                <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                  {stat.icon}
                </div>
              </div>
              <div className="space-y-1 md:space-y-2">
                <div className="text-3xl md:text-4xl font-black text-white leading-none">{stat.value}</div>
                <div className="text-xs md:text-sm font-bold text-white uppercase tracking-tight">{stat.label}</div>
                <div className="text-[0.65rem] md:text-xs text-white/40 font-mono uppercase leading-relaxed pt-1">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section - Dashboard Layout Style */}
      <section id="about" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2.5 h-8 md:h-10 bg-[#7c3aed] rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
            Our Mission
          </h2>
        </div>

        <div className="grid grid-cols-2 md:flex md:flex-row gap-4 md:gap-12 items-center mb-16">
          <div className="md:flex-1">
            <h3 className="text-lg sm:text-2xl md:text-5xl font-black tracking-tight leading-tight uppercase">Transforming Education,<br />One Resource at a Time</h3>
          </div>
          <div className="md:flex-1">
            <p className="text-white/60 text-xs md:text-lg leading-relaxed border-l-2 border-white/10 pl-3 md:pl-6">
              We believe every teacher deserves access to exceptional teaching materials. Our platform bridges the gap between educators, providing quality content that enhances learning outcomes globally.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <div className="tile p-4 md:p-10 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <svg className="w-16 h-16 md:w-32 md:h-32 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3 md:mb-6 border border-emerald-500/20">
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-4 uppercase tracking-tighter">Our Goal</h3>
              <p className="text-white/50 leading-relaxed text-xs md:text-sm">To create the world's most comprehensive library of peer-reviewed teaching resources.</p>
            </div>
          </div>

          <div className="tile p-4 md:p-10 group relative overflow-hidden bg-gradient-to-br from-white/[0.02] to-transparent">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <svg className="w-16 h-16 md:w-32 md:h-32 text-amber-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6h-2zm0 8h2v2h-2z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-3 md:mb-6 border border-amber-500/20">
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-4 uppercase tracking-tighter">Our Vision</h3>
              <p className="text-white/50 leading-relaxed text-xs md:text-sm">A global community where teachers collaborate and share knowledge instantly.</p>
            </div>
          </div>

          <div className="tile p-4 md:p-10 group relative overflow-hidden col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
              <svg className="w-16 h-16 md:w-32 md:h-32 text-purple-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
            </div>
            <div className="relative z-10">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3 md:mb-6 border border-purple-500/20">
                <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              </div>
              <h3 className="text-lg md:text-2xl font-black mb-2 md:mb-4 uppercase tracking-tighter">Our Values</h3>
              <p className="text-white/50 leading-relaxed text-xs md:text-sm">Quality, collaboration, accessibility, and innovation drive everything we do.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Become Mentor CTA */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2.5 h-8 md:h-10 bg-[#7c3aed] rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
            Career Growth
          </h2>
        </div>

        <div className="tile p-8 md:p-12 relative overflow-hidden group bg-[#0f172a] [html[data-theme='light']_&]:bg-white">
          <div className="absolute right-0 bottom-0 p-10 opacity-5 md:opacity-10 transform translate-x-1/4 translate-y-1/4">
            <svg className="w-96 h-96 text-[var(--amethyst-focus)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-6 max-w-2xl">
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                Become a <br /><span className="text-white">Certified Mentor</span>
              </h3>
              <p className="text-white/60 leading-relaxed text-lg">
                Share your expertise with our community and earn the "Master Educator" badge. Gain access to exclusive global forums and high-tier resources.
              </p>
            </div>
            <div className="flex-shrink-0">
              <button className="cta-button py-5 px-10 text-sm font-black tracking-widest uppercase shadow-2xl">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section - Dashboard Form Style */}
      <section id="contact" className="scroll-mt-32">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2.5 h-8 md:h-10 bg-[#7c3aed] rounded-full"></div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
            Contact Support
          </h2>
        </div>

        <div className="p-6 md:p-12 border border-white/5 bg-[#0f172a] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 shadow-xl rounded-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div>
                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight [html[data-theme='light']_&]:text-slate-900">We're Here<br />To Help</h3>
              </div>
              <p className="text-white/60 [html[data-theme='light']_&]:text-slate-600 leading-relaxed">
                Have questions about our platform, pricing, or want to contribute? Our team is ready to answer all your questions.
              </p>

              <div className="space-y-6 pt-6">
                {/* Email Us - Interactive Link */}
                <a
                  href="mailto:tanvirsunny565@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-white/50 group-hover:text-[var(--amethyst-focus)] group-hover:bg-[var(--amethyst-focus)]/10 transition-colors border border-white/5 [html[data-theme='light']_&]:bg-slate-100 [html[data-theme='light']_&]:text-slate-500 [html[data-theme='light']_&]:border-slate-200">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <div className="text-[0.625rem] font-bold uppercase text-white/30 mb-1 [html[data-theme='light']_&]:text-slate-400">Email Us</div>
                    <div className="text-sm md:text-lg font-bold text-white group-hover:text-[var(--amethyst-focus)] transition-colors [html[data-theme='light']_&]:text-slate-800">tanvirsunny565@gmail.com</div>
                  </div>
                </a>

                {/* Visit Us - Static */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-white/50 border border-white/5 [html[data-theme='light']_&]:bg-slate-100 [html[data-theme='light']_&]:text-slate-500 [html[data-theme='light']_&]:border-slate-200">
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  <div>
                    <div className="text-[0.625rem] font-bold uppercase text-white/30 mb-1 [html[data-theme='light']_&]:text-slate-400">Visit Us</div>
                    <div className="text-sm md:text-lg font-bold text-white [html[data-theme='light']_&]:text-slate-800">University of Frontier Technology, Bangladesh</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-10 border border-white/5 border-t-4 border-t-[var(--amethyst-focus)] bg-[var(--bg-dark)]/50 [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:border-t-[var(--amethyst-focus)] rounded-3xl">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="mono text-[0.625rem] uppercase text-white/40 block ml-1 font-bold [html[data-theme='light']_&]:text-slate-500">First Name</label>
                    <input type="text" className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900" placeholder="Jane" />
                  </div>
                  <div className="space-y-2">
                    <label className="mono text-[0.625rem] uppercase text-white/40 block ml-1 font-bold [html[data-theme='light']_&]:text-slate-500">Last Name</label>
                    <input type="text" className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="mono text-[0.625rem] uppercase text-white/40 block ml-1 font-bold [html[data-theme='light']_&]:text-slate-500">Email</label>
                  <input type="email" className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900" placeholder="jane@example.com" />
                </div>
                <div className="space-y-2">
                  <label className="mono text-[0.625rem] uppercase text-white/40 block ml-1 font-bold [html[data-theme='light']_&]:text-slate-500">Message</label>
                  <textarea className="contact-input bg-black/20 border-white/10 focus:border-[var(--amethyst-focus)] min-h-[150px] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:text-slate-900" placeholder="How can we help you?"></textarea>
                </div>
                <button className="cta-button w-full focus-border shadow-lg">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
