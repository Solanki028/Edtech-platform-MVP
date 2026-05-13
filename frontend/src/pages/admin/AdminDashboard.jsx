import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AdminStats from '../../components/admin/AdminStats';
import UserManagement from '../../components/admin/UserManagement';
import CourseManagement from '../../components/admin/CourseManagement';
import LeadManagement from '../../components/admin/LeadManagement';
import EnrollmentManagement from '../../components/admin/EnrollmentManagement';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [statsRes, usersRes, coursesRes, leadsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/users/analytics`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/users`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/leads`, config)
            ]);
            setAnalytics(statsRes.data);
            setUsers(usersRes.data);
            setCourses(coursesRes.data);
            setLeads(leadsRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            fetchData();
        } catch (error) {
            alert('Error deleting user');
        }
    };

    const tabs = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'courses', name: 'Courses', icon: '📚' },
        { id: 'users', name: 'Users', icon: '👥' },
        { id: 'payments', name: 'Payments', icon: '💰' },
        { id: 'leads', name: 'Leads', icon: '📢' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex pt-20">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px)]">
                <div className="p-8 border-b border-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
                        <div>
                            <div className="text-sm font-extrabold text-slate-900 tracking-tight">ADMIN PANEL</div>
                            <div className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase">ManzilChaser Marketplace</div>
                        </div>
                    </div>
                </div>

                <nav className="p-6 space-y-2 flex-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 font-bold text-sm ${
                                activeTab === tab.id 
                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </nav>

                <div className="p-6 mt-auto">
                    <div className="card-premium !p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <div className="text-xs font-bold opacity-50 mb-1 uppercase tracking-widest">Admin Access</div>
                        <div className="text-sm font-bold truncate">{user.name}</div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
                        {activeTab === 'overview' && (
                            <>
                                <header>
                                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Dashboard Overview</h1>
                                    <p className="text-slate-500 font-medium">Welcome back, {user.name.split(' ')[0]}!</p>
                                </header>
                                <AdminStats analytics={analytics} />
                                <div className="grid lg:grid-cols-2 gap-8">
                                    <div className="card-premium">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Counseling Leads</h3>
                                        <LeadManagement leads={leads.slice(0, 5)} hideHeader={true} />
                                    </div>
                                    <div className="card-premium">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6">System Health</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                                <span className="text-sm font-bold text-slate-600">Active Students</span>
                                                <span className="text-lg font-black text-slate-900">{users.filter(u => u.role === 'student').length}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                                                <span className="text-sm font-bold text-slate-600">Total Courses</span>
                                                <span className="text-lg font-black text-slate-900">{courses.length}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'courses' && (
                            <div className="card-premium">
                                <CourseManagement courses={courses} refreshData={fetchData} />
                            </div>
                        )}

                        {activeTab === 'users' && (
                            <div className="card-premium">
                                <UserManagement users={users} deleteUser={deleteUser} />
                            </div>
                        )}

                        {activeTab === 'payments' && (
                            <div className="card-premium">
                                <EnrollmentManagement />
                            </div>
                        )}

                        {activeTab === 'leads' && (
                            <div className="card-premium">
                                <LeadManagement leads={leads} />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
