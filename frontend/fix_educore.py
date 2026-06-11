import re

educore_path = '/Users/nobita/works/capstone project/frontend/pages/EducoreContents.tsx'

with open(educore_path, 'r') as f:
    lines = f.readlines()

# find where "groupedUnits.length > 0" section ends.
# The indicator is:
#         )}
#       </div>
#       <style>{`

start_idx = -1
for i, line in enumerate(lines):
    if "No assets mapped to this coordinate" in line:
        start_idx = i
        break

end_style_idx = -1
for i in range(start_idx, len(lines)):
    if "<style>{`" in lines[i]:
        end_style_idx = i
        break

# Let's completely wipe from start_idx + 3 to end_style_idx

if start_idx != -1 and end_style_idx != -1:
    correct_content = "".join(lines[:start_idx + 3])
    # Now we insert the proper block.
    
    block_to_add = """      <div className="w-full mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-8 bg-[#7c3aed] rounded-full"></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
              Interactive Library
            </h2>
          </div>
        </div>

        {/* Storybook Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Storybook Card - Lily's Story */}
          <Link
            to="/lilys-story"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 rounded-3xl border border-white/5 bg-[#0f172a] shadow-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-md [html[data-theme='light']_&]:hover:border-violet-400"
          >
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center mb-5 shadow-lg relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-black/10"></div>
              <svg className="w-16 h-16 text-white relative z-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="absolute top-3 right-3 text-[0.6rem] font-black uppercase px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm tracking-wider">Interactive</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-violet-400 transition-colors [html[data-theme='light']_&]:text-slate-800 [html[data-theme='light']_&]:group-hover:text-violet-600">Lily's Story</h3>
                <svg className="w-4 h-4 text-white/30 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
              <p className="text-[0.7rem] text-white/40 leading-relaxed [html[data-theme='light']_&]:text-slate-500">An immersive interactive story about courage, intelligence, and thinking outside the box.</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 uppercase">Published</span>
              </div>
            </div>
          </Link>

          {/* Storybook Card - The Ant and the Grasshopper */}
          <Link
            to="/the-ant-and-the-grasshopper"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 rounded-3xl border border-white/5 bg-[#0f172a] shadow-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-md [html[data-theme='light']_&]:hover:border-violet-400"
          >
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center mb-5 shadow-lg relative overflow-hidden">
               <svg className="w-16 h-16 text-white relative z-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
               <span className="absolute top-3 right-3 text-[0.6rem] font-black uppercase px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm tracking-wider">Interactive</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-emerald-400 transition-colors [html[data-theme='light']_&]:text-slate-800 [html[data-theme='light']_&]:group-hover:text-emerald-600">The Ant & Grasshopper</h3>
                <svg className="w-4 h-4 text-white/30 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
              <p className="text-[0.7rem] text-white/40 leading-relaxed [html[data-theme='light']_&]:text-slate-500">A classic fable about the importance of hard work and planning for the future.</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 uppercase">New</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="w-full mt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-2.5 h-8 bg-orange-500 rounded-full"></div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white [html[data-theme='light']_&]:text-[#0F172A]">
              Interactive Simulations
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/simulation/fraction-addition"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 rounded-3xl border border-white/5 bg-[#0f172a] shadow-2xl hover:border-orange-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-md [html[data-theme='light']_&]:hover:border-orange-400"
          >
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mb-5 shadow-lg relative overflow-hidden">
               <svg className="w-16 h-16 text-white relative z-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
               <span className="absolute top-3 right-3 text-[0.6rem] font-black uppercase px-2 py-1 rounded-full bg-orange-500 text-white shadow-lg tracking-wider">Math Lab</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-orange-400 transition-colors [html[data-theme='light']_&]:text-slate-800 [html[data-theme='light']_&]:group-hover:text-orange-600">Fraction Addition Lab</h3>
                <svg className="w-4 h-4 text-white/30 group-hover:text-orange-400 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
              <p className="text-[0.7rem] text-white/40 leading-relaxed [html[data-theme='light']_&]:text-slate-500">Visualize and solve fraction addition problems with interactive visual models.</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 uppercase">Beta</span>
              </div>
            </div>
          </Link>

          <Link
            to="/fraction-story"
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-6 rounded-3xl border border-white/5 bg-[#0f172a] shadow-2xl hover:border-yellow-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-md [html[data-theme='light']_&]:hover:border-yellow-400"
          >
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 flex items-center justify-center mb-5 shadow-lg relative overflow-hidden">
               <div className="text-6xl relative z-10 drop-shadow-lg">🍕</div>
               <span className="absolute top-3 right-3 text-[0.6rem] font-black uppercase px-2 py-1 rounded-full bg-yellow-500 text-white shadow-lg tracking-wider">Animated Story</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-yellow-400 transition-colors [html[data-theme='light']_&]:text-slate-800 [html[data-theme='light']_&]:group-hover:text-yellow-600">Fraction Story</h3>
                <svg className="w-4 h-4 text-white/30 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
              <p className="text-[0.7rem] text-white/40 leading-relaxed [html[data-theme='light']_&]:text-slate-500">An interactive, guided story introducing fractions with real-world examples.</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 uppercase">New</span>
              </div>
            </div>
          </Link>

          <Link
            to="/teaching-aid-animation"
            className="group block p-6 rounded-3xl border border-white/5 bg-[#0f172a] shadow-2xl hover:border-violet-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-slate-200 [html[data-theme='light']_&]:shadow-md [html[data-theme='light']_&]:hover:border-violet-400"
          >
            <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-violet-400 via-purple-500 to-fuchsia-500 flex items-center justify-center mb-5 shadow-lg relative overflow-hidden">
                <svg className="w-16 h-16 text-white relative z-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute top-3 right-3 text-[0.6rem] font-black uppercase px-2 py-1 rounded-full bg-violet-500 text-white shadow-lg tracking-wider">Strategy Demo</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-violet-400 transition-colors [html[data-theme='light']_&]:text-slate-800 [html[data-theme='light']_&]:group-hover:text-violet-600">Teaching Aid Animation</h3>
                <svg className="w-4 h-4 text-white/30 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </div>
              <p className="text-[0.7rem] text-white/40 leading-relaxed [html[data-theme='light']_&]:text-slate-500">Interactive animation demonstrating how to use cutouts to teach concepts.</p>
              <div className="flex items-center gap-3 pt-2 border-t border-white/5 [html[data-theme='light']_&]:border-slate-100">
                <span className="text-[0.6rem] font-black px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 uppercase">New</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
"""
    correct_content += block_to_add
    
    # We still need one more closing div for the main wrapper before styles
    correct_content += "\n      </div>\n"
    
    correct_content += "".join(lines[end_style_idx:])
    
    with open(educore_path, 'w') as f:
        f.write(correct_content)
    print("Fixed!")
else:
    print(f"Indices: {start_idx}, {end_style_idx}")
