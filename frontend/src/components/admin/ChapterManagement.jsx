import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const ChapterManagement = ({ course, onBack }) => {
    const { user } = useAuth();
    const [chapters, setChapters] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create');
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        sequenceOrder: 1
    });

    const fetchChapters = async () => {
        setFetching(true);
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${course._id}/chapters`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setChapters(data);
        } catch (error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchChapters();
    }, [course._id]);

    const handleOpenModal = (type, chapter = null) => {
        setModalType(type);
        setSelectedChapter(chapter);
        setFormData(chapter || {
            title: '',
            description: '',
            videoUrl: '',
            sequenceOrder: chapters.length + 1
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (modalType === 'create') {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/courses/${course._id}/chapters`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/courses/${course._id}/chapters/${selectedChapter._id}`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }
            fetchChapters();
            setIsModalOpen(false);
        } catch (error) {
            alert('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (chapterId) => {
        if (!window.confirm('Delete this chapter?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${course._id}/chapters/${chapterId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchChapters();
        } catch (error) {
            alert('Delete failed');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <button onClick={onBack} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Chapters</h2>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">Course: {course.title}</p>
                </div>
                <button 
                    onClick={() => handleOpenModal('create')}
                    className="ml-auto btn-primary !py-2.5 !px-6 text-sm"
                >
                    + Add Chapter
                </button>
            </div>

            <div className="grid gap-4">
                {fetching ? (
                    [1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-slate-100"></div>)
                ) : chapters.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <div className="text-4xl mb-4">🎬</div>
                        <p className="text-slate-500 font-medium">No chapters added yet. Start building your curriculum!</p>
                    </div>
                ) : (
                    chapters.map((ch) => (
                        <div key={ch._id} className="card-premium flex items-center justify-between group !p-6">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-blue-600 border border-slate-100">
                                    {ch.sequenceOrder}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">{ch.title}</h4>
                                    <p className="text-xs text-slate-400 truncate max-w-md font-medium">{ch.description || 'No description provided'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenModal('edit', ch)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button onClick={() => handleDelete(ch._id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-slide-up p-10 relative">
                        <div className="absolute top-8 right-8">
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">{modalType === 'create' ? 'New Chapter' : 'Edit Chapter'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Chapter Title</label>
                                <input
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white outline-none transition-all font-medium"
                                    placeholder="Enter chapter title"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Description</label>
                                <textarea
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white outline-none transition-all font-medium"
                                    rows="3"
                                    placeholder="What will students learn?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Video URL</label>
                                    <input
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white outline-none transition-all font-medium"
                                        placeholder="YouTube/Vimeo link"
                                        value={formData.videoUrl}
                                        onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Sequence</label>
                                    <input
                                        type="number"
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600/20 focus:bg-white outline-none transition-all font-medium"
                                        value={formData.sequenceOrder}
                                        onChange={e => setFormData({ ...formData, sequenceOrder: parseInt(e.target.value) })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-8 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Discard</button>
                                <button type="submit" disabled={loading} className="flex-[2] btn-primary !rounded-2xl !py-4 shadow-xl shadow-blue-200">
                                    {loading ? 'Processing...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChapterManagement;
