import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Icon = ({ type, className = 'h-6 w-6' }) => {
    const common = {
        className,
        fill: 'none',
        viewBox: '0 0 24 24',
        stroke: 'currentColor',
        strokeWidth: '1.8',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
    };

    const icons = {
        code: (
            <svg {...common}>
                <path d="m8 9-3 3 3 3" />
                <path d="m16 9 3 3-3 3" />
                <path d="m14 5-4 14" />
            </svg>
        ),
        data: (
            <svg {...common}>
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M8 15v-4" />
                <path d="M12 15V8" />
                <path d="M16 15v-6" />
            </svg>
        ),
        growth: (
            <svg {...common}>
                <path d="M4 17 10 11l4 4 6-8" />
                <path d="M14 7h6v6" />
            </svg>
        ),
        design: (
            <svg {...common}>
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
        ),
        mentor: (
            <svg {...common}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 8v6" />
                <path d="M23 11h-6" />
            </svg>
        ),
        certificate: (
            <svg {...common}>
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 4h10v6a5 5 0 0 1-10 0Z" />
                <path d="M5 6H3v3a3 3 0 0 0 4 2.8" />
                <path d="M19 6h2v3a3 3 0 0 1-4 2.8" />
            </svg>
        ),
        project: (
            <svg {...common}>
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="M7 8h6" />
                <path d="M7 12h10" />
                <path d="M7 16h4" />
            </svg>
        ),
        support: (
            <svg {...common}>
                <path d="M12 3a8 8 0 0 0-8 8v3a3 3 0 0 0 3 3h1v-6H5" />
                <path d="M12 3a8 8 0 0 1 8 8v3a3 3 0 0 1-3 3h-1v-6h3" />
                <path d="M9 20h3a4 4 0 0 0 4-4" />
            </svg>
        ),
    };

    return icons[type] || icons.code;
};

const categories = [
    { name: 'Full Stack Development', count: '24 programs', tone: 'bg-[#edf6f0] text-[#3f6f5f] border-[#d7eadf]', icon: 'code' },
    { name: 'Data Science & AI', count: '18 programs', tone: 'bg-[#ecf4f5] text-[#2f6f73] border-[#d4e8ea]', icon: 'data' },
    { name: 'Digital Marketing', count: '15 programs', tone: 'bg-[#fff3e6] text-[#a45f36] border-[#f4dfc8]', icon: 'growth' },
    { name: 'UI/UX & Product Design', count: '12 programs', tone: 'bg-[#f3edf7] text-[#705384] border-[#e3d7ea]', icon: 'design' },
];

const outcomes = [
    { value: '10k+', label: 'Learners trained' },
    { value: '92%', label: 'Completion support rate' },
    { value: '150+', label: 'Hiring and project partners' },
    { value: '4.8/5', label: 'Average learner rating' },
];

const universitiesAndPartners = [
    'Harvard Online', 'Stanford Online', 'MIT Open Learning', 'Oxford Learning', 'Cambridge Digital',
    'Google Cloud', 'Microsoft Learn', 'IBM SkillsBuild', 'AWS Academy', 'Meta Blueprint',
    'Coursera', 'edX', 'HubSpot Academy', 'Notion Campus', 'Figma Education',
];

const learningPath = [
    {
        title: 'Skill Assessment',
        desc: 'Start with a short diagnostic so mentors can recommend the right course level and weekly target.',
        icon: 'data',
    },
    {
        title: 'Live Cohort Learning',
        desc: 'Learn through instructor-led classes, guided labs, peer discussions, and recorded revision sessions.',
        icon: 'mentor',
    },
    {
        title: 'Project Portfolio',
        desc: 'Build job-ready projects with code reviews, design feedback, documentation, and presentation practice.',
        icon: 'project',
    },
    {
        title: 'Career Readiness',
        desc: 'Get resume reviews, interview preparation, internship guidance, and direct visibility into opportunities.',
        icon: 'certificate',
    },
];

const platformFeatures = [
    { title: 'Progress dashboard', desc: 'Track chapters, certificates, assignments, and learning milestones.', icon: 'data' },
    { title: 'Mentor office hours', desc: 'Join live doubt rooms and weekly review sessions with experts.', icon: 'mentor' },
    { title: 'Project submissions', desc: 'Submit practical work and receive structured improvement feedback.', icon: 'project' },
    { title: 'Career support', desc: 'Prepare resumes, interviews, internships, and opportunity readiness.', icon: 'support' },
];

