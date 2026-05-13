import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UserManagement = ({ users, deleteUser }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', role: 'student' });
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/users/${userId}/toggle-status`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update user status');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="w-full bg-slate-100 border-none rounded-xl py-2.5 px-6 pl-12 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        className="bg-slate-100 border-none rounded-xl py-2.5 px-6 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold text-slate-600"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="all">All Roles</option>
                        <option value="student">Students</option>
                        <option value="admin">Admins</option>
                    </select>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary !py-2.5 !px-8 text-sm w-full md:w-auto"
                >
                    + Add New User
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">User</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-center">Role</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-center">Status</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredUsers.map((u) => (
                            <tr key={u._id} className="hover:bg-slate-50 transition-colors group">
                                <td className={`py-4 ${!u.isActive ? 'opacity-50' : ''}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                            {u.name[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{u.name}</div>
                                            <div className="text-xs text-slate-400">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 text-center">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider 
                                        ${u.role === 'admin' ? 'bg-violet-50 text-violet-600' : 'bg-green-50 text-green-600'}`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="py-4 text-center">
                                    {!u.isActive ? (
                                        <span className="text-[10px] font-bold text-red-500 uppercase">Inactive</span>
                                    ) : (
                                        <span className="text-[10px] font-bold text-green-500 uppercase">Active</span>
                                    )}
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {u.role !== 'admin' && (
                                            <button
                                                onClick={() => handleToggleStatus(u._id)}
                                                className={`p-2 rounded-lg transition-colors ${!u.isActive ? 'text-green-600 hover:bg-green-50' : 'text-orange-600 hover:bg-orange-50'}`}
                                                title={u.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {u.isActive ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                )}
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteUser(u._id)}
                                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete User"
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-bold text-slate-900">Add New User</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                                <select
                                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-slate-600"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student">Student</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full btn-primary !rounded-xl py-4 mt-4">
                                Create User
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
