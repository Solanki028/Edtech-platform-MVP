import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ChapterManagement from './ChapterManagement';

const CourseManagement = ({ courses, refreshData, hideCreate = false }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [view, setView] = useState('list'); // 'list' or 'chapters'

    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            refreshData();
        } catch (error) {
            console.error(error);
        }
    };

    const openModal = (type, course = null) => {
        setModalType(type);
        setSelectedCourse(course);
        setIsModalOpen(true);
    };

    const manageChapters = (course) => {
        setSelectedCourse(course);
        setView('chapters');
    };

    if (view === 'chapters') {
        return <ChapterManagement course={selectedCourse} onBack={() => setView('list')} />;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full bg-slate-100 border-none rounded-xl py-2.5 px-6 pl-12 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                {!hideCreate && (
                    <button 
                        onClick={() => openModal('create')}
                        className="btn-primary !py-2.5 !px-8 text-sm w-full md:w-auto"
                    >
                        + Create Course
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Course</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-center">Category</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-center">Price</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredCourses.map((c) => (
                            <tr key={c._id} className="hover:bg-slate-50 transition-colors group">
                                <td className="py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={c.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                        <div>
                                            <div className="font-bold text-slate-900">{c.title}</div>
                                            <div className="text-xs text-slate-400">{c.duration} • {c.level}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-center">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                        {c.category}
                                    </span>
                                </td>
                                <td className="py-4 text-center font-bold text-slate-900">
                                    ₹{c.price}
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => manageChapters(c)}
                                            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100"
                                        >
                                            Content
                                        </button>
                                        <button 
                                            onClick={() => openModal('edit', c)}
                                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(c._id)}
                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <CourseModal
                    type={modalType}
                    course={selectedCourse}
                    onClose={() => setIsModalOpen(false)}
                    refreshData={refreshData}
                />
            )}
        </div>
    );
};

const CourseModal = ({ type, course, onClose, refreshData }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(
        course || {
            title: '',
            description: '',
            category: 'Web Development',
            price: 0,
            oldPrice: 0,
            duration: '4 Weeks',
            level: 'Beginner',
            image: ''
        }
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (type === 'create') {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/courses`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            } else {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/courses/${course._id}`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }
            refreshData();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-2xl font-bold text-slate-900">{type === 'create' ? 'Create New Course' : 'Edit Course'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 overflow-y-auto max-h-[70vh] grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Title</label>
                        <input
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                        <textarea
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            rows="3"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                        <select 
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Web Development</option>
                            <option>Data Science</option>
                            <option>AI & ML</option>
                            <option>Digital Marketing</option>
                            <option>UI/UX Design</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Level</label>
                        <select 
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={formData.level}
                            onChange={e => setFormData({ ...formData, level: e.target.value })}
                        >
                            <option>Beginner</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Price (₹)</label>
                        <input
                            type="number"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration</label>
                        <input
                            placeholder="e.g. 4 Weeks"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={formData.duration}
                            onChange={e => setFormData({ ...formData, duration: e.target.value })}
                        />
                    </div>
                    <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Image URL</label>
                         <input
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>
                    <div className="md:col-span-2 pt-4">
                        <button type="submit" disabled={loading} className="w-full btn-primary !rounded-xl py-4">
                            {loading ? 'Processing...' : (type === 'create' ? 'Launch Course' : 'Update Course')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CourseManagement;