const testimonials = [
    {
        name: 'Aarav Mehta',
        role: 'Placed as Junior Developer',
        quote: 'The projects felt close to real work. By the time interviews started, I had something meaningful to show.',
    },
    {
        name: 'Sneha Rao',
        role: 'Data Analytics Learner',
        quote: 'Mentor feedback and weekly targets helped me stay consistent while managing college classes.',
    },
    {
        name: 'Kabir Sharma',
        role: 'Career Switcher',
        quote: 'The roadmap was clear from day one, and the platform made it easy to track what to do next.',
    },
];

const fallbackCourses = [
    {
        _id: 'full-stack-career-track',
        title: 'Full Stack Career Track',
        category: 'Web Development',
        description: 'Master React, Node, databases, deployment, and production workflows through guided projects.',
        price: '24999',
        oldPrice: '34999',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=85',
    },
    {
        _id: 'data-analytics-ai',
        title: 'Data Analytics with AI',
        category: 'Data Science',
        description: 'Learn spreadsheets, SQL, Python, dashboards, and applied AI workflows for business problems.',
        price: '19999',
        oldPrice: '28999',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85',
    },
    {
        _id: 'digital-growth-marketing',
        title: 'Digital Growth Marketing',
        category: 'Marketing',
        description: 'Build practical skills in SEO, ads, analytics, content systems, and campaign optimization.',
        price: '14999',
        oldPrice: '21999',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85',
    },
    {
        _id: 'ui-ux-product-design',
        title: 'UI/UX Product Design',
        category: 'Design',
        description: 'Create research-backed interfaces, wireframes, prototypes, and a polished product case study.',
        price: '17999',
        oldPrice: '24999',
        image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=85',
    },
];

