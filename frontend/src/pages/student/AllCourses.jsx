import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AllCourses = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const selectedCategory = useMemo(() => {
        return searchParams.get('category') || 'All';
    }, [searchParams]);

    useEffect(() => {
        const query = searchParams.get('search');
        if (query) {
            setSearchQuery(query);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filteredCourses = useMemo(() => {
        let result = courses;
        if (selectedCategory !== 'All') {
            result = result.filter(c => c.category === selectedCategory);
        }
        if (searchQuery) {
            result = result.filter(c => 
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [searchQuery, selectedCategory, courses]);

    const categories = ['All', 'Web Development', 'Data Science', 'AI/ML', 'Digital Marketing', 'Government Exam', 'Study Abroad', 'Kids Learning'];

    const handleCategoryClick = (cat) => {
        if (cat === 'All') {
            setSearchParams({});
        } else {
            setSearchParams({ category: cat });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">Explore Our Programs</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto font-medium">Discover world-class courses designed to help you master new skills and advance your career.</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryClick(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white text-slate-500 hover:bg-blue-50 border border-slate-100'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 px-6 pl-12 shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none font-medium transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 min-h-[400px]">
                    {loading ? (
                        [1,2,3,4,5,6,7,8].map(i => (
                            <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-2 overflow-hidden">
                                <div className="h-56 bg-slate-100 animate-pulse rounded-[2rem]"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-4 bg-slate-100 animate-pulse rounded w-1/2"></div>
                                    <div className="h-6 bg-slate-100 animate-pulse rounded w-3/4"></div>
                                    <div className="h-10 bg-slate-100 animate-pulse rounded"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        filteredCourses.map((course, idx) => (
                            <div 
                                key={course._id} 
                                className="group bg-white rounded-[2.5rem] border border-slate-100 p-2 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col animate-scale-up"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <div className="relative h-56 overflow-hidden rounded-[2rem]">
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[9px] font-black text-blue-600 shadow-sm uppercase tracking-widest">
                                            {course.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="text-yellow-400 text-sm">★</span>
                                        <span className="text-xs font-black text-slate-900">4.9</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">(2.5k)</span>
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1 font-medium leading-relaxed">{course.description}</p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mb-4">
                                        <div>
                                            <span className="text-2xl font-black text-slate-900 tracking-tighter">₹{course.price}</span>
                                            {course.oldPrice && <span className="text-[10px] text-slate-400 line-through font-bold ml-2">₹{course.oldPrice}</span>}
                                        </div>
                                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg">
                                            {course.duration}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link to={`/course/${course._id}`} className="bg-slate-50 text-slate-600 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all text-center">
                                            View Details
                                        </Link>
                                        <Link to={`/checkout/${course._id}`} className="btn-primary !py-3 !px-4 !text-[10px] !rounded-2xl text-center uppercase tracking-widest">
                                            Enroll Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && filteredCourses.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200 animate-fade-in">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">No courses found</h3>
                        <p className="text-slate-500 mt-2 font-medium">Try adjusting your filters or search query.</p>
                        <button onClick={() => handleCategoryClick('All')} className="mt-8 text-blue-600 font-black uppercase tracking-widest text-xs hover:underline">Clear all filters</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllCourses;
