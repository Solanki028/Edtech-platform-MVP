const AdminStats = ({ analytics }) => {
    if (!analytics) return null;

    const stats = [
        {
            title: "Total Users",
            value: analytics.totalUsers,
            subtext: `${analytics.totalStudents} Students Enrolled`,
            icon: "👥",
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Total Courses",
            value: analytics.totalCourses,
            subtext: "Live on platform",
            icon: "📚",
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Learning Content",
            value: analytics.totalChapters,
            subtext: "Chapters published",
            icon: "⚡",
            color: "bg-violet-50 text-violet-600"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="card-premium flex items-center gap-6 group hover:-translate-y-1 transition-all duration-300">
                    <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                        {stat.icon}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.title}</div>
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-1">{stat.subtext}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;