const formatPrice = (value) => {
    if (!value) return 'Contact us';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return `Rs. ${value}`;
    return `Rs. ${numericValue.toLocaleString('en-IN')}`;
};

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [leadData, setLeadData] = useState({
        name: '',
        email: '',
        phone: '',
        courseInterest: 'Interested program',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

            try {
                const { data } = await axios.get(`${apiUrl}/api/courses`);
                setCourses(Array.isArray(data) ? data.slice(0, 4) : []);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            await axios.post(`${apiUrl}/api/leads`, leadData);
            setSubmitStatus('success');
            setLeadData({ name: '', email: '', phone: '', courseInterest: 'Interested program', message: '' });
            setTimeout(() => setSubmitStatus(null), 5000);
        } catch (error) {
            console.error('Lead submission error:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const visibleCourses = courses.length > 0 ? courses : fallbackCourses;
    const marqueeItems = [...universitiesAndPartners, ...universitiesAndPartners];

    return (
        <div className="overflow-hidden bg-[#f7f4ee] text-[#24312f]">
            <section className="relative mt-20 flex min-h-[calc(100vh-5rem)] items-center bg-[#dfe9e3]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(192,132,94,0.22),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(47,111,115,0.2),transparent_30%)]"></div>

                <div className="container relative mx-auto px-6 py-8 lg:py-10">
                    <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#b9cec5] bg-white/55 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#3f6f5f] shadow-sm">
                                <span className="h-2 w-2 rounded-full bg-[#c9845f]"></span>
                                Industry-led online learning platform
                            </div>
                            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-normal text-[#20312d] sm:text-5xl xl:text-[4rem]">
                                Learn calm, build sharp, grow with real career skills.
                            </h1>
                            <p className="mt-5 max-w-2xl text-base leading-7 text-[#556b64] sm:text-lg">
                                ManzilChaser helps students, graduates, and working professionals learn technology, business,
                                and design through mentor-led cohorts, practical projects, and career support.
                            </p>

                            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/courses"
                                    className="rounded-lg bg-[#2f6f73] px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-[#2f6f73]/20 transition hover:bg-[#275d61]"
                                >
                                    Explore Programs
                                </Link>
                                <a
                                    href="#counselling"
                                    className="rounded-lg border border-[#9db8ae] bg-white/55 px-6 py-3 text-center text-sm font-bold text-[#2f6f73] transition hover:bg-white"
                                >
                                    Book Free Counselling
                                </a>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-2xl shadow-[#58756b]/15 backdrop-blur-md">
                            <div className="overflow-hidden rounded-xl bg-[#fbfaf6]">
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=90"
                                    alt="Students learning together with laptops"
                                    className="h-44 w-full object-cover lg:h-52"
                                />
                                <div className="p-5 lg:p-4">
                                    <div className="flex items-center justify-between border-b border-[#e4ded2] pb-3">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a45f36]">Today on ManzilChaser</p>
                                            <h2 className="mt-1 text-xl font-bold text-[#20312d]">Learner Progress</h2>
                                        </div>
                                        <span className="rounded-lg bg-[#edf6f0] px-3 py-1 text-xs font-bold text-[#3f6f5f]">Live</span>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        {[
                                            { label: 'React project review', value: '86%' },
                                            { label: 'SQL assessment', value: '74%' },
                                            { label: 'Mock interview prep', value: '68%' },
                                        ].map((item) => (
                                            <div key={item.label}>
                                                <div className="mb-2 flex items-center justify-between text-sm font-semibold text-[#20312d]">
                                                    <span>{item.label}</span>
                                                    <span className="text-[#6f817b]">{item.value}</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-[#e6e1d7]">
                                                    <div className="h-2 rounded-full bg-[#c9845f]" style={{ width: item.value }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <div className="rounded-lg border border-[#e4ded2] bg-[#f7f4ee] p-3">
                                            <p className="text-2xl font-extrabold text-[#20312d]">18</p>
                                            <p className="mt-1 text-xs font-semibold text-[#6f817b]">Live cohorts</p>
                                        </div>
                                        <div className="rounded-lg border border-[#e4ded2] bg-[#f7f4ee] p-3">
                                            <p className="text-2xl font-extrabold text-[#20312d]">42</p>
                                            <p className="mt-1 text-xs font-semibold text-[#6f817b]">Mentor sessions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-[#e4ded2] bg-[#fbfaf6] py-8">
                <div className="container mx-auto grid grid-cols-2 gap-4 px-6 md:grid-cols-4">
                    {outcomes.map((item) => (
                        <div key={item.label} className="rounded-xl border border-[#e4ded2] bg-white/70 p-5 text-center shadow-sm">
                            <p className="text-2xl font-extrabold text-[#20312d]">{item.value}</p>
                            <p className="mt-1 text-sm font-medium text-[#6f817b]">{item.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-[#f7f4ee] py-16">
                <div className="container mx-auto px-6">
                    <div className="mb-8 flex flex-col gap-3 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a45f36]">Top Universities & Partners</p>
                        <h2 className="text-3xl font-extrabold text-[#20312d] sm:text-4xl">A learning ecosystem connected to trusted names.</h2>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-[#e4ded2] bg-[#fbfaf6] py-5 shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#fbfaf6] to-transparent"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#fbfaf6] to-transparent"></div>
                        <div className="partner-marquee-track flex w-max gap-4">
                            {marqueeItems.map((partner, index) => (
                                <div
                                    key={`${partner}-${index}`}
                                    className="flex min-w-[190px] items-center justify-center rounded-xl border border-[#e4ded2] bg-white px-5 py-4 text-sm font-extrabold text-[#4d625b] shadow-sm"
                                >
                                    {partner}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#fbfaf6] py-20">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a45f36]">What we offer</p>
                        <h2 className="mt-3 text-3xl font-extrabold text-[#20312d] sm:text-4xl">One platform for learning, practice, and career growth.</h2>
                        <p className="mt-4 text-[#6f817b]">
                            Visitors should instantly understand the company: practical education, guided learning,
                            calm structure, and measurable outcomes.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                                className="group rounded-xl border border-[#e4ded2] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#58756b]/10"
                            >
                                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl border ${cat.tone}`}>
                                    <Icon type={cat.icon} />
                                </div>
                                <h3 className="text-lg font-bold text-[#20312d]">{cat.name}</h3>
                                <p className="mt-2 text-sm font-medium text-[#6f817b]">{cat.count}</p>
                                <p className="mt-5 text-sm font-bold text-[#2f6f73] group-hover:text-[#a45f36]">View learning path</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#e8efea] py-20">
                <div className="container mx-auto px-6">
                    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a45f36]">Learning model</p>
                            <h2 className="mt-3 text-3xl font-extrabold text-[#20312d] sm:text-4xl">A clear path from first class to career confidence.</h2>
                            <p className="mt-4 leading-7 text-[#586d66]">
                                Every program is designed around outcomes, not just videos. Learners move through assessment,
                                guided classes, practical submissions, and career preparation with visible progress.
                            </p>
                            <div className="mt-8 rounded-xl bg-[#20312d] p-6 text-white">
                                <p className="text-sm font-semibold text-[#b9cec5]">Best for</p>
                                <p className="mt-2 text-2xl font-bold">Students, freshers, and professionals who want structured learning with accountability.</p>
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {learningPath.map((item, index) => (
                                <div key={item.title} className="rounded-xl border border-[#d5e2dc] bg-[#fbfaf6] p-6 shadow-sm">
                                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2f6f73] text-white">
                                        <Icon type={item.icon} className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#a45f36]">Step {index + 1}</p>
                                    <h3 className="mt-2 text-lg font-bold text-[#20312d]">{item.title}</h3>
                                    <p className="mt-3 text-sm leading-6 text-[#586d66]">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f7f4ee] py-20">
                <div className="container mx-auto px-6">
                    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a45f36]">Featured programs</p>
                            <h2 className="mt-3 text-3xl font-extrabold text-[#20312d] sm:text-4xl">Start with a practical career track.</h2>
                            <p className="mt-3 max-w-2xl text-[#6f817b]">Explore programs built around live learning, projects, mentorship, and certificates.</p>
                        </div>
                        <Link to="/courses" className="text-sm font-bold text-[#2f6f73] hover:text-[#a45f36]">
                            View all courses
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {loading
                            ? [1, 2, 3, 4].map((item) => (
                                <div key={item} className="h-96 animate-pulse rounded-xl bg-[#e4ded2]"></div>
                            ))
                            : visibleCourses.map((course) => (
                                <article key={course._id} className="overflow-hidden rounded-xl border border-[#e4ded2] bg-[#fbfaf6] shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#58756b]/10">
                                    <div className="h-48 overflow-hidden bg-[#e4ded2]">
                                        <img
                                            src={course.image || fallbackCourses[0].image}
                                            alt={course.title}
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <span className="rounded-lg bg-[#edf6f0] px-3 py-1 text-xs font-bold text-[#3f6f5f]">{course.category || 'Program'}</span>
                                        <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-xl font-bold text-[#20312d]">{course.title}</h3>
                                        <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-[#6f817b]">{course.description}</p>
                                        <div className="mt-5 flex items-center justify-between border-t border-[#e4ded2] pt-4">
                                            <div>
                                                <p className="text-lg font-extrabold text-[#20312d]">{formatPrice(course.price)}</p>
                                                {course.oldPrice && <p className="text-xs font-semibold text-[#8c9a95] line-through">{formatPrice(course.oldPrice)}</p>}
                                            </div>
                                            <Link
                                                to={courses.length > 0 ? `/course/${course._id}` : '/courses'}
                                                className="rounded-lg bg-[#20312d] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2f6f73]"
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                    </div>
                </div>
            </section>

            <section className="bg-[#20312d] py-20 text-white">
                <div className="container mx-auto px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#e8bd94]">Platform experience</p>
                            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Built for serious learners and education teams.</h2>
                            <p className="mt-4 leading-7 text-[#d5e2dc]">
                                ManzilChaser combines learner experience, course delivery, admin control, progress tracking,
                                enrollments, and certification into one clean learning system.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {platformFeatures.map((feature) => (
                                <div key={feature.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8bd94] text-[#20312d]">
                                        <Icon type={feature.icon} className="h-5 w-5" />
                                    </div>
                                    <h3 className="font-bold text-white">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-[#d5e2dc]">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#fbfaf6] py-20">
                <div className="container mx-auto px-6">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a45f36]">Learner stories</p>
                        <h2 className="mt-3 text-3xl font-extrabold text-[#20312d] sm:text-4xl">A professional learning environment people can trust.</h2>
                    </div>
                    <div className="mt-12 grid gap-5 md:grid-cols-3">
                        {testimonials.map((item) => (
                            <figure key={item.name} className="rounded-xl border border-[#e4ded2] bg-white p-6 shadow-sm">
                                <blockquote className="text-sm leading-7 text-[#586d66]">"{item.quote}"</blockquote>
                                <figcaption className="mt-6 border-t border-[#e4ded2] pt-4">
                                    <p className="font-bold text-[#20312d]">{item.name}</p>
                                    <p className="text-sm font-medium text-[#2f6f73]">{item.role}</p>
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </div>
            </section>

            <section id="counselling" className="bg-[#c9845f] py-20">
                <div className="container mx-auto px-6">
                    <div className="grid gap-10 rounded-2xl bg-[#fbfaf6] p-6 shadow-2xl shadow-[#8f4f30]/20 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a45f36]">Free counselling</p>
                            <h2 className="mt-3 text-3xl font-extrabold text-[#20312d] sm:text-4xl">Find the right program before you enroll.</h2>
                            <p className="mt-4 leading-7 text-[#6f817b]">
                                Share your goal and our academic team will help you choose a course, understand the roadmap,
                                and plan the next step.
                            </p>
                        </div>
                        <form onSubmit={handleLeadSubmit} className="grid gap-4 sm:grid-cols-2">
                            <input
                                type="text"
                                placeholder="Full name"
                                className="rounded-lg border border-[#d9d0c3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2f6f73] focus:ring-4 focus:ring-[#d5e2dc]"
                                value={leadData.name}
                                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email address"
                                className="rounded-lg border border-[#d9d0c3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2f6f73] focus:ring-4 focus:ring-[#d5e2dc]"
                                value={leadData.email}
                                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone number"
                                className="rounded-lg border border-[#d9d0c3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2f6f73] focus:ring-4 focus:ring-[#d5e2dc]"
                                value={leadData.phone}
                                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                                required
                            />
                            <select
                                className="rounded-lg border border-[#d9d0c3] bg-white px-4 py-3 text-sm text-[#6f817b] outline-none transition focus:border-[#2f6f73] focus:ring-4 focus:ring-[#d5e2dc]"
                                value={leadData.courseInterest}
                                onChange={(e) => setLeadData({ ...leadData, courseInterest: e.target.value })}
                            >
                                <option>Interested program</option>
                                <option>Full Stack Development</option>
                                <option>Data Science & AI</option>
                                <option>Digital Marketing</option>
                                <option>UI/UX Design</option>
                            </select>
                            <textarea
                                placeholder="Tell us about your career goals..."
                                className="min-h-[100px] rounded-lg border border-[#d9d0c3] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2f6f73] focus:ring-4 focus:ring-[#d5e2dc] sm:col-span-2"
                                value={leadData.message}
                                onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                            ></textarea>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="rounded-lg bg-[#20312d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2f6f73] disabled:opacity-50 sm:col-span-2"
                            >
                                {isSubmitting ? 'Sending...' : 'Request a Call Back'}
                            </button>
                            {submitStatus === 'success' && <p className="text-sm font-bold text-[#3f6f5f] sm:col-span-2">Great. We will reach out to you soon.</p>}
                            {submitStatus === 'error' && <p className="text-sm font-bold text-rose-700 sm:col-span-2">Something went wrong. Please try again.</p>}
                        </form>
                    </div>
                </div>
            </section>

            <section className="bg-[#f7f4ee] py-20">
                <div className="container mx-auto px-6">
                    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#a45f36]">Questions</p>
                            <h2 className="mt-3 text-3xl font-extrabold text-[#20312d] sm:text-4xl">What visitors should know first.</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                ['Are the classes live or recorded?', 'Programs include live classes, recorded revision access, assignments, and mentor-led doubt support.'],
                                ['Do learners receive certificates?', 'Yes. Learners receive certificates after completing the required modules, projects, and assessments.'],
                                ['Is career support included?', 'Career-focused programs include portfolio guidance, resume feedback, mock interviews, and opportunity support.'],
                            ].map(([question, answer]) => (
                                <div key={question} className="rounded-xl border border-[#e4ded2] bg-[#fbfaf6] p-5">
                                    <h3 className="font-bold text-[#20312d]">{question}</h3>
                                    <p className="mt-2 text-sm leading-6 text-[#6f817b]">{answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-[#20312d] py-14 text-[#d5e2dc]">
                <div className="container mx-auto px-6">
                    <div className="grid gap-10 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#c9845f] text-xl font-extrabold text-white">M</div>
                                <span className="text-2xl font-extrabold text-white">ManzilChaser.</span>
                            </div>
                            <p className="mt-5 max-w-md text-sm leading-7">
                                ManzilChaser helps learners build practical skills through structured courses,
                                mentorship, projects, and career preparation.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Explore</h4>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li><Link to="/courses" className="hover:text-white">All Courses</Link></li>
                                <li><Link to="/register" className="hover:text-white">Join Now</Link></li>
                                <li><Link to="/login" className="hover:text-white">Student Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Contact</h4>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>info@ilp.edu</li>
                                <li>+91 98765 43210</li>
                                <li>HSR Layout, Bangalore</li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-[#9db8ae]">
                        Copyright 2026 Internship Learning Platform. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
