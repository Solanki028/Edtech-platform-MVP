import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CourseDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
                const found = data.find(c => c._id === id);
                setCourse(found);

                try {
                    const chRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters`, {
                        headers: user ? { Authorization: `Bearer ${user.token}` } : {}
                    });
                    setChapters(chRes.data);
                    setIsEnrolled(true);
                } catch (err) {
                    setChapters([]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user]);

    const handleEnroll = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate(`/checkout/${id}`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    if (!course) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
            <div className="text-6xl">🔍</div>
            <h1 className="text-2xl font-black text-slate-900">Course not found</h1>
            <Link to="/courses" className="btn-primary">Browse All Courses</Link>
        </div>
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Split Hero Section */}
            <section className="relative pt-24 pb-0 bg-slate-950 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600 rounded-full blur-[150px] -mr-96 -mt-96"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600 rounded-full blur-[150px] -ml-48 -mb-48"></div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
                        <div className="space-y-8 animate-fade-in">
                            <div className="flex items-center gap-6">
                                <button onClick={() => navigate('/courses')} className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10">
                                    ←
                                </button>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                    Best Seller
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
                                {course.title}
                            </h1>
                            <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                                {course.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-8 pt-4">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Duration</div>
                                    <div className="text-white font-bold flex items-center gap-2">
                                        <span className="text-blue-500">⏱</span> {course.duration || '24h 45m'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Level</div>
                                    <div className="text-white font-bold flex items-center gap-2">
                                        <span className="text-blue-500">📊</span> {course.level || 'Intermediate'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Students</div>
                                    <div className="text-white font-bold flex items-center gap-2">
                                        <span className="text-blue-500">👥</span> {course.students?.length || 0} Learners
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 pt-6">
                                <div className="flex text-yellow-400">
                                    {[1,2,3,4,5].map(s => <span key={s} className="text-lg">★</span>)}
                                </div>
                                <span className="text-white font-bold">4.9</span>
                                <span className="text-slate-500 text-sm">(2.5k reviews)</span>
                            </div>
                        </div>

                        <div className="hidden lg:block relative">
                            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/5 animate-float">
                                <img src={course.image} alt={course.title} className="w-full aspect-video object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content Sidebar Layout */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-20">
                            {/* Learning Objectives */}
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">What's inside the box?</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {[
                                        { t: 'Industry Standard Workflow', d: 'Learn how pros actually build and ship products in the real world.' },
                                        { t: 'Hands-on Portfolio Projects', d: 'Build 3 massive projects that will get you hired instantly.' },
                                        { t: 'Expert Mentor Support', d: 'Get your doubts cleared by professionals from top tech giants.' },
                                        { t: 'Lifetime Access & Updates', d: 'The course stays with you forever, including all future updates.' }
                                    ].map((item, i) => (
                                        <div key={i} className="group p-8 rounded-3xl bg-slate-50 hover:bg-blue-600 transition-all duration-500">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                                {['🚀', '🛠', '💡', '♾'][i]}
                                            </div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-white transition-colors">{item.t}</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-blue-100 transition-colors">{item.d}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Curriculum */}
                            <div>
                                <div className="flex justify-between items-end mb-10">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Course Curriculum</h3>
                                    <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{chapters.length} Modules</span>
                                </div>
                                <div className="space-y-4">
                                    {chapters.length > 0 ? (
                                        chapters.map((ch, idx) => (
                                            <div key={ch._id} className="group p-6 rounded-[2rem] border border-slate-100 bg-white hover:border-blue-600/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ch.title}</h4>
                                                        <p className="text-xs text-slate-400 font-medium">Video Module • 12:45m</p>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                    🔒
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-slate-50 border-4 border-dashed border-slate-100 rounded-[3rem] p-20 text-center">
                                            <div className="text-4xl mb-4">🔓</div>
                                            <p className="text-slate-500 font-bold">Enroll now to unlock the complete syllabus.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Checkout */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-28 bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
                                <div className="relative h-64 overflow-hidden lg:hidden">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-10 space-y-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{course.price}</span>
                                            {course.oldPrice && <span className="text-xl text-slate-300 line-through font-bold">₹{course.oldPrice}</span>}
                                        </div>
                                        <p className="text-xs font-bold text-green-600 uppercase tracking-widest">Special Launch Offer • 80% OFF</p>
                                    </div>

                                    {isEnrolled ? (
                                        <Link to={`/student/course/${course._id}`} className="w-full btn-primary block text-center !py-5 !rounded-2xl text-lg shadow-xl shadow-blue-500/20">
                                            Continue Learning
                                        </Link>
                                    ) : (
                                        <button onClick={handleEnroll} className="w-full btn-primary !py-5 !rounded-2xl text-lg shadow-xl shadow-blue-500/20">
                                            Enroll in Course
                                        </button>
                                    )}

                                    <div className="space-y-4 pt-4">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-6">This course includes</div>
                                        {[
                                            { i: '📜', t: 'Certificate of Completion' },
                                            { i: '♾️', t: 'Lifetime access to modules' },
                                            { i: '💬', t: 'Private community access' },
                                            { i: '📥', t: 'Downloadable resources' }
                                        ].map((feat, i) => (
                                            <div key={i} className="flex items-center gap-4 text-sm font-bold text-slate-700">
                                                <span className="text-xl">{feat.i}</span>
                                                {feat.t}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                                        <div className="text-center flex-1">
                                            <div className="text-lg font-black text-slate-900 leading-none">30</div>
                                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Day Refund</div>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100"></div>
                                        <div className="text-center flex-1">
                                            <div className="text-lg font-black text-slate-900 leading-none">24/7</div>
                                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Support</div>
                                        </div>
                                        <div className="w-px h-8 bg-slate-100"></div>
                                        <div className="text-center flex-1">
                                            <div className="text-lg font-black text-slate-900 leading-none">100%</div>
                                            <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseDetails;
