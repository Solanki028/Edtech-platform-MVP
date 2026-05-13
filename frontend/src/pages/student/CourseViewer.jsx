import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import confetti from 'canvas-confetti';

const CourseViewer = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [progress, setProgress] = useState({ completedChapters: [], quizScore: 0 });
    const [currentChapter, setCurrentChapter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('video'); // video, quiz
    const [showCelebration, setShowCelebration] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);

    const isCourseCompleted = chapters.length > 0 && progress.completedChapters.length === chapters.length;

    useEffect(() => {
        if (isCourseCompleted) {
            setShowCelebration(true);
            triggerConfetti();
        }
    }, [isCourseCompleted]);

    const triggerConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };
        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
    };

    useEffect(() => {
        fetchCourseData();
    }, [id]);

    const fetchCourseData = async () => {
        try {
            // 1. Fetch Course Basic Info (to check if user is enrolled in students array)
            const { data: courseData } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const course = courseData.find(c => c._id === id);
            
            if (!course) {
                setLoading(false);
                return;
            }

            // Check if user is in course.students
            // JWT decoded user has 'id', while some contexts might have '_id'
            const userId = user.id || user._id;
            const isEnrolled = course.students.some(sId => (sId._id || sId) === userId);
            setEnrollmentStatus(isEnrolled ? { paymentStatus: 'completed', isApproved: true } : null);

            if (!isEnrolled) {
                setLoading(false);
                return;
            }

            // 2. Fetch Chapters (Backend will also verify enrollment)
            const chaptersRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/${id}/chapters`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setChapters(chaptersRes.data);

            // 3. Fetch Progress
            const progressRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/progress/course/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProgress(progressRes.data);

            if (chaptersRes.data.length > 0) {
                setCurrentChapter(chaptersRes.data[0]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Course Viewer Error:', error);
            if (error.response?.status === 403) {
                setEnrollmentStatus(null);
            }
            setLoading(false);
        }
    };

    const markComplete = async (chapterId) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/progress/${chapterId}/complete`, {}, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const progressRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/progress/course/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProgress(progressRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const submitQuiz = async (score) => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/progress/quiz`, {
                courseId: id,
                score
            }, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            fetchCourseData();
            alert('Quiz submitted successfully!');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Content...</div>;

    // Check if locked
    if (!enrollmentStatus || enrollmentStatus.paymentStatus !== 'completed' || !enrollmentStatus.isApproved) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-900 text-white p-6">
                <div className="max-w-md text-center space-y-8 animate-fade-in">
                    <div className="text-6xl">🔒</div>
                    <h1 className="text-3xl font-extrabold">Access Restricted</h1>
                    {!enrollmentStatus ? (
                        <>
                            <p className="text-slate-400">You are not enrolled in this course yet.</p>
                            <button onClick={() => navigate(`/checkout/${id}`)} className="btn-primary w-full py-4">Enroll & Pay Now</button>
                        </>
                    ) : (
                        <>
                            <p className="text-slate-400">Your payment of <span className="font-bold text-white">₹{enrollmentStatus.amount}</span> is {enrollmentStatus.paymentStatus === 'completed' ? 'pending admin approval' : 'incomplete'}.</p>
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Status</div>
                                <div className="text-xl font-bold">{enrollmentStatus.paymentStatus === 'completed' ? 'Awaiting Verification' : 'Payment Failed/Pending'}</div>
                            </div>
                            <button onClick={() => navigate('/student')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors underline">Return to Dashboard</button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const isChapterCompleted = (chapterId) => progress.completedChapters.includes(chapterId);

    // Sequential logic: Check if all previous chapters are completed
    const canAccessChapter = (index) => {
        if (index === 0) return true;
        for (let i = 0; i < index; i++) {
            if (!isChapterCompleted(chapters[i]._id)) return false;
        }
        return true;
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <aside className={`w-85 bg-slate-50 border-r border-slate-100 flex flex-col transition-all ${isSidebarOpen ? 'fixed inset-0 z-[3000] w-full' : 'hidden md:flex'}`}>
                <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <button onClick={() => navigate('/student')} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                            ← Back to Dashboard
                        </button>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">✕</button>
                    </div>
                    <h2 className="font-black text-slate-900 text-xl tracking-tight">Course Curriculum</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {chapters.map((ch, idx) => {
                        const accessible = canAccessChapter(idx);
                        return (
                            <button
                                key={ch._id}
                                disabled={!accessible}
                                onClick={() => {
                                    setCurrentChapter(ch);
                                    setActiveTab('video');
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative ${
                                    currentChapter?._id === ch._id 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 z-10' 
                                    : accessible ? 'hover:bg-white text-slate-600' : 'opacity-50 cursor-not-allowed grayscale'
                                }`}
                            >
                                <div className={`w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center font-black text-xs ${
                                    currentChapter?._id === ch._id ? 'bg-white text-blue-600' : 'bg-slate-200 text-slate-400'
                                }`}>
                                    {isChapterCompleted(ch._id) ? '✓' : idx + 1}
                                </div>
                                <div className="text-left overflow-hidden">
                                    <div className="text-sm font-bold truncate">{ch.title}</div>
                                    <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-0.5">Video Lesson</div>
                                </div>
                                {!accessible && (
                                    <div className="ml-auto text-xs opacity-40">🔒</div>
                                )}
                            </button>
                        );
                    })}
                    
                    <button
                        onClick={() => setActiveTab('quiz')}
                        disabled={!isCourseCompleted && chapters.length > 0}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                            activeTab === 'quiz' 
                            ? 'bg-violet-600 text-white shadow-xl shadow-violet-200' 
                            : isCourseCompleted ? 'hover:bg-white text-slate-600' : 'opacity-50 cursor-not-allowed grayscale'
                        }`}
                    >
                        <div className={`w-10 h-10 min-w-[40px] rounded-full flex items-center justify-center font-black text-xs ${activeTab === 'quiz' ? 'bg-white text-violet-600' : 'bg-slate-200 text-slate-400'}`}>
                            ?
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold">Final Quiz</div>
                            <div className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-0.5">Assessment</div>
                        </div>
                        {!isCourseCompleted && <div className="ml-auto text-xs opacity-40">🔒</div>}
                    </button>
                </div>
                
                <div className="p-8 bg-white border-t border-slate-100 space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Course Progress</span>
                            <span className={isCourseCompleted ? "text-green-600" : "text-blue-600"}>
                                {isCourseCompleted ? "COMPLETED" : `${Math.round((progress.completedChapters.length / chapters.length) * 100)}%`}
                            </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ease-out ${isCourseCompleted ? 'bg-green-500' : 'bg-blue-600'}`} 
                                style={{ width: `${Math.round((progress.completedChapters.length / chapters.length) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {isCourseCompleted && (
                        <a
                            href={`${import.meta.env.VITE_API_URL}/api/certificates/${id}?token=${user.token}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl font-black text-sm shadow-xl shadow-orange-200 hover:-translate-y-1 transition-all"
                            onClick={(e) => {
                                // PDF download usually works better with direct link or fetch
                                // Since it's an attachment, direct link is fine if token is passed
                            }}
                        >
                            <span>📜</span> Download Certificate
                        </a>
                    )}
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50/50 custom-scrollbar">
                <div className="sticky top-0 z-[2000] bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex md:hidden items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(true)} className="btn-primary !py-2 !px-4 text-xs">Curriculum</button>
                    <span className="font-black text-slate-900 text-sm">Learning Mode</span>
                </div>
                
                <div className="p-6 md:p-12 max-w-5xl mx-auto">
                    {activeTab === 'video' && currentChapter ? (
                        <div className="space-y-10 animate-fade-in">
                            <div className="aspect-video bg-black rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] ring-1 ring-white/10 relative group">
                                {getYouTubeId(currentChapter.videoUrl) ? (
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${getYouTubeId(currentChapter.videoUrl)}?rel=0&modestbranding=1`}
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-slate-900">Video Content Unavailable</div>
                                )}
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-start gap-8 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
                                <div className="space-y-3">
                                    <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{currentChapter.title}</h1>
                                    <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">{currentChapter.description}</p>
                                </div>
                                <div className="flex flex-col gap-4 w-full md:w-auto">
                                    {!isChapterCompleted(currentChapter._id) ? (
                                        <button 
                                            onClick={() => markComplete(currentChapter._id)} 
                                            className="btn-primary !px-10 !py-4 shadow-xl shadow-blue-500/20 hover:-translate-y-1 transition-transform"
                                        >
                                            Mark as Completed
                                        </button>
                                    ) : (
                                        <div className="bg-green-50 text-green-600 px-8 py-4 rounded-2xl font-black text-sm text-center border border-green-100 flex items-center justify-center gap-2">
                                            ✓ Lesson Finished
                                        </div>
                                    )}
                                    {isChapterCompleted(currentChapter._id) && chapters[chapters.findIndex(c => c._id === currentChapter._id) + 1] && (
                                        <button 
                                            onClick={() => {
                                                const nextIdx = chapters.findIndex(c => c._id === currentChapter._id) + 1;
                                                setCurrentChapter(chapters[nextIdx]);
                                            }}
                                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-colors"
                                        >
                                            Next Lesson →
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'quiz' ? (
                        <div className="animate-fade-in">
                            <QuizModule onComplete={submitQuiz} existingScore={progress.quizScore} />
                        </div>
                    ) : (
                        <div className="h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
                            <div className="text-8xl animate-bounce">🎓</div>
                            <h2 className="text-3xl font-black text-slate-900">Ready to dive in?</h2>
                            <p className="text-slate-500 font-medium">Select the first module from the sidebar to begin your journey.</p>
                            <button onClick={() => { setCurrentChapter(chapters[0]); setActiveTab('video'); }} className="btn-primary">Start Learning Now</button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const QuizModule = ({ onComplete, existingScore }) => {
    const [started, setStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const questions = [
        { q: "What is the primary role of an EdTech platform?", a: "To facilitate learning", o: ["To play games", "To facilitate learning", "To browse social media"] },
        { q: "Which tool is commonly used for frontend development?", a: "React", o: ["Node.js", "React", "MongoDB"] },
        { q: "What does UI stand for?", a: "User Interface", o: ["User Interface", "Under Information", "Unit Integration"] }
    ];

    const handleFinish = () => {
        const finalScore = 100; // Guaranteed pass for demo
        setScore(finalScore);
        setFinished(true);
        onComplete(finalScore);
    };

    if (existingScore > 0 && !started) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 py-20">
                <div className="text-6xl">🏆</div>
                <h2 className="text-3xl font-bold">Quiz Already Completed</h2>
                <div className="text-5xl font-black text-blue-600">Score: {existingScore}%</div>
                <button onClick={() => setStarted(true)} className="text-blue-600 font-bold hover:underline">Retake Quiz</button>
            </div>
        );
    }

    if (!started) return (
        <div className="max-w-2xl mx-auto text-center space-y-8 py-20">
            <h2 className="text-4xl font-extrabold">Final Assessment</h2>
            <p className="text-slate-500">Test your knowledge of the course material. You need 70% to pass and earn your certificate.</p>
            <button onClick={() => setStarted(true)} className="btn-primary !px-12 !py-4">Start Quiz</button>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto card-premium !p-12 space-y-8 text-center">
            {finished ? (
                <>
                    <h2 className="text-3xl font-bold">Your Score</h2>
                    <div className="text-7xl font-black text-blue-600">{score}%</div>
                    <p className="text-slate-500">{score >= 70 ? 'Amazing job! You passed.' : 'Keep learning and try again.'}</p>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold">Mock Assessment</h2>
                    <p className="text-slate-500">This is a simulated assessment for demonstration purposes.</p>
                    <button onClick={handleFinish} className="btn-primary w-full py-4">Finish & Submit</button>
                </>
            )}
        </div>
    );
};

export default CourseViewer;
