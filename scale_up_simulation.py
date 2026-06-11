import re

file_path = 'frontend/components/Simulations/FractionSimulation.tsx'

with open(file_path, 'r') as f:
    content = f.read()

# 1. Update general container widths
content = content.replace('max-w-[1000px]', 'max-w-6xl')

# 2. Update Fraction A & B cards
content = content.replace('min-h-[160px]', 'min-h-[220px]')
content = content.replace('p-4 rounded-[1.5rem]', 'p-6 rounded-[2rem]')

# 3. Update A & B labels
content = content.replace('text-5xl font-black text-amber-400', 'text-6xl font-black text-amber-400')
content = content.replace('text-5xl font-black text-sky-400', 'text-6xl font-black text-sky-400')
content = content.replace('ml-4', 'ml-6')

# 4. Shape containers inside A/B
content = content.replace('h-[120px] max-w-[120px]', 'h-[150px] max-w-[150px]')
content = content.replace('h-[120px]', 'h-[150px]')

# 5. Inputs inside A/B
content = content.replace('w-10 h-8', 'w-12 h-10')
content = content.replace('text-lg', 'text-xl')

# 6. Operator 
content = content.replace('w-8 h-8 rounded-full', 'w-10 h-10 rounded-full')
content = content.replace('svg className="w-4 h-4', 'svg className="w-5 h-5')

# 7. renderActiveShape defaults
content = content.replace("renderBar(fraction, color, sizeOverride || 150", "renderBar(fraction, color, sizeOverride || 200")
content = content.replace("renderPolygon(fraction, color, sizeOverride || 120", "renderPolygon(fraction, color, sizeOverride || 160")
content = content.replace("renderCircle(fraction, color, sizeOverride || 110", "renderCircle(fraction, color, sizeOverride || 150")

# 8. Result Card
content = content.replace('max-w-lg transition-all h-[180px]', 'max-w-xl transition-all h-[240px]')
content = content.replace('p-5 rounded-[2rem]', 'p-7 rounded-[2rem]')

# 8b. Target Pos
content = content.replace('x: (containerRef.current?.offsetWidth || 0) / 2 - 80,', 'x: (containerRef.current?.offsetWidth || 0) / 2 - 100,')

# 9. Result Shapes
content = content.replace("{renderActiveShape({ num: 0, den: commonDen }, 'rgba(255,255,255,0.03)', 140)}", "{renderActiveShape({ num: 0, den: commonDen }, 'rgba(255,255,255,0.03)', 180)}")
content = content.replace("{renderActiveShape({ num: animatedResultNum, den: commonDen }, '#ec4899', 140)}", "{renderActiveShape({ num: animatedResultNum, den: commonDen }, '#ec4899', 180)}")

# 10. Result Numbers
content = content.replace('text-4xl font-black hero-text-gradient', 'text-6xl font-black hero-text-gradient')
content = content.replace('text-[0.45rem] uppercase font-bold text-white/30 tracking-[0.2em]', 'text-[0.6rem] uppercase font-black text-white/30 tracking-[0.3em]')
content = content.replace('w-12 h-1 bg-white/20', 'w-14 h-1 bg-white/20')

# 11. Floating Animation shapes
content = content.replace("{renderActiveShape(f1, '#fbbf24', 110, 0.6)}", "{renderActiveShape(f1, '#fbbf24', 150, 0.6)}")
content = content.replace("{renderActiveShape(f2, '#38bdf8', 110, 0.6)}", "{renderActiveShape(f2, '#38bdf8', 150, 0.6)}")

# 12. Mathematical Breakdown block
content = content.replace('max-w-4xl pt-8', 'max-w-5xl pt-12')
content = content.replace('p-8 rounded-[2rem]', 'p-10 rounded-[2.5rem]')

# 13. Buttons
content = content.replace('px-8 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-[0.6rem]', 'px-10 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-[0.7rem]')

with open(file_path, 'w') as f:
    f.write(content)

print("Scaling complete.")
