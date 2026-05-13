import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [courses, setCourses] = useState([]);
    const [pendingEnrollments, setPendingEnrollments] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [coursesRes, enrollmentsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/courses/student`, config),
                axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments/my`, config)
            ]);
            setCourses(coursesRes.data);
            setPendingEnrollments(enrollmentsRes.data.filter(e => e.paymentStatus === 'completed' && !e.isApproved));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
                        <p className="text-slate-500">You've completed 80% of your goals this week. Keep it up!</p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/courses" className="btn-primary">Browse New Courses</Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {(() => {
                        const totalCompleted = courses.reduce((acc, c) => acc + (c.completedChapters || 0), 0);
                        const estimatedHours = Math.round(totalCompleted * 0.8); // Approx 50 mins per module
                        
                        return [
                            { label: 'Active Courses', value: courses.length, icon: '📖', color: 'bg-blue-50 text-blue-600' },
                            { label: 'Completed Modules', value: totalCompleted, icon: '✅', color: 'bg-green-50 text-green-600' },
                            { label: 'Learning Hours', value: `${estimatedHours}h`, icon: '⚡', color: 'bg-orange-50 text-orange-600' },
                        ].map((stat, i) => (
                            <div key={i} className="card-premium flex items-center gap-6">
                                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
                                    <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                </div>
                            </div>
                        ));
                    })()}
                </div>

                {pendingEnrollments.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                            Awaiting Approval
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pendingEnrollments.map(e => (
                                <div key={e._id} className="card-premium opacity-70 grayscale-[0.5]">
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">⏳</div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{e.course?.title}</h3>
                                            <p className="text-xs text-orange-600 font-bold uppercase mt-1">Pending Verification</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-4 italic">Access will be granted once the admin verifies your payment of ₹{e.amount}.</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-8 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">My Learning Journey</h2>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white text-sm font-bold rounded-xl shadow-sm border border-slate-100">In Progress</button>
                        <button className="px-4 py-2 text-sm font-bold text-slate-500">Completed</button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl"></div>)}
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20 glass rounded-[2rem] border-2 border-dashed border-slate-200">
                        <div className="text-6xl mb-6">🎯</div>
                        <h3 className="text-xl font-bold text-slate-900">No active courses yet</h3>
                        <p className="text-slate-500 mt-2 mb-8">Start your journey by enrolling in a course from our catalog.</p>
                        <Link to="/courses" className="btn-primary">Explore Courses</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map(course => (
                            <div key={course._id} className="card-premium group !p-0 overflow-hidden flex flex-col">
                                <div className="h-40 relative">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            {course.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{course.title}</h3>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                                                {course.mentor?.name?.[0] || 'M'}
                                            </div>
                                            <span className="text-[11px] text-slate-500 font-medium">by {course.mentor?.name || 'Instructor'}</span>
                                        </div>
                                        <div className="h-4 w-px bg-slate-100"></div>
                                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                                            <span>⏱</span> {course.duration || 'Self-paced'}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto space-y-4">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                                <span>Course Progress</span>
                                                <span className={course.progress === 100 ? "text-green-600" : "text-blue-600"}>
                                                    {course.progress === 100 ? 'COMPLETED' : `${course.progress}%`}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ${course.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {course.completedChapters} / {course.totalChapters} Modules
                                            </div>
                                            <Link
                                                to={`/student/course/${course._id}`}
                                                className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                    course.progress === 100 
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                                    : 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:-translate-y-0.5'
                                                }`}
                                            >
                                                {course.progress === 100 ? 'View Certificate' : 'Continue'}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
