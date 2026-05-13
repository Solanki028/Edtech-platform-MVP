import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const { register, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin" />;
        if (user.role === 'student') return <Navigate to="/student" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData.name, formData.email, formData.password, 'student');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-aurora">
            <div className="w-full max-w-5xl flex bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
                {/* Left Side - Image/Promotion */}
                <div className="hidden lg:block w-1/2 relative bg-blue-600">
                    <img
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Join ManzilChaser"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/80 to-violet-900/90"></div>
                    <div className="relative h-full p-12 flex flex-col justify-between text-white">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">M</div>
                            <span className="text-2xl font-extrabold">ManzilChaser.</span>
                        </Link>
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Join the future of learning.</h2>
                            <p className="text-blue-100 text-lg">Create your free account and start your journey with industry experts today.</p>
                        </div>
                        <div className="p-6 glass rounded-2xl">
                            <p className="text-sm italic font-medium">"This platform changed my career path. The mentorship is world-class!"</p>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="w-10 h-10 rounded-full bg-slate-200" />
                                <div>
                                    <div className="text-sm font-bold">Sarah Jenkins</div>
                                    <div className="text-xs text-blue-200">Product Designer @ Google</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10 text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
                            <p className="text-slate-500">Join our community of global learners</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="name@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex items-start gap-3 py-2">
                                <input type="checkbox" className="mt-1 rounded text-blue-600 focus:ring-blue-500" required />
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    I agree to the <Link to="/terms" className="text-blue-600 font-bold hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 font-bold hover:underline">Privacy Policy</Link>.
                                </p>
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary !rounded-xl py-4"
                            >
                                Get Started
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="font-bold text-blue-600 hover:underline">Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
