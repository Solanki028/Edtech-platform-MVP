const LeadManagement = ({ leads, hideHeader = false }) => {
    return (
        <div className="overflow-x-auto">
            {!hideHeader && (
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Counseling Leads</h2>
                    <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-bold">
                        {leads.length} Total Leads
                    </span>
                </div>
            )}
            
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-slate-100">
                        <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Name</th>
                        <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Contact</th>
                        <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Interest</th>
                        <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Goal/Msg</th>
                        <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Date</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {leads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4">
                                <div className="font-bold text-slate-900">{lead.name}</div>
                            </td>
                            <td className="py-4">
                                <div className="text-sm text-slate-600">{lead.email}</div>
                                <div className="text-xs text-slate-400">{lead.phone}</div>
                            </td>
                            <td className="py-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">
                                    {lead.courseInterest || 'General'}
                                </span>
                            </td>
                            <td className="py-4 max-w-xs">
                                <div className="text-xs text-slate-500 line-clamp-2 italic">
                                    {lead.message || 'No message provided'}
                                </div>
                            </td>
                            <td className="py-4 text-right">
                                <div className="text-sm text-slate-500">
                                    {new Date(lead.createdAt).toLocaleDateString()}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {leads.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center py-12 text-slate-400 italic">
                                No leads found yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LeadManagement;
