
import React, { useState, useEffect } from 'react';
import { AdminTab, Course, ManagedItem } from './types';
import { INITIAL_TRAINING, INITIAL_EXCLUSIVE, INITIAL_STRATEGIES } from '../data';
import DashboardView from './DashboardView';
import TrainingListView from './TrainingListView';
import ItemListView from './ItemListView';
import HierarchicalView from './HierarchicalView';
import CourseEditor from './CourseEditor';
import ItemEditor from './ItemEditor';
import SimpleInputModal from './SimpleInputModal';
import ApiService from '../ApiService';

const AdminPanel: React.FC = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .force-text-white { color: #ffffff !important; }
      [data-theme='light'] .bg-cyan-600, [data-theme='light'] .bg-cyan-600 *, 
      [data-theme='light'] .bg-cyan-500, [data-theme='light'] .bg-cyan-500 *, 
      [data-theme='light'] .bg-\[\#0891b2\], [data-theme='light'] .bg-\[\#0891b2\] *, 
      [data-theme='light'] .hover\:bg-cyan-500:hover, [data-theme='light'] .hover\:bg-cyan-500:hover * { color: #ffffff !important; }
      .text-cyan-400 { font-weight: 700; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isEditing, setIsEditing] = useState(false);


  const [trainingCourses, setTrainingCourses] = useState<Course[]>([]);
  const [exclusiveData, setExclusiveData] = useState<ManagedItem[]>([]);
  const [strategyData, setStrategyData] = useState<ManagedItem[]>([]);

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingItem, setEditingItem] = useState<ManagedItem | null>(null);

  // Load persistence layer from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [training, exclusive, strategies] = await Promise.all([
          ApiService.getCourses(),
          ApiService.getExclusiveMaterials(),
          ApiService.getStrategies()
        ]);
        setTrainingCourses(training);
        setExclusiveData(exclusive);
        setStrategyData(strategies);
      } catch (err) {
        console.error("Critical: Neural link failed.", err);
      }
    };
    fetchData();
  }, []);

  const resetToDefaults = () => {
    if (confirm('⚠️ WARNING: This will overwrite your virtual state with defaults. Local persistence (DB) will NOT be affected until you manually save each item.')) {
      setTrainingCourses(INITIAL_TRAINING);
      setExclusiveData(INITIAL_EXCLUSIVE);
      setStrategyData(INITIAL_STRATEGIES);
      alert('Local state reset. Save items individually to persist to the central repository.');
    }
  };

  const handleCourseAction = async (type: 'edit' | 'add' | 'delete', course?: Course) => {
    if (type === 'delete' && course) {
      if (!confirm(`Permanently destroy course "${course.title}"?`)) return;
      try {
        await ApiService.deleteCourse(course.id);
        setTrainingCourses(trainingCourses.filter(c => c.id !== course.id));
      } catch (err) {
        alert('Deletion failed. Data is persistent.');
      }
      return;
    }
    setEditingCourse(course ? { ...course } : {
      id: `c-${Date.now()}`,
      title: '', instructor: '', duration: '0h', enrolled: 0, likes: 0, level: 'Beginner',
      image: 'https://placehold.co/600x400/2E1065/FFF?text=New+Course',
      description: '', modules: []
    });
    setIsEditing(true);
  };

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'unit' | 'lesson' | null>(null);
  const [modalDefaults, setModalDefaults] = useState<Partial<ManagedItem>>({});
  const [editingTarget, setEditingTarget] = useState<{ type: 'unit' | 'lesson'; oldName: string; parentUnit?: string } | null>(null);

  const handleItemAction = async (type: string, tab: AdminTab, item?: ManagedItem, defaults?: Partial<ManagedItem>) => {
    const key = `educore_${tab}`;
    const data = tab === 'exclusive' ? exclusiveData : strategyData;

    // Handle Unit Creation
    if (type === 'add-unit') {
      setModalType('unit');
      setModalDefaults(defaults || {});
      setEditingTarget(null);
      setModalOpen(true);
      return;
    }

    // Handle Unit Editing (Rename)
    if (type === 'edit-unit' && defaults?.unit) {
      setModalType('unit');
      setModalDefaults({ ...defaults, title: defaults.unit }); // Pre-fill title for modal
      setEditingTarget({ type: 'unit', oldName: defaults.unit });
      setModalOpen(true);
      return;
    }

    // Handle Lesson Creation
    if (type === 'add-lesson') {
      setModalType('lesson');
      setModalDefaults(defaults || {});
      setEditingTarget(null);
      setModalOpen(true);
      return;
    }

    // Handle Lesson Editing (Rename)
    if (type === 'edit-lesson' && defaults?.unit && defaults?.lesson) {
      setModalType('lesson');
      setModalDefaults({ ...defaults, title: defaults.lesson }); // Pre-fill title for modal
      setEditingTarget({ type: 'lesson', oldName: defaults.lesson, parentUnit: defaults.unit });
      setModalOpen(true);
      return;
    }

    // Handle Cascading Deletes
    if (type === 'delete-unit' && defaults?.unit) {
      if (!confirm(`Warning: Deleting Unit "${defaults.unit}" will delete ALL contained lessons and assets.\n\nAre you sure you want to proceed?`)) return;
      // In a real system, you'd call a bulk delete API. For now, we filter locally and would sync.
      const itemsToDelete = data.filter(i => i.unit === defaults.unit);
      try {
        if (tab === 'exclusive') {
          await Promise.all(itemsToDelete.map(item => ApiService.deleteExclusiveMaterial(item.id)));
          setExclusiveData(data.filter(i => i.unit !== defaults.unit));
        } else {
          await Promise.all(itemsToDelete.map(item => ApiService.deleteStrategy(item.id as any)));
          setStrategyData(data.filter(i => i.unit !== defaults.unit));
        }
      } catch (err) {
        alert('Failed to delete unit contents.');
      }
      return;
    }

    if (type === 'delete-lesson' && defaults?.unit && defaults?.lesson) {
      if (!confirm(`Warning: Deleting Lesson "${defaults.lesson}" from "${defaults.unit}" will delete ALL contained assets.\n\nAre you sure?`)) return;
      const itemsToDelete = data.filter(i => i.unit === defaults.unit && i.lesson === defaults.lesson);
      try {
        if (tab === 'exclusive') {
          await Promise.all(itemsToDelete.map(item => ApiService.deleteExclusiveMaterial(item.id)));
          setExclusiveData(data.filter(i => !(i.unit === defaults.unit && i.lesson === defaults.lesson)));
        } else {
          await Promise.all(itemsToDelete.map(item => ApiService.deleteStrategy(item.id as any)));
          setStrategyData(data.filter(i => !(i.unit === defaults.unit && i.lesson === defaults.lesson)));
        }
      } catch (err) {
        alert('Failed to delete lesson contents.');
      }
      return;
    }

    if (type === 'delete' && item) {
      if (!confirm(`Permanently remove item "${item.title}" from repository?`)) return;
      try {
        if (tab === 'exclusive') {
          await ApiService.deleteExclusiveMaterial(item.id);
          setExclusiveData(exclusiveData.filter(i => i.id !== item.id));
        } else {
          await ApiService.deleteStrategy(item.id as any);
          setStrategyData(strategyData.filter(i => i.id !== item.id));
        }
      } catch (err) {
        alert('Deletion failed.');
      }
      return;
    }

    // Handle Asset/Item Editing/Adding
    setEditingItem(item ? { ...item } : {
      id: `item-${Date.now()}`,
      title: '',
      grade: defaults?.grade || 'g1',
      subject: defaults?.subject || 'bangla',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Published',
      description: '',
      content: '',
      directions: '',
      videoUrl: '',
      type: tab === 'strategies' ? 'strategy' : 'video',
      author: 'Admin',
      bookCover: 'bg-slate-800',
      unit: defaults?.unit || '',
      lesson: defaults?.lesson || ''
    });
    setIsEditing(true);
  };

  const handleModalSubmit = async (inputValue: string) => {
    if (!modalType) return;
    const data = activeTab === 'exclusive' ? exclusiveData : strategyData;

    // Handle Rename Logic (Visual only for now, would require bulk API)
    if (editingTarget) {
      alert("Structural renames must be performed on individual assets in this version.");
      setModalOpen(false);
      setEditingTarget(null);
      return;
    }

    const newItem: ManagedItem = {
      id: `struc-${Date.now()}`,
      title: `${inputValue} Header`,
      grade: modalDefaults.grade || 'g1',
      subject: modalDefaults.subject || 'bangla',
      unit: modalType === 'unit' ? inputValue : (modalDefaults.unit || ''),
      lesson: modalType === 'lesson' ? inputValue : 'General',
      type: 'structure', // Special type
      status: 'Hidden',
      date: new Date().toISOString(),
      description: 'Structural component',
      content: '',
      directions: '',
      videoUrl: '',
      author: 'System',
      bookCover: ''
    };

    try {
      let saved;
      if (activeTab === 'exclusive') {
        saved = await ApiService.saveExclusiveMaterial(newItem);
        setExclusiveData([...exclusiveData, saved]);
      } else {
        saved = await ApiService.saveStrategy(newItem);
        setStrategyData([...strategyData, saved]);
      }
    } catch (err) {
      alert('Failed to persist structural node.');
    }

    setModalOpen(false);
    setModalType(null);
  };

  const saveEditedCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event bubbling to prevent any parent handlers from firing

    if (!editingCourse) return;

    try {
      // Optimistic UI updates or loading state could be added here
      const saved = await ApiService.saveCourse(editingCourse);

      // Verification: Ensure we got a valid object back
      if (!saved || typeof saved !== 'object') {
        throw new Error("Invalid response from server");
      }

      const exists = trainingCourses.find(c => c.id === saved.id);
      const updated = exists
        ? trainingCourses.map(c => c.id === saved.id ? saved : c)
        : [saved, ...trainingCourses];

      setTrainingCourses(updated);
      setIsEditing(false);
      setEditingCourse(null);
    } catch (err: any) {
      console.error("Course Save Error:", err);
      // More descriptive error message
      alert(`Failed to save course: ${err.message || 'Unknown error'}`);
    }
  };

  const saveEditedItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      let saved;
      if (activeTab === 'exclusive') {
        saved = await ApiService.saveExclusiveMaterial(editingItem);
        const exists = exclusiveData.find(i => i.id === saved.id);
        const updated = exists ? exclusiveData.map(i => i.id === saved.id ? saved : i) : [saved, ...exclusiveData];
        setExclusiveData(updated);
      } else {
        saved = await ApiService.saveStrategy(editingItem);
        const exists = strategyData.find(i => i.id === saved.id);
        const updated = exists ? strategyData.map(i => i.id === saved.id ? saved : i) : [saved, ...strategyData];
        setStrategyData(updated);
      }
      setIsEditing(false);
      setEditingItem(null);
    } catch (err) {
      alert('Failed to save item.');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn relative admin-panel-container">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1"><span className="status-pulse"></span><span className="mono text-[0.6rem] text-cyan-400 font-black uppercase tracking-[0.2em]">Neural Control Interface</span></div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Command <span className="text-cyan-500">Center</span></h1>
        </div>
        <div className="flex flex-wrap bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-3xl shadow-xl">
          {['dashboard', 'training', 'exclusive', 'strategies'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as AdminTab);
                setIsEditing(false);
                setEditingCourse(null);
                setEditingItem(null);
              }}
              className={`px-4 py-2 rounded-lg text-[0.55rem] font-black uppercase tracking-[0.15em] transition-all duration-300 ${activeTab === tab ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Top Bar for Global Actions */}
        {activeTab === 'dashboard' && (
          <div className="flex justify-end mb-4">
            <button
              onClick={resetToDefaults}
              className="text-[0.6rem] font-bold text-red-400 bg-red-500/10 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/20"
            >
              ⚠ Reset / Seed Default Data
            </button>
          </div>
        )}

        {!isEditing && activeTab === 'dashboard' && (
          <DashboardView
            courses={trainingCourses}
            exclusiveItems={exclusiveData}
            strategies={strategyData}
          />
        )}

        {!isEditing && activeTab === 'training' && (
          <TrainingListView courses={trainingCourses} onAction={handleCourseAction} />
        )}

        {!isEditing && (activeTab === 'exclusive' || activeTab === 'strategies') && (
          <HierarchicalView
            activeTab={activeTab}
            items={activeTab === 'exclusive' ? exclusiveData : strategyData}
            allItems={activeTab === 'exclusive' ? strategyData : exclusiveData}
            onAction={handleItemAction}
          />
        )}

        {isEditing && editingCourse && activeTab === 'training' && (
          <CourseEditor
            course={editingCourse}
            setCourse={setEditingCourse}
            onSave={saveEditedCourse}
            onCancel={() => { setIsEditing(false); setEditingCourse(null); }}
          />
        )}

        {isEditing && editingItem && (activeTab === 'exclusive' || activeTab === 'strategies') && (
          <ItemEditor
            item={editingItem}
            setItem={setEditingItem}
            activeTab={activeTab}
            onSave={saveEditedItem}
            onCancel={() => { setIsEditing(false); setEditingItem(null); }}
          />
        )}
      </div>
      {/* Modal for Units/Lessons */}
      {modalOpen && (
        <SimpleInputModal
          title={`Create New ${modalType === 'unit' ? 'Unit' : 'Lesson'}`}
          label={`${modalType === 'unit' ? 'Unit' : 'Lesson'} Name`}
          placeholder={`Enter ${modalType} title...`}
          onCancel={() => { setModalOpen(false); setModalType(null); }}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default AdminPanel;
