import React, { useState, useRef } from 'react';

interface Fraction {
    num: number;
    den: number;
}

type ShapeType = 'circle' | 'bar' | 'polygon';

const FractionSimulation: React.FC = () => {
    const [f1, setF1] = useState<Fraction>({ num: 1, den: 2 });
    const [f2, setF2] = useState<Fraction>({ num: 1, den: 3 });
    const [shapeType, setShapeType] = useState<ShapeType>('circle');
    const [operator, setOperator] = useState<'+' | '-' | '*' | '/'>('+');
    const [showResult, setShowResult] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const mainAreaRef = useRef<HTMLDivElement>(null);
    const shapeARef = useRef<HTMLDivElement>(null);
    const shapeBRef = useRef<HTMLDivElement>(null);
    const solutionRef = useRef<HTMLDivElement>(null);

    const [isAnimating, setIsAnimating] = useState(false);
    const [animState, setAnimState] = useState<{
        startPosA: { x: number; y: number } | null;
        startPosB: { x: number; y: number } | null;
        endPos: { x: number; y: number } | null;
    }>({ startPosA: null, startPosB: null, endPos: null });

    const [animatedResultNum, setAnimatedResultNum] = useState(0);

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

    let commonDen = 1;
    let resultNum = 0;
    let f1Conv = { num: 0, den: 1 };
    let f2Conv = { num: 0, den: 1 };
    let displayLCD = 1;

    if (operator === '+') {
        commonDen = lcm(f1.den, f2.den);
        displayLCD = commonDen;
        f1Conv = { num: f1.num * (commonDen / f1.den), den: commonDen };
        f2Conv = { num: f2.num * (commonDen / f2.den), den: commonDen };
        resultNum = f1Conv.num + f2Conv.num;
    } else if (operator === '-') {
        commonDen = lcm(f1.den, f2.den);
        displayLCD = commonDen;
        f1Conv = { num: f1.num * (commonDen / f1.den), den: commonDen };
        f2Conv = { num: f2.num * (commonDen / f2.den), den: commonDen };
        resultNum = Math.max(0, f1Conv.num - f2Conv.num);
        f1Conv = { num: resultNum, den: commonDen }; // All red
    } else if (operator === '*') {
        commonDen = f1.den * f2.den;
        resultNum = f1.num * f2.num;
        f1Conv = { num: resultNum, den: commonDen }; // All red
    } else if (operator === '/') {
        commonDen = f1.den * Math.max(1, f2.num);
        resultNum = f1.num * f2.den;
        f1Conv = { num: resultNum, den: commonDen }; // All red
    }

    const finalGcd = commonDen > 0 ? gcd(resultNum, commonDen) : 1;
    const simplifiedResult = { num: resultNum / finalGcd, den: commonDen > 0 ? commonDen / finalGcd : 1 };

    // Calculates how many "whole" shapes we need to fit the result
    const totalSolutionShapes = Math.max(1, Math.ceil(resultNum / commonDen));

    const renderCircle = (fraction: Fraction, color: string | ((idx: number) => string), size: number = 180, opacity: number = 1, startIndex: number = 0) => {
        const radius = size / 2;
        const totalSlices = fraction.den;
        const filledSlices = fraction.num;
        const paths = [];

        for (let i = 0; i < totalSlices; i++) {
            const startAngle = (i * 360) / totalSlices;
            const endAngle = ((i + 1) * 360) / totalSlices;
            const x1 = radius + radius * Math.cos((Math.PI * (startAngle - 90)) / 180);
            const y1 = radius + radius * Math.sin((Math.PI * (startAngle - 90)) / 180);
            const x2 = radius + radius * Math.cos((Math.PI * (endAngle - 90)) / 180);
            const y2 = radius + radius * Math.sin((Math.PI * (endAngle - 90)) / 180);
            const largeArcFlag = 0;

            const d = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            paths.push(
                <path
                    key={i}
                    d={d}
                    fill={i < filledSlices ? (typeof color === 'function' ? color(startIndex + i) : color) : 'rgba(255,255,255,0.05)'}
                    stroke={i < filledSlices ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'}
                    strokeWidth="1.5"
                    style={{ fillOpacity: opacity }}
                    className="transition-all duration-500"
                />
            );
        }

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {paths}
            </svg>
        );
    };

    const renderBar = (fraction: Fraction, color: string | ((idx: number) => string), width: number = 240, height: number = 50, opacity: number = 1, startIndex: number = 0) => {
        const totalParts = fraction.den;
        const filledParts = fraction.num;
        const partWidth = width / totalParts;
        const rects = [];

        for (let i = 0; i < totalParts; i++) {
            rects.push(
                <rect
                    key={i}
                    x={i * partWidth}
                    y={0}
                    width={partWidth}
                    height={height}
                    fill={i < filledParts ? (typeof color === 'function' ? color(startIndex + i) : color) : 'rgba(255,255,255,0.05)'}
                    stroke={i < filledParts ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'}
                    strokeWidth="1.5"
                    style={{ fillOpacity: opacity }}
                    className="transition-all duration-500"
                />
            );
        }

        return (
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {rects}
            </svg>
        );
    };

    const renderPolygon = (fraction: Fraction, color: string | ((idx: number) => string), size: number = 160, opacity: number = 1, startIndex: number = 0) => {
        const totalParts = fraction.den;
        const filledParts = fraction.num;
        const partHeight = size / totalParts;
        const rects = [];

        for (let i = 0; i < totalParts; i++) {
            rects.push(
                <rect
                    key={i}
                    x={0}
                    y={i * partHeight}
                    width={size}
                    height={partHeight}
                    fill={i < filledParts ? (typeof color === 'function' ? color(startIndex + i) : color) : 'rgba(255,255,255,0.05)'}
                    stroke={i < filledParts ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)'}
                    strokeWidth="1.5"
                    style={{ fillOpacity: opacity }}
                    className="transition-all duration-500"
                />
            );
        }

        return (
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {rects}
            </svg>
        );
    };

    const renderActiveShape = (fraction: Fraction, color: string | ((idx: number) => string), sizeOverride?: number, opacity: number = 1, startIndex: number = 0) => {
        switch (shapeType) {
            case 'bar': return renderBar(fraction, color, sizeOverride || 200, 32, opacity, startIndex);
            case 'polygon': return renderPolygon(fraction, color, sizeOverride || 160, opacity, startIndex);
            default: return renderCircle(fraction, color, sizeOverride || 150, opacity, startIndex);
        }
    };

    const ShapeOption: React.FC<{ type: ShapeType; label: string }> = ({ type, label }) => (
        <button
            onClick={() => {
                setShapeType(type);
                setShowResult(false);
            }}
            className={`px-5 py-2 rounded-xl text-[0.6rem] font-black uppercase tracking-widest transition-all ${shapeType === type
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 hover:scale-102'
                }`}
        >
            {label}
        </button>
    );

    const handleShowSolution = async () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setShowResult(false);
        setAnimatedResultNum(0);

        // Function to get positions
        const getCenter = (ref: React.RefObject<HTMLDivElement>, useWindowCenter = false) => {
            if (useWindowCenter) {
                // If we want a fixed target position, we can calculate it relative to mainAreaRef
                // Because mainAreaRef is centered, the center X is its width / 2.
                // But the solution box 'shape' area is offset to the left inside the max-w-xl box.
                const mainAreaRect = mainAreaRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
                // The max-w-xl is 576px max. The shape is in the left half, so center of shape is offset left by 1/4 of the max width.
                const solutionWidth = Math.min(mainAreaRect.width, 576);
                const targetX = (mainAreaRect.width / 2) - Math.floor(solutionWidth / 4);
                // Approximate Y target position based on where the solution box will render
                const targetY = mainAreaRect.height + 60; // Just below the operator card (+ spacing)
                return { x: targetX, y: targetY };
            }
            if (!ref.current) return { x: 0, y: 0 };
            const rect = ref.current.getBoundingClientRect();
            // Important: we calculate relative to mainAreaRef because the floating div is absolute INSIDE mainAreaRef
            const parentRect = mainAreaRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
            return {
                x: rect.left - parentRect.left + rect.width / 2,
                y: rect.top - parentRect.top + rect.height / 2
            };
        };

        const targetPos = getCenter(solutionRef, true);

        const posA = getCenter(shapeARef);
        const posB = getCenter(shapeBRef);

        setAnimState({
            startPosA: posA,
            startPosB: posB,
            endPos: targetPos
        });

        // Wait for floating animation to finish
        await new Promise(r => setTimeout(r, 1200));

        setAnimState({ startPosA: null, startPosB: null, endPos: null });
        setIsAnimating(false);
        setShowResult(true);

        // Piece-by-piece reveal with speed ramping
        const startDelay = 80;
        const minDelay = 10;

        for (let i = 1; i <= resultNum; i++) {
            // Gradually decrease delay as i increases
            const currentDelay = Math.max(minDelay, startDelay - (i * 10));
            await new Promise(r => setTimeout(r, currentDelay));
            setAnimatedResultNum(i);
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full overflow-y-auto px-4 pb-4 custom-scrollbar">
            <div className="flex flex-col items-center justify-start min-h-full py-0 w-full relative max-w-6xl mx-auto">

                {/* Top Navbar - Horizontal Shape Selection */}
                <div className="flex flex-row items-center justify-center gap-4 p-1.5 rounded-[2rem] bg-black/40 border border-white/5 backdrop-blur-md mb-6 shadow-2xl z-50">
                    <div className="text-[0.55rem] font-black uppercase tracking-[0.2em] text-white/20 px-3 border-r border-white/5">Shapes</div>
                    <div className="flex gap-2 px-2">
                        <ShapeOption type="bar" label="Bar Shape" />
                        <ShapeOption type="circle" label="Circle Shape" />
                    </div>
                </div>

                {/* Main Content Area */}
                <div ref={mainAreaRef} className="w-full flex flex-col items-center space-y-6 relative">

                    {/* Top Row: Fraction A, Op, Fraction B */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-4 w-full relative z-10">

                        {/* Fraction A Card */}
                        <div className="flex-1 flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl w-full min-h-[220px]">
                            {/* Left: Label */}
                            <div className="flex-shrink-0 ml-6">
                                <span className="text-6xl font-black text-red-500 opacity-20 select-none">A</span>
                            </div>

                            {/* Middle: Shape */}
                            <div ref={shapeARef} className="relative flex-1 h-[150px] flex items-center justify-center">
                                <div className="opacity-100 transition-opacity duration-500">
                                    {renderActiveShape({ num: 0, den: f1.den }, 'rgba(255,255,255,0.05)')}
                                </div>
                                <div className="absolute transition-opacity duration-300 opacity-100">
                                    {renderActiveShape(f1, '#ef4444')}
                                </div>
                            </div>

                            {/* Right: Inputs */}
                            <div className="flex flex-col items-start ml-4 mr-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={f1.num}
                                        onChange={(e) => { setF1({ ...f1, num: Math.min(f1.den, Math.max(0, parseInt(e.target.value) || 0)) }); setShowResult(false); }}
                                        className="w-20 h-16 bg-black/40 rounded-xl text-center font-black text-4xl border border-white/10 focus:border-red-500 outline-none transition-all no-spinners"
                                    />
                                    <div className="flex flex-col h-16 justify-between w-10">
                                        <button onClick={() => { setF1({ ...f1, num: Math.min(f1.den, f1.num + 1) }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-red-400 hover:border-red-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={() => { setF1({ ...f1, num: Math.max(0, f1.num - 1) }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-red-400 hover:border-red-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex w-20 justify-center">
                                    <div className="w-16 h-1 bg-white/10 my-2 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={f1.den}
                                        onChange={(e) => { setF1({ ...f1, den: Math.max(1, parseInt(e.target.value) || 1) }); setShowResult(false); }}
                                        className="w-20 h-16 bg-black/40 rounded-xl text-center font-black text-4xl border border-white/10 focus:border-red-500 outline-none transition-all no-spinners"
                                    />
                                    <div className="flex flex-col h-16 justify-between w-10">
                                        <button onClick={() => { setF1({ ...f1, den: f1.den + 1 }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-red-400 hover:border-red-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={() => { setF1({ ...f1, num: Math.min(f1.num, Math.max(1, f1.den - 1)), den: Math.max(1, f1.den - 1) }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-red-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-red-400 hover:border-red-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Operator Spacer */}
                        <div className="flex flex-col items-center justify-center py-2 relative z-[60]">
                            <div
                                onClick={() => {
                                    const ops: Array<'+' | '-' | '*' | '/'> = ['+', '-', '*', '/'];
                                    setOperator(ops[(ops.indexOf(operator) + 1) % ops.length]);
                                    setShowResult(false);
                                }}
                                className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 relative z-20 cursor-pointer hover:scale-110 active:scale-95 hover:shadow-orange-500/50 transition-all border-2 border-orange-300"
                            >
                                <span className="text-4xl font-black text-white leading-none pb-1">
                                    {operator === '*' ? '×' : operator === '/' ? '÷' : operator}
                                </span>
                            </div>
                        </div>

                        {/* Fraction B Card */}
                        <div className="flex-1 flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl w-full min-h-[220px]">
                            {/* Left: Label */}
                            <div className="flex-shrink-0 ml-6">
                                <span className="text-6xl font-black text-blue-500 opacity-20 select-none">B</span>
                            </div>

                            {/* Middle: Shape */}
                            <div ref={shapeBRef} className="relative flex-1 h-[150px] flex items-center justify-center">
                                <div className="opacity-100 transition-opacity duration-500">
                                    {renderActiveShape({ num: 0, den: f2.den }, 'rgba(255,255,255,0.05)')}
                                </div>
                                <div className="absolute transition-opacity duration-300 opacity-100">
                                    {renderActiveShape(f2, '#3b82f6')}
                                </div>
                            </div>

                            {/* Right: Inputs */}
                            <div className="flex flex-col items-start ml-4 mr-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={f2.num}
                                        onChange={(e) => { setF2({ ...f2, num: Math.min(f2.den, Math.max(0, parseInt(e.target.value) || 0)) }); setShowResult(false); }}
                                        className="w-20 h-16 bg-black/40 rounded-xl text-center font-black text-4xl border border-white/10 focus:border-blue-500 outline-none transition-all no-spinners"
                                    />
                                    <div className="flex flex-col h-16 justify-between w-10">
                                        <button onClick={() => { setF2({ ...f2, num: Math.min(f2.den, f2.num + 1) }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-blue-400 hover:border-blue-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={() => { setF2({ ...f2, num: Math.max(0, f2.num - 1) }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-blue-400 hover:border-blue-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex w-20 justify-center">
                                    <div className="w-16 h-1 bg-white/10 my-2 rounded-full"></div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={f2.den}
                                        onChange={(e) => { setF2({ ...f2, den: Math.max(1, parseInt(e.target.value) || 1) }); setShowResult(false); }}
                                        className="w-20 h-16 bg-black/40 rounded-xl text-center font-black text-4xl border border-white/10 focus:border-blue-500 outline-none transition-all no-spinners"
                                    />
                                    <div className="flex flex-col h-16 justify-between w-10">
                                        <button onClick={() => { setF2({ ...f2, den: f2.den + 1 }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-blue-400 hover:border-blue-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                                        </button>
                                        <button onClick={() => { setF2({ ...f2, num: Math.min(f2.num, Math.max(1, f2.den - 1)), den: Math.max(1, f2.den - 1) }); setShowResult(false); }} className="h-[calc(50%-3px)] bg-white/5 hover:bg-blue-500/20 border border-white/10 rounded-lg flex items-center justify-center text-white/70 hover:text-blue-400 hover:border-blue-500/50 transition-all opacity-40 hover:opacity-100">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Solve Button & Result Area */}
                    <div className="flex flex-col items-center w-full space-y-4 pt-2 relative z-0">
                        {!showResult && !isAnimating && (
                            <button
                                onClick={handleShowSolution}
                                className="px-10 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-[0.7rem] font-black uppercase tracking-[0.2em] shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Visualize Solution
                            </button>
                        )}

                        {/* Result Section - Scaled Down */}
                        {showResult && (
                            <div className="w-full flex justify-center pt-1">
                                <div ref={solutionRef} className="relative p-7 rounded-[2rem] bg-indigo-500/5 border border-white/10 shadow-2xl flex items-center justify-between transition-all min-h-[240px] solution-container-animate w-fit min-w-[36rem] max-w-full mx-auto">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-[60]">
                                        <div className="bg-emerald-500/90 backdrop-blur-md px-4 py-1 rounded-full text-[0.5rem] font-black border border-emerald-500/30 uppercase tracking-[0.2em] text-white whitespace-nowrap shadow-md">
                                            Solution Diagram
                                        </div>
                                    </div>

                                    <div className={`relative flex items-center justify-center gap-4 p-2 h-full flex-1 pr-6 ${shapeType === 'circle' ? 'flex-row flex-nowrap' : 'flex-wrap'}`}>
                                        {showResult && (
                                            <div className="absolute inset-0 bg-pink-500/5 rounded-full blur-[30px] animate-pulse"></div>
                                        )}

                                        {Array.from({ length: totalSolutionShapes }).map((_, index) => {
                                            const startIndex = index * commonDen;
                                            // Calculate how many parts go into THIS specific shape
                                            const partsInThisShape = Math.max(0, Math.min(commonDen, animatedResultNum - startIndex));
                                            // Scale down the shapes if we need to show multiple so they fit nicely
                                            const targetShapeSize = totalSolutionShapes > 1 ? 130 : 180;

                                            // Determine piece color based on origin (A or B)
                                            const getPieceColor = (globalIdx: number) => {
                                                if (operator !== '+') return '#4ade80';
                                                return globalIdx < f1Conv.num ? '#ef4444' : '#3b82f6';
                                            };

                                            return (
                                                <div key={index} className="relative flex items-center justify-center">
                                                    <div className="absolute">
                                                        {renderActiveShape({ num: 0, den: commonDen }, 'rgba(255,255,255,0.03)', targetShapeSize)}
                                                    </div>
                                                    <div className="relative z-10 shape-merge-animate">
                                                        {renderActiveShape({ num: partsInThisShape, den: commonDen }, getPieceColor, targetShapeSize, 1, startIndex)}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex-shrink-0 flex items-center justify-center border-l border-white/10 pl-8 pr-4 h-full numbers-animate gap-6 relative">
                                        {/* Standard Improper/Proper Fraction */}
                                        <div className="flex flex-col items-center">
                                            <span className="text-6xl font-black hero-text-gradient leading-tight">
                                                {animatedResultNum === resultNum ? resultNum : animatedResultNum}
                                            </span>
                                            <div className="w-14 h-1 bg-white/20 my-2 rounded-full"></div>
                                            <span className="text-6xl font-black hero-text-gradient leading-tight">
                                                {commonDen}
                                            </span>
                                        </div>

                                        {/* Mixed Fraction Representation */}
                                        {animatedResultNum === resultNum && resultNum > commonDen && (
                                            <>
                                                <span className="text-5xl font-black text-white/20">=</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-6xl font-black hero-text-gradient">
                                                        {Math.floor(resultNum / commonDen)}
                                                    </span>
                                                    {resultNum % commonDen > 0 && (
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-4xl font-black hero-text-gradient leading-tight">
                                                                {resultNum % commonDen}
                                                            </span>
                                                            <div className="w-8 h-1 bg-white/20 my-1 rounded-full"></div>
                                                            <span className="text-4xl font-black hero-text-gradient leading-tight">
                                                                {commonDen}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-full pt-4">
                                            <div className="text-[0.6rem] uppercase font-black text-white/30 tracking-[0.3em] whitespace-nowrap">
                                                Final Result
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Floating Animation Layer - Scaled Down */}
                    {animState.startPosA && animState.endPos && (
                        <div
                            className="absolute pointer-events-none z-[100]"
                            style={{
                                left: animState.startPosA.x,
                                top: animState.startPosA.y,
                                transform: 'translate(-50%, -50%)',
                                animation: 'floatAToSolution 1.2s forwards ease-in-out'
                            }}
                        >
                            {renderActiveShape(f1, '#ef4444', 150, 0.6)}
                        </div>
                    )}
                    {animState.startPosB && animState.endPos && (
                        <div
                            className="absolute pointer-events-none z-[100]"
                            style={{
                                left: animState.startPosB.x,
                                top: animState.startPosB.y,
                                transform: 'translate(-50%, -50%)',
                                animation: 'floatBToSolution 1.2s forwards ease-in-out'
                            }}
                        >
                            {renderActiveShape(f2, '#3b82f6', 150, 0.6)}
                        </div>
                    )}
                </div>

                {/* Sub-Scroll Section - Scaled Down */}
                {showResult && (
                    <div className="w-full max-w-5xl pt-12">
                        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <h3 className="text-xl font-black uppercase tracking-[0.3em] mb-10 text-center hero-text-gradient">Mathematical Breakdown</h3>

                            {(operator === '+' || operator === '-') ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start w-full">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto text-sm font-black border border-red-500/20">01</div>
                                        <p className="text-xs uppercase tracking-widest font-black text-white/40">Common Denominator</p>
                                        <p className="text-2xl font-bold text-white/80">LCD = <span className="text-pink-400">{displayLCD}</span></p>
                                    </div>

                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto text-sm font-black border border-blue-500/20">02</div>
                                        <p className="text-xs uppercase tracking-widest font-black text-white/40">{operator === '+' ? 'Convert & Add' : 'Convert & Subtract'}</p>
                                        <div className="flex flex-col gap-3">
                                            <div className="bg-white/5 py-3 px-5 rounded-xl text-[0.85rem] font-bold text-white/60">A: {f1.num}/{f1.den} → <span className="text-red-400 font-black text-lg">{f1.num * (displayLCD / f1.den)}</span></div>
                                            <div className="bg-white/5 py-3 px-5 rounded-xl text-[0.85rem] font-bold text-white/60">B: {f2.num}/{f2.den} → <span className="text-blue-400 font-black text-lg">{f2.num * (displayLCD / f2.den)}</span></div>
                                        </div>
                                    </div>

                                    <div className="text-center bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-inner">
                                        <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto text-sm font-black border border-pink-500/20 mb-5">03</div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-5xl font-black text-white">{simplifiedResult.num}</span>
                                            <div className="w-16 h-1.5 bg-white/20 my-2 rounded-full"></div>
                                            <span className="text-5xl font-black text-white">{simplifiedResult.den}</span>
                                        </div>
                                        {finalGcd > 1 && (
                                            <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/30 inline-block uppercase tracking-wider">
                                                Simplified by {finalGcd}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start w-full">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto text-sm font-black border border-red-500/20">01</div>
                                        <p className="text-xs uppercase tracking-widest font-black text-white/40">{operator === '*' ? 'Multiply Setup' : 'Invert & Multiply'}</p>
                                        <div className="flex flex-col items-center justify-center mt-2">
                                            <span className="text-lg font-bold text-white/80">{f1.num} / {f1.den}</span>
                                            <span className="text-amber-400 font-black text-xl my-1">{operator === '*' ? '×' : '×'}</span>
                                            <span className="text-lg font-bold text-white/80">{operator === '*' ? `${f2.num} / ${f2.den}` : `${f2.den} / ${f2.num}`}</span>
                                        </div>
                                    </div>

                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto text-sm font-black border border-blue-500/20">02</div>
                                        <p className="text-xs uppercase tracking-widest font-black text-white/40">Calculate Parts</p>
                                        <div className="flex flex-col gap-3">
                                            <div className="bg-white/5 py-3 px-5 rounded-xl text-[0.85rem] font-bold text-white/60">Top: <span className="text-red-400 font-black text-lg">{resultNum}</span></div>
                                            <div className="bg-white/5 py-3 px-5 rounded-xl text-[0.85rem] font-bold text-white/60">Bot: <span className="text-blue-400 font-black text-lg">{commonDen}</span></div>
                                        </div>
                                    </div>


                                    <div className="text-center bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-inner">
                                        <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-500 flex items-center justify-center mx-auto text-sm font-black border border-pink-500/20 mb-5">03</div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-5xl font-black text-white">{simplifiedResult.num}</span>
                                            <div className="w-16 h-1.5 bg-white/20 my-2 rounded-full"></div>
                                            <span className="text-5xl font-black text-white">{simplifiedResult.den}</span>
                                        </div>
                                        {finalGcd > 1 && (
                                            <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-white/30 inline-block uppercase tracking-wider">
                                                Simplified by {finalGcd}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                /* Hide natively generated spinners entirely and replace them with custom ones */
                input[type="number"].no-spinners::-webkit-outer-spin-button,
                input[type="number"].no-spinners::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                input[type="number"].no-spinners {
                    -moz-appearance: textfield;
                }

                .hero-text-gradient {
                    background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .solution-container-animate {
                    animation: solutionReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .numbers-animate {
                    animation: contentReveal 0.5s ease-out 0.2s both;
                }
                @keyframes solutionReveal {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes contentReveal {
                    0% { opacity: 0; transform: translateX(10px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes floatAToSolution {
                    0% {
                        opacity: 0.6;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(calc(${animState.endPos?.x || 0}px - ${animState.startPosA?.x || 0}px), calc(${animState.endPos?.y || 0}px - ${animState.startPosA?.y || 0}px)) scale(1.2);
                    }
                }
                @keyframes floatBToSolution {
                    0% {
                        opacity: 0.6;
                        transform: translate(-50%, -50%) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translate(calc(${animState.endPos?.x || 0}px - ${animState.startPosB?.x || 0}px), calc(${animState.endPos?.y || 0}px - ${animState.startPosB?.y || 0}px)) scale(1.2);
                    }
                }
            `}} />
        </div>
    );
};

export default FractionSimulation;