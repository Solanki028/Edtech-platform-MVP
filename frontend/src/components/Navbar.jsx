import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const categories = [
        { name: 'Web Development', icon: '🌐' },
        { name: 'Data Science', icon: '📊' },
        { name: 'AI/ML', icon: '🤖' },
        { name: 'Digital Marketing', icon: '📈' },
        { name: 'Government Exam', icon: '🏛️' },
        { name: 'Study Abroad', icon: '✈️' },
        { name: 'Kids Learning', icon: '👶' },
    ];

    // On non-homepage, we want the navbar to always be visible/glassy
    const navbarClass = `fixed top-0 w-full z-[1000] transition-all duration-300 ${
        (isScrolled || !isHomePage) 
        ? 'glass shadow-lg py-2 border-b border-slate-200/50' 
        : 'bg-transparent py-4'
    }`;

    return (
        <nav className={navbarClass}>
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center gap-8">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:rotate-12 transition-transform">
                            M
                        </div>
                        <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                            ManzilChaser<span className="text-blue-600">.</span>
                        </span>
                    </Link>

                    {/* Search Bar - Desktop */}
                    <div className="hidden lg:flex flex-1 max-w-md relative">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full bg-slate-100/50 border border-transparent rounded-full py-2.5 px-6 pl-12 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
                                }
                            }}
                        />
                        <svg 
                            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            onClick={() => {
                                if (searchQuery.trim()) {
                                    navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
                                }
                            }}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden xl:flex items-center gap-6">
                        <Link to="/" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Home</Link>
                        <div className="relative group py-4">
                            <button className="text-sm font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1">
                                Categories <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 glass rounded-2xl p-4 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                {categories.map((cat) => (
                                    <Link 
                                        key={cat.name} 
                                        to={`/courses?category=${encodeURIComponent(cat.name)}`} 
                                        className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-xl transition-colors group/item"
                                    >
                                        <span className="text-lg">{cat.icon}</span>
                                        <span className="text-sm font-bold text-slate-700 group-hover/item:text-blue-600">{cat.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link to="/courses" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Courses</Link>
                    </div>

                    {/* Auth Actions */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-700 hover:text-blue-600 px-4">Login</Link>
                                <Link to="/register" className="btn-primary !py-2.5 !px-6 !text-sm whitespace-nowrap">
                                    Join Now
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/student'}
                                    className="flex items-center gap-3 p-1 pr-4 bg-slate-100 rounded-full hover:bg-blue-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                        {user.name?.[0] || 'U'}
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 hidden sm:block">{user.role === 'admin' ? 'Admin' : 'Dashboard'}</span>
                                </Link>
                                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        
                        {/* Mobile Toggle */}
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="xl:hidden p-2 text-slate-600">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`xl:hidden absolute top-full left-0 w-full glass shadow-2xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen border-t' : 'max-h-0'}`}>
                <div className="p-6 space-y-6">
                    <div className="flex flex-col gap-4">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Home</Link>
                        <div>
                            <div className="text-lg font-bold mb-4">Categories</div>
                            <div className="grid grid-cols-1 gap-2 pl-4">
                                {categories.map(cat => (
                                    <Link 
                                        key={cat.name} 
                                        to={`/courses?category=${encodeURIComponent(cat.name)}`} 
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-slate-600 font-medium py-1"
                                    >
                                        {cat.icon} {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link to="/courses" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">Courses</Link>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold">About Us</Link>
                    </div>
                    {user && (
                        <div className="pt-6 border-t">
                             <Link to={user.role === 'admin' ? '/admin' : '/student'} onClick={() => setIsMenuOpen(false)} className="w-full btn-primary block text-center">Go to Dashboard</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
