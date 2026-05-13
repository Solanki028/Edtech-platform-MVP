import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        if (user.role === 'admin') return <Navigate to="/admin" />;
        if (user.role === 'student') return <Navigate to="/student" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-aurora">
            <div className="w-full max-w-5xl flex bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-white/20">
                {/* Left Side - Image/Promotion */}
                <div className="hidden lg:block w-1/2 relative bg-blue-600">
                    <img
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Learning"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-900/90"></div>
                    <div className="relative h-full p-12 flex flex-col justify-between text-white">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">M</div>
                            <span className="text-2xl font-extrabold">ManzilChaser.</span>
                        </Link>
                        <div>
                            <h2 className="text-4xl font-bold mb-6">Build your future with global skills.</h2>
                            <p className="text-blue-100 text-lg">Join 10,000+ students learning from industry experts.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
                            </div>
                            <span className="text-sm font-medium">Join our growing community</span>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 p-8 md:p-16">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h1>
                            <p className="text-slate-500">Choose your preferred login method</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium mb-6 animate-shake">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
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
                                <div className="flex justify-between mb-2">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                    <Link to="/forgot-password" weights="font-bold text-xs text-blue-600 hover:underline">Forgot?</Link>
                                </div>
                                <input
                                    type="password"
                                    className="w-full px-5 py-4 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full btn-primary !rounded-xl py-4 mt-4"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-slate-500 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-bold text-blue-600 hover:underline">Create Account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
