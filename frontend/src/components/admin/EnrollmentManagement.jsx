import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const EnrollmentManagement = () => {
    const { user } = useAuth();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEnrollments = async () => {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/enrollments/admin`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setEnrollments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const handleStatusUpdate = async (id, status, isApproved) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/enrollments/${id}/status`, 
                { status, isApproved },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            fetchEnrollments();
        } catch (error) {
            alert('Status update failed');
        }
    };

    if (loading) return <div className="text-center py-12">Loading transactions...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Course Enrollments & Payments</h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                        {enrollments.filter(e => e.paymentStatus === 'completed').length} Paid
                    </span>
                    <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold">
                        {enrollments.filter(e => e.paymentStatus === 'pending').length} Pending
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Student</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Course</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs">Amount</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-center">Status</th>
                            <th className="pb-4 font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {enrollments.map((e) => (
                            <tr key={e._id} className="hover:bg-slate-50 transition-colors">
                                <td className="py-4">
                                    <div className="font-bold text-slate-900">{e.student?.name}</div>
                                    <div className="text-xs text-slate-400">{e.student?.email}</div>
                                </td>
                                <td className="py-4 font-medium text-slate-700">{e.course?.title}</td>
                                <td className="py-4 font-bold text-slate-900">₹{e.amount}</td>
                                <td className="py-4 text-center">
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider 
                                        ${e.paymentStatus === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {e.paymentStatus}
                                    </span>
                                </td>
                                <td className="py-4 text-right">
                                    <div className="flex justify-end gap-2 text-xs font-bold text-slate-400">
                                        Confirmed ✓
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnrollmentManagement;
