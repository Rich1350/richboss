import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, UserPlus } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("两次输入的密码不一致");
            return;
        }

        if (password.length < 6) {
            setError("密码长度至少为6位");
            return;
        }

        setLoading(true);
        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Create Firestore User Document with Membership
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                isMember: true,
                bgCode: null,
                createdAt: serverTimestamp()
            });

            // 3. Navigate to Reader
            navigate("/reader");
        } catch (err: unknown) {
            console.error(err);
            const error = err as { code?: string };
            if (error.code === "auth/email-already-in-use") {
                setError("该邮箱已被注册");
            } else if (error.code === "auth/invalid-email") {
                setError("邮箱格式不正确");
            } else if (error.code === "auth/weak-password") {
                setError("密码强度太低");
            } else {
                setError("注册失败，请稍后重试");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            const user = result.user;

            // Update/Ensure user doc exists (optional merge logic or just set)
            // Usually prefer setup logic, but for now simple set is okay or check exist
            // Here we just ensure membership for Google sign-ins too? 
            // User request implies registration flow enables membership. 
            // For consistency, let's treat Google Sign-in here as "Registering" too

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                isMember: true, // Grant membership on registration
                bgCode: null,
            }, { merge: true });

            navigate("/reader");
        } catch (err: unknown) {
            console.error(err);
            setError("Google 登录/注册失败，请重试");
        }
    };

    return (
        <div className="min-h-screen bg-[#0F0015] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#6A1B9A]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#FFD700]/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-md relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <Link
                            to="/"
                            className="inline-block mb-4 text-[#FFD700] hover:text-white transition-colors"
                        >
                            <span className="text-2xl font-bold tracking-tight">
                                RichBoss
                            </span>
                        </Link>
                        <h2 className="text-3xl font-bold mb-2">加入会员</h2>
                        <p className="text-gray-400 text-sm">注册即享全书阅读权限</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm"
                        >
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">电子邮箱</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 outline-none focus:border-[#FFD700]/50 focus:bg-black/40 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">密码</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="设置密码 (至少6位)"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 outline-none focus:border-[#FFD700]/50 focus:bg-black/40 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400 ml-1">确认密码</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="再次输入密码"
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 outline-none focus:border-[#FFD700]/50 focus:bg-black/40 transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#FFD700] to-[#FDB931] hover:from-[#FDB931] hover:to-[#FFD700] text-black font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#FFD700]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" /> 立即注册
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-8 flex items-center gap-4">
                        <div className="h-[1px] bg-white/10 flex-1" />
                        <span className="text-xs text-gray-500 uppercase tracking-widest">
                            或者
                        </span>
                        <div className="h-[1px] bg-white/10 flex-1" />
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl transition-all hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        使用 Google 注册
                    </button>

                    <p className="mt-8 text-center text-sm text-gray-500">
                        已有账号?{" "}
                        <Link to="/login" className="text-[#FFD700] hover:underline font-medium">
                            立即登录
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
