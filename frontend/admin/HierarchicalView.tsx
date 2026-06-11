import React, { useState, useMemo } from 'react';
import { ManagedItem, AdminTab } from './types';

interface HierarchicalViewProps {
    items: ManagedItem[];
    allItems?: ManagedItem[];
    activeTab: AdminTab;
    onAction: (type: string, tab: AdminTab, item?: ManagedItem, defaults?: Partial<ManagedItem>) => void;
}

const HierarchicalView: React.FC<HierarchicalViewProps> = ({ items, allItems = [], activeTab, onAction }) => {
    const [selectedGrade, setSelectedGrade] = useState<string>('g3');
    const [selectedSubject, setSelectedSubject] = useState<string>('math');
    const [selectedUnit, setSelectedUnit] = useState<string>('All Units');
    const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
    const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

    // Filter items based on Grade and Subject
    const filteredItems = useMemo(() => {
        let filtered = items.filter(item => item.grade === selectedGrade && item.subject === selectedSubject);
        if (activeTab === 'strategies' && selectedUnit !== 'All Units') {
            filtered = filtered.filter(item => item.unit === selectedUnit);
        }
        return filtered;
    }, [items, selectedGrade, selectedSubject, selectedUnit, activeTab]);

    // Extract unique Units
    const units = useMemo(() => {
        const uniqueUnits = Array.from(new Set(filteredItems.map(item => item.unit || 'Unassigned Unit')));
        return uniqueUnits.sort();
    }, [filteredItems]);

    // Extract Lessons for the expanded Unit
    const getLessonsForUnit = (unit: string) => {
        return Array.from(new Set(filteredItems.filter(item => item.unit === unit).map(item => item.lesson || 'Unassigned Lesson'))).sort();
    };

    // Get Tools for a specific Unit and Lesson
    const getToolsForLesson = (unit: string, lesson: string) => {
        return filteredItems.filter(item => item.unit === unit && item.lesson === lesson && item.type !== 'structure');
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* 1. Filter Section */}
            <div className="tile p-6 bg-slate-900/40 border-white/5">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="space-y-2 flex-1">
                        <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Select Phase (Grade)</label>
                        <div className="flex flex-wrap gap-2">
                            {['g1', 'g2', 'g3', 'g4', 'g5'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => { setSelectedGrade(g); setSelectedUnit('All Units'); }}
                                    className={`px-4 py-2 rounded-lg text-[0.65rem] font-black uppercase tracking-widest transition-all ${selectedGrade === g
                                        ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    Phase {g.replace('g', '')}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2 flex-1">
                        <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Select Cluster (Subject)</label>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { id: 'bangla', label: 'Bangla' },
                                { id: 'english', label: 'English' },
                                { id: 'math', label: 'Math' },
                                { id: 'science', label: 'Science' },
                                { id: 'bgs', label: 'Global' }
                            ].map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => { setSelectedSubject(s.id); setSelectedUnit('All Units'); }}
                                    className={`px-4 py-2 rounded-lg text-[0.65rem] font-black uppercase tracking-widest transition-all ${selectedSubject === s.id
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {activeTab === 'strategies' && (
                        <div className="space-y-2 w-full md:w-64">
                            <label className="mono text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Filter by Unit</label>
                            <select
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-[0.65rem] font-black uppercase tracking-widest text-white/60 focus:outline-none focus:border-cyan-500 transition-colors"
                            >
                                <option value="All Units" className="bg-slate-900 text-white">All Units</option>
                                {Array.from(new Set([...items, ...allItems].filter(item => item.grade === selectedGrade && item.subject === selectedSubject && item.unit).map(item => item.unit))).sort().map(unit => (
                                    <option key={unit} value={unit} className="bg-slate-900 text-white">{unit}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. Units List */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-sm font-black uppercase text-white/60 tracking-tight">{activeTab === 'strategies' ? 'Teaching Strategies' : 'Active Units'}</h3>
                    <div className="flex items-center gap-3">
                        {activeTab === 'strategies' && (
                            <button
                                onClick={() => onAction('add-unit', activeTab, undefined, { grade: selectedGrade, subject: selectedSubject })}
                                className="bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                                New Unit
                            </button>
                        )}
                        <button
                            onClick={() => onAction(activeTab === 'strategies' ? 'add-item' : 'add-unit', activeTab, undefined, {
                                grade: selectedGrade,
                                subject: selectedSubject,
                                unit: activeTab === 'strategies' && selectedUnit !== 'All Units' ? selectedUnit : undefined
                            })}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                            {activeTab === 'strategies' ? 'New Strategy' : 'New Unit'}
                        </button>
                    </div>
                </div>

                {activeTab === 'strategies' ? (
                    <div className="space-y-3">
                        {filteredItems.filter(i => i.type !== 'structure').length > 0 ? (
                            <div className="tile p-2 bg-slate-900/40 border-white/5 overflow-hidden">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-white/5">
                                        {filteredItems.filter(i => i.type !== 'structure').map(strategy => (
                                            <tr key={strategy.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-5 py-4 bg-transparent">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-8 h-10 rounded shadow-lg ${strategy.bookCover || 'bg-slate-800'} border-l-2 border-white/20 shrink-0`}></div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">{strategy.title}</div>
                                                            <div className="text-[0.6rem] text-white/40 uppercase font-black tracking-widest mt-0.5">{strategy.author || 'Anonymous'} • {new Date(strategy.date).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-right bg-transparent">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => onAction('edit', activeTab, strategy)}
                                                            className="px-3 py-1.5 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all text-[0.55rem] font-black uppercase tracking-widest flex items-center gap-2"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                            Modify
                                                        </button>
                                                        <button
                                                            onClick={() => onAction('delete', activeTab, strategy)}
                                                            className="px-3 py-1.5 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-all text-[0.55rem] font-black uppercase tracking-widest flex items-center gap-2"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            Destroy
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="tile p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-white font-bold mb-1">No Strategies Found</h3>
                                <p className="text-white/40 text-xs mb-4">No strategies documented for Phase {(selectedGrade as string).replace('g', '')} {(selectedSubject as string).toUpperCase()}.</p>
                                <button
                                    onClick={() => onAction('add-item', activeTab, undefined, {
                                        grade: selectedGrade,
                                        subject: selectedSubject,
                                        unit: selectedUnit !== 'All Units' ? selectedUnit : undefined
                                    })}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white force-text-white px-6 py-2 rounded-lg text-[0.6rem] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/40"
                                >
                                    Create First Strategy
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {units.length > 0 ? units.map(unit => (
                            <div key={unit} className="tile p-0 overflow-hidden bg-slate-900/20 border-white/5">
                                {/* Unit Header */}
                                <div
                                    className="p-4 bg-white/[0.02] border-b border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/[0.04] transition-colors"
                                    onClick={() => setExpandedUnit(expandedUnit === unit ? null : unit)}
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className={`w-4 h-4 text-white/40 transition-transform ${expandedUnit === unit ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                        <span className="text-sm font-bold text-white">{unit}</span>
                                        <span className="text-[0.55rem] bg-white/5 text-white/40 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">{getLessonsForUnit(unit).length} Lessons</span>
                                    </div>
                                    {/* Delete Unit Button - Prevent propagation so it doesn't toggle collapse */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onAction('edit-unit', activeTab, undefined, { unit }); }}
                                            className="p-2 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all group/edit"
                                            title="Edit Unit Name"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onAction('delete-unit', activeTab, undefined, { unit }); }}
                                            className="p-2 bg-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-all group/del"
                                            title="Delete Unit & All Contents"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Lessons List (Expanded) */}
                                {expandedUnit === unit && (
                                    <div className="p-4 bg-black/20 space-y-3">
                                        <div className="flex justify-between items-center mb-2 pl-7 pr-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[0.55rem] font-black text-white/30 uppercase tracking-widest">Lessons in {unit}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onAction('delete-unit', activeTab, undefined, { unit }); }}
                                                    className="p-1.5 bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all border border-red-500/20"
                                                    title="Delete Unit"
                                                >
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onAction('add-lesson', activeTab, undefined, { grade: selectedGrade, subject: selectedSubject, unit: unit });
                                                    }}
                                                    className="bg-white/5 hover:bg-white/10 text-cyan-400 px-3 py-1.5 rounded-lg text-[0.5rem] font-black uppercase tracking-widest transition-all border border-cyan-500/20"
                                                >
                                                    + Add Lesson
                                                </button>
                                            </div>
                                        </div>

                                        <div className="pl-7 space-y-3">
                                            {getLessonsForUnit(unit).map(lesson => (
                                                <div key={lesson} className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
                                                    <div
                                                        className="p-3 flex justify-between items-center cursor-pointer hover:bg-white/[0.02] transition-colors"
                                                        onClick={() => setExpandedLesson(expandedLesson === lesson ? null : lesson)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <svg className={`w-3 h-3 text-white/30 transition-transform ${expandedLesson === lesson ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                                            <span className="text-xs font-bold text-white/90">{lesson}</span>
                                                            <span className="text-[0.45rem] text-white/30 uppercase font-black tracking-widest">{getToolsForLesson(unit as string, lesson as string).length} {activeTab === 'exclusive' ? 'Assets' : 'Tools'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onAction('edit-lesson', activeTab, undefined, { unit: unit as string, lesson: lesson as string }); }}
                                                                className="p-1.5 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                                title="Edit Lesson Name"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); onAction('delete-lesson', activeTab, undefined, { unit: unit as string, lesson: lesson as string }); }}
                                                                className="p-1.5 bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/20 rounded-lg transition-all"
                                                                title="Delete Lesson & All Contents"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Tools List (Expanded) */}
                                                    {expandedLesson === lesson && (
                                                        <div className="border-t border-white/5 p-2 bg-black/20">
                                                            <table className="w-full text-left">
                                                                <tbody className="divide-y divide-white/5">
                                                                    {getToolsForLesson(unit as string, lesson as string).map(tool => (
                                                                        <tr key={tool.id} className="group hover:bg-white/[0.02] transition-colors">
                                                                            <td className="px-4 py-2 bg-transparent">
                                                                                <div className="text-[0.65rem] font-bold text-white group-hover:text-cyan-400 transition-colors">{tool.title}</div>
                                                                            </td>
                                                                            <td className="px-4 py-2 text-right bg-transparent">
                                                                                <div className="flex justify-end gap-1.5">
                                                                                    <button onClick={() => onAction('edit', activeTab, tool)} className="p-1 rounded-md bg-white/5 text-white/20 hover:text-white transition-all">
                                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                                                    </button>
                                                                                    <button onClick={() => onAction('delete', activeTab, tool)} className="p-1 rounded-md bg-red-500/5 text-white/20 hover:text-red-400 transition-all">
                                                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    <tr>
                                                                        <td colSpan={2} className="px-4 py-2 pt-3">
                                                                            <button
                                                                                onClick={() => onAction('add-item', activeTab, undefined, { grade: selectedGrade, subject: selectedSubject, unit: unit, lesson: lesson })}
                                                                                className="w-full py-2 border border-dashed border-white/10 rounded-lg text-[0.55rem] font-black uppercase text-white/30 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all text-center"
                                                                            >
                                                                                + Add {activeTab === 'exclusive' ? 'Asset' : 'Tool'} to {lesson}
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )) : (
                            <div className="tile p-12 flex flex-col items-center justify-center text-center border-dashed border-white/10 bg-transparent">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <h3 className="text-white font-bold mb-1">No Units Found</h3>
                                <p className="text-white/40 text-xs mb-4">Start by creating a new unit for this grade & cluster.</p>
                                <button
                                    onClick={() => onAction('add-unit', activeTab, undefined, { grade: selectedGrade, subject: selectedSubject })}
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white force-text-white px-6 py-2 rounded-lg text-[0.6rem] font-black uppercase tracking-widest transition-all shadow-lg shadow-cyan-900/40"
                                >
                                    Create First Unit
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HierarchicalView;
