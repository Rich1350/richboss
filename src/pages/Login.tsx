import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("登录成功，正在跳转...");
      setTimeout(() => navigate("/reader"), 500);
    } catch (err: unknown) {
      console.error(err);
      const error = err as { code?: string };
      if (error.code === "auth/invalid-credential") {
        setError("郵箱或密碼錯誤，請重試。");
      } else if (error.code === "auth/invalid-email") {
        setError("邮箱格式不正确。");
      } else {
        setError("登录失败，请稍后重试。");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Force popup to show account selection if preferred, or just default
      provider.setCustomParameters({ prompt: 'select_account' });

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Ensure user doc exists
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        isMember: false,
        isAdmin: false,
        createdAt: new Date()
      }, { merge: true });

      setSuccess("登录成功，正在跳转...");
      // Explicit navigation as backup to App.tsx listener
      navigate("/reader");
    } catch (err: any) {
      console.log(err.code, err.message);
      setError(err.message || "Google 登录失败，请重试");
    } finally {
      setGoogleLoading(false);
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
            <h2 className="text-3xl font-bold mb-2">欢迎回来</h2>
            <p className="text-gray-400 text-sm">登录您的账户，继续阅读之旅</p>
          </div>

          {/* Feedback Messages */}
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

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2 text-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </motion.div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm text-gray-400">密码</label>
                <a
                  href="#"
                  className="text-xs text-[#FFD700]/80 hover:text-[#FFD700]"
                >
                  忘记密码?
                </a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-12 py-3.5 outline-none focus:border-[#FFD700]/50 focus:bg-black/40 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full bg-[#6A1B9A] hover:bg-[#7B1FA2] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-[#6A1B9A]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  登录 <ArrowRight className="w-4 h-4" />
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

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            disabled={loading || googleLoading}
            className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl transition-all hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
          >
            {googleLoading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
                <span>正在连接 Google...</span>
              </div>
            ) : (
              <>
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
                <span>使用 Google 继续</span>
              </>
            )}
          </button>

          <p className="mt-8 text-center text-sm text-gray-500">
            还没有账号?{" "}
            <a href="/register" className="text-[#FFD700] hover:underline font-medium">
              免费注册
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
