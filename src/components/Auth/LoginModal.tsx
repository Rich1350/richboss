import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { X, Lock, Mail, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginModalProps {
    isOpen: boolean;
    onClose?: () => void; // Optional, as it might be forced open for non-members
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Login successful, auth state listener in parent will handle the rest (e.g. close modal)
        } catch (err: any) {
            console.error(err);
            setError('登录失败：请检查邮箱或密码');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4"
            >
                {/* Backdrop: Dark Luxury Blur */}
                <div
                    className="absolute inset-0 bg-[#0F0F12]/80 backdrop-blur-xl transition-all duration-500"
                    onClick={onClose}
                />

                {/* Modal Card: Glassmorphism */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="relative w-full max-w-md bg-[#0F0F12]/90 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
                >
                    {/* Gold Top Line Accent */}
                    <div className="h-1 w-full bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]" />

                    <div className="p-8 md:p-10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFD700]/20">
                                <Lock className="w-8 h-8 text-[#FFD700]" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                会员登录
                            </h2>
                            <p className="text-gray-400 text-sm">
                                登录以解锁《富老板，穷老板》完整内容
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="邮箱地址"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all font-sans"
                                        required
                                    />
                                </div>

                                <div className="relative group">
                                    <Key className="absolute left-4 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="密码"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]/50 focus:bg-white/10 transition-all font-sans"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                ) : (
                                    "立即登录阅读"
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                还没有账号？{' '}
                                <a href="/register" className="text-[#FFD700] hover:text-[#FDB931] font-medium transition-colors underline-offset-4 hover:underline">
                                    立即注册会员
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Close Button (Optional, mostly for explicit dismissal) */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
