import { motion } from "framer-motion";
import { BookOpen, ChevronRight, X, Check, TrendingUp, Clock, Shield } from "lucide-react";
import bookCover from "../assets/cover.jpeg"; // Imported from assets as requested

// UI Architect Components

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl ${className}`}>
    {children}
  </div>
);

const GoldButton = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a
    href={href}
    className="group relative w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FDB931] text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
  >
    <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
    <span className="relative flex items-center gap-2">{children}</span>
  </a>
);

const GhostButton = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a
    href={href}
    className="w-full md:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-medium text-lg rounded-xl hover:bg-white/5 hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2"
  >
    {children}
  </a>
);

const MindsetCard = ({ type, title, items }: { type: "poor" | "rich"; title: string; items: string[] }) => {
  const isRich = type === "rich";
  return (
    <GlassCard className={`p-8 md:p-12 h-full relative overflow-hidden transition-transform duration-500 hover:scale-[1.02] ${isRich ? 'border-[#FFD700]/30' : 'border-white/5'}`}>
      {isRich && (
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FFD700]/10 rounded-full blur-3xl pointer-events-none" />
      )}
      <div className="flex items-center gap-4 mb-8">
        <div className={`p-3 rounded-full ${isRich ? 'bg-[#FFD700]/20 text-[#FFD700]' : 'bg-gray-500/10 text-gray-400'}`}>
          {isRich ? <TrendingUp className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
        </div>
        <h3 className={`text-2xl font-bold ${isRich ? 'text-white' : 'text-gray-400'}`}>{title}</h3>
      </div>

      <ul className="space-y-6">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            {isRich ? (
              <Check className="w-5 h-5 text-[#FFD700] mt-1 shrink-0" />
            ) : (
              <X className="w-5 h-5 text-gray-600 mt-1 shrink-0" />
            )}
            <span className={`text-lg leading-relaxed ${isRich ? 'text-gray-200' : 'text-gray-500'}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F0F12] text-white font-sans selection:bg-[#7C3AED]/30 selection:text-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-[#0F0F12]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent flex items-center gap-2">
            RichBoss
          </span>
          <a href="/login" className="text-sm font-medium text-gray-400 hover:text-[#FFD700] transition-colors">
            会员登录
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Ambient Light (Purple Accent #7C3AED) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-24">

          {/* Left Content */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-[#FFD700] text-xs font-bold tracking-widest uppercase mb-8">
              Rich Boss, Poor Boss
            </div>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-8">
              <span className="text-gray-600">穷老板</span>忙执行<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]">富老板</span>
              做决策
            </h1>
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0 mb-12">
              努力不再是拼时长。建立底层认知结构，掌握财富的杠杆。
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start items-center w-full md:w-auto">
              <GoldButton href="/reader">
                <BookOpen className="w-5 h-5" />
                立即免费试读
              </GoldButton>
              <GhostButton href="/register">
                加入会员体系
                <ChevronRight className="w-4 h-4 ml-1" />
              </GhostButton>
            </div>
            <p className="mt-6 text-sm text-gray-600">
              支持微信直接阅读 · 10,000+ 创业者已加入
            </p>
          </motion.div>

          {/* Right Image (Book Cover) */}
          <motion.div
            className="flex-1 w-full max-w-[400px] md:max-w-[500px]"
            initial={{ opacity: 0, x: 20, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ perspective: 1000 }}
          >
            <div className="relative group transition-transform duration-500 hover:scale-[1.02] hover:rotate-y-[-5deg] rounded-lg shadow-2xl shadow-[#7C3AED]/20">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[#7C3AED]/20 via-transparent to-[#FFD700]/20 rounded-lg blur opacity-50"></div>
              <img
                src={bookCover}
                alt="Rich Boss Book Cover"
                className="relative w-full h-auto rounded-lg border border-white/10"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* The Mindset Contrast */}
      <section className="py-24 md:py-32 px-6 relative border-t border-white/5 bg-[#0F0F12]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">你站在哪一边？</h2>
            <p className="text-gray-400 text-lg">大多数人的勤奋，只是为了掩盖思维上的懒惰。</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <MindsetCard
                type="poor"
                title="穷老板思维"
                items={[
                  "认为时间就是金钱，习惯亲力亲为",
                  "过度关注细节，忽略整体结构",
                  "遇到问题先想“怎么做”，而不是“为什么”",
                  "害怕风险，追求确定性收益",
                  "把员工当成本，而不是资产"
                ]}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <MindsetCard
                type="rich"
                title="富老板思维"
                items={[
                  "用钱买时间，专注高价值决策",
                  "通过设计系统来解决重复性问题",
                  "关注杠杆效应，善用复利思维",
                  "管理风险，而不是规避风险",
                  "拥有选择权，而不仅仅是财富"
                ]}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "深度阅读", value: "200k+" },
              { label: "付费会员", value: "10k+" },
              { label: "好评率", value: "99%" },
              { label: "实战案例", value: "500+" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-500 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <Shield className="w-12 h-12 text-[#FFD700] mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            打破认知的边界
          </h2>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            这不仅是一本书，更是一套经得起时间考验的财富操作系统。
            <br className="hidden md:block" />
            现在开始，升级你的底层逻辑。
          </p>
          <div className="flex justify-center w-full md:w-auto">
            <GoldButton href="/reader">
              开始免费试读前两章
            </GoldButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm bg-[#0F0F12]">
        <p>© 2026 RichBoss. All rights reserved.</p>
      </footer>
    </div>
  );
}
