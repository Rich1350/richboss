import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, Shield, Check, X, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

interface UserData {
    uid: string;
    email: string;
    isMember: boolean;
    isAdmin?: boolean;
}

export default function Admin() {
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // 1. Auth & Admin Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                navigate("/login");
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists() && userDoc.data().isAdmin === true) {
                    setIsAdmin(true);
                    setCheckingAuth(false);
                    fetchUsers(); // Load data only if admin
                } else {
                    // Not admin, redirect
                    navigate("/");
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                navigate("/");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    // 2. Fetch Users
    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const userList: UserData[] = [];
            querySnapshot.forEach((doc) => {
                // Safe casting with defaults
                const data = doc.data();
                userList.push({
                    uid: doc.id,
                    email: data.email || "No Email",
                    isMember: !!data.isMember,
                    isAdmin: !!data.isAdmin,
                });
            });
            setUsers(userList);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    // 3. Actions
    const toggleMembership = async (uid: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, isMember: !currentStatus } : u));

            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {
                isMember: !currentStatus
            });
        } catch (err) {
            console.error("Update failed:", err);
            // Revert if failed (could add fetchUsers() here to be safe)
            fetchUsers();
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/login");
    };

    if (checkingAuth || loading) {
        return (
            <div className="min-h-screen bg-[#0F0015] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-purple-300" />
                </motion.div>
            </div>
        );
    }

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#0F0015] text-purple-100 font-sans p-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-12 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-900/40 rounded-xl border border-purple-500/20">
                        <Shield className="w-8 h-8 text-[#FFD700]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-purple-400 text-sm">用户与会员管理</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-900/30 hover:bg-purple-900/50 rounded-lg text-purple-300 transition-colors border border-purple-500/10"
                >
                    <LogOut className="w-4 h-4" />
                    退出
                </button>
            </div>

            {/* User Table */}
            <div className="max-w-6xl mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/20 text-purple-300 text-sm uppercase tracking-wider border-b border-white/5">
                                <th className="p-6 font-medium">用户 (UID)</th>
                                <th className="p-6 font-medium">邮箱</th>
                                <th className="p-6 font-medium text-center">状态</th>
                                <th className="p-6 font-medium text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.uid} className="hover:bg-white/5 transition-colors">
                                    <td className="p-6 text-sm font-mono text-purple-400">
                                        {user.uid.slice(0, 8)}...
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <UserIcon className="w-4 h-4 text-purple-300" />
                                            </div>
                                            <span className="text-white font-medium">{user.email}</span>
                                            {user.isAdmin && (
                                                <span className="text-[10px] bg-[#FFD700]/10 text-[#FFD700] px-1.5 py-0.5 rounded border border-[#FFD700]/20">
                                                    ADMIN
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6 text-center">
                                        {user.isMember ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                                <Check className="w-3 h-3" />
                                                会员
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-500/10 text-gray-400 border border-gray-500/20">
                                                <X className="w-3 h-3" />
                                                普通
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => toggleMembership(user.uid, user.isMember)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${user.isMember
                                                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                                                    : "bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 border border-[#FFD700]/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]"
                                                }`}
                                        >
                                            {user.isMember ? "撤销会员" : "开通会员"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-purple-400">
                                        暂无用户数据
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
