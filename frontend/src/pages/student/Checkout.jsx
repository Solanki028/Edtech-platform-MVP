import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`);
                const found = data.find(c => c._id === id);
                setCourse(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        try {
            // Simulate payment processing
            setTimeout(async () => {
                try {
                    await axios.post(`${import.meta.env.VITE_API_URL}/api/enrollments`, {
                        courseId: id,
                        paymentMethod: paymentMethod,
                        transactionId: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase()
                    }, {
                        headers: { Authorization: `Bearer ${user.token}` }
                    });
                    
                    setShowSuccess(true);
                } catch (err) {
                    alert(err.response?.data?.message || 'Enrollment failed');
                    setProcessing(false);
                }
            }, 2000);
        } catch (error) {
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!course) return <div className="min-h-screen flex items-center justify-center">Course not found</div>;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20 relative">
            {/* Success Modal */}
            {showSuccess && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl animate-scale-up border border-slate-100">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 animate-bounce">
                            ✓
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Payment Successful!</h2>
                        <p className="text-slate-500 mb-10 font-medium leading-relaxed">
                            Welcome to the community! Your enrollment is confirmed. Let's start your learning journey and build something amazing together.
                        </p>
                        <button 
                            onClick={() => navigate('/student')}
                            className="w-full btn-primary !rounded-2xl py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200"
                        >
                            Start Your Journey →
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Summary */}
                    <div className="space-y-8">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
                        <div className="card-premium !rounded-[2.5rem] flex gap-5 border border-slate-100">
                            <img src={course.image} alt="" className="w-28 h-28 rounded-3xl object-cover shadow-lg" />
                            <div className="py-1">
                                <h3 className="font-black text-slate-900 text-lg leading-snug">{course.title}</h3>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-2">{course.category}</p>
                                <div className="text-2xl font-black text-slate-900 mt-2 tracking-tighter">₹{course.price}</div>
                            </div>
                        </div>
                        
                        <div className="space-y-5 bg-white p-8 rounded-[2.5rem] border border-slate-100">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Summary</h4>
                            <div className="flex justify-between font-bold text-slate-600">
                                <span>Course Price</span>
                                <span>₹{course.price}</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-600">
                                <span>Platform Fee</span>
                                <span className="text-green-500">FREE</span>
                            </div>
                            <div className="pt-5 border-t border-slate-100 flex justify-between text-2xl font-black text-slate-900 tracking-tighter">
                                <span>Total Amount</span>
                                <span className="text-blue-600">₹{course.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Form */}
                    <div className="card-premium !rounded-[2.5rem] !p-8 space-y-8 border border-slate-100 shadow-xl shadow-blue-500/5">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Select Payment Method</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`p-6 rounded-3xl border-2 transition-all text-center ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-lg shadow-blue-100' : 'border-slate-50 hover:border-slate-200'}`}
                            >
                                <span className="text-3xl block mb-3">💳</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Credit Card</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('upi')}
                                className={`p-6 rounded-3xl border-2 transition-all text-center ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-lg shadow-blue-100' : 'border-slate-50 hover:border-slate-200'}`}
                            >
                                <span className="text-3xl block mb-3">📱</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">UPI ID</span>
                            </button>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-6">
                            {paymentMethod === 'card' ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-2">Card Number</label>
                                        <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" placeholder="•••• •••• •••• ••••" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-2">Expiry Date</label>
                                            <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" placeholder="MM/YY" required />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-2">CVV</label>
                                            <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" placeholder="•••" required />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-2">UPI Identifier</label>
                                    <input className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold" placeholder="username@upi" required />
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full btn-primary !rounded-2xl py-4 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:-translate-y-1 transition-transform"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Securing Payment...
                                    </>
                                ) : `Confirm & Pay ₹${course.price}`}
                            </button>
                        </form>
                        
                        <div className="pt-4 flex items-center justify-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <span className="text-blue-500">🛡️</span> Secure Global Payment
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
