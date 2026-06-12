
import React, { useState, useEffect } from 'react';
import ApiService from '../ApiService';
import { ConfirmModal } from './AdminComponents';

const AdminFileManager: React.FC = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [category, setCategory] = useState('exclusive');
    const [isPublic, setIsPublic] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await ApiService.listFiles();
            setFiles(data);
        } catch (err: any) {
            setError('Failed to fetch files');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        setUploading(true);
        setError(null);
        try {
            await ApiService.uploadFile(selectedFile, category, isPublic);
            setSelectedFile(null);
            // Reset file input
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            fetchFiles();
        } catch (err: any) {
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) return;
        try {
            await ApiService.deleteFile(deleteConfirm.id);
            setFiles(files.filter(f => f.id !== deleteConfirm.id));
        } catch (err: any) {
            alert('Delete failed');
        } finally {
            setDeleteConfirm(null);
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Upload Section */}
            <section className="tile p-8 border-cyan-500/20 bg-cyan-500/5 backdrop-blur-3xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-cyan-500 pointer-events-none">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4.5 9h5v7h5V9h5L12 2zm10 18H2v2h20v-2z" /></svg>
                </div>

                <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    </div>
                    Asset Ingestion
                </h2>

                <form onSubmit={handleFileUpload} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="space-y-1.5">
                        <label className="mono text-[0.625rem] text-cyan-400/60 uppercase font-black ml-1">Select Resource</label>
                        <input
                            id="fileInput"
                            type="file"
                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                            className="w-full text-xs text-white/40 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[0.6rem] file:font-black file:uppercase file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 bg-white/5 border border-white/10 rounded-xl p-2"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="mono text-[0.625rem] text-cyan-400/60 uppercase font-black ml-1">Registry Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="contact-input bg-black/40 border-white/10 text-xs py-2.5"
                        >
                            <option value="training">Training</option>
                            <option value="exclusive">Exclusive</option>
                            <option value="strategy">Strategy</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4 h-[45px]">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-cyan-600 transition-colors border border-white/10"></div>
                                <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full transition-transform peer-checked:translate-x-5 peer-checked:bg-white"></div>
                            </div>
                            <span className="mono text-[0.625rem] text-white/40 uppercase font-black group-hover:text-cyan-400 transition-colors">Public Visibility</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className="cta-button bg-cyan-600 hover:bg-cyan-500 py-3 text-[0.65rem] font-black uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-cyan-900/20"
                    >
                        {uploading ? 'Transmitting...' : 'Ingest Asset'}
                    </button>
                </form>

                {error && <div className="mt-4 text-red-400 text-[0.6rem] font-black uppercase tracking-widest animate-pulse">{error}</div>}
            </section>

            {/* List Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 ml-2">
                    Repository Index
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                    {loading && <div className="w-4 h-4 rounded-full border border-cyan-500 border-t-transparent animate-spin"></div>}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {files.map(file => (
                        <div key={file.id} className="tile p-5 group border-white/5 hover:border-cyan-500/30 transition-all duration-500 bg-white/[0.02]">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                </div>
                                <div className={`px-2 py-1 rounded text-[0.5rem] font-black uppercase ${file.is_public ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {file.is_public ? 'Public' : 'Private'}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xs font-black text-white uppercase truncate" title={file.file.split('/').pop()}>{file.file.split('/').pop()}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="mono text-[0.55rem] text-white/20 uppercase font-black">{file.category}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                    <span className="mono text-[0.55rem] text-white/20 uppercase font-black">{file.uploaded_at ? new Date(file.uploaded_at).toLocaleDateString() : new Date().toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
                                <a
                                    href={file.file}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 py-1.5 rounded-lg bg-white/5 text-[0.5rem] font-black text-white/40 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all text-center"
                                >
                                    View Link
                                </a>
                                <button
                                    onClick={() => setDeleteConfirm({ id: file.id, name: file.file.split('/').pop() })}
                                    className="w-10 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {!loading && files.length === 0 && (
                        <div className="col-span-full py-20 text-center opacity-20">
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Repository Vacant</h3>
                            <p className="text-[0.6rem] mt-2">Ingest assets to populate the index.</p>
                        </div>
                    )}
                </div>
            </section>

            <ConfirmModal
                isOpen={!!deleteConfirm}
                title="Destroy Asset?"
                message={`This will permanently remove "${deleteConfirm?.name}" from your secure repository.`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm(null)}
                confirmText="Exterminate"
            />
        </div>
    );
};

export default AdminFileManager;
