import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Settings,
    Moon,
    Sun,
    Type,
    Lock,
    ChevronLeft,
    ChevronRight,
    Home,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

interface Chapter {
    title: string;
    content: string[];
    isLocked: boolean;
}

const Reader = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Settings State
    const [fontSize, setFontSize] = useState(18);
    const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('dark');

    // Member State (Mock)
    const [isMember, setIsMember] = useState(false);

    // Initial Load & Parsing
    useEffect(() => {
        fetch('/book.txt')
            .then(res => res.text())
            .then(text => {
                const lines = text.split('\n');
                const parsedChapters: Chapter[] = [];
                let currentTitle = '开始';
                let currentContent: string[] = [];

                // Headers we want to split by
                const headerPattern = /^\s*(作者序|前言|序幕|第一场|第二场|第三场|第四场|第五场|第六场|第七场|第八场|第九场|第一幕|第二幕|第三幕|第四幕|转场|终场|彩蛋|后记)/;

                lines.forEach(line => {
                    const trimmed = line.trim();
                    // Ignore page numbers/footers pattern like "/ 1 64"
                    if (trimmed.match(/^\/\s*\d+\s*\d+$/)) return;
                    if (!trimmed) {
                        if (currentContent.length > 0 && currentContent[currentContent.length - 1] !== '') {
                            currentContent.push(''); // Preserve paragraph breaks but not duplicate empty lines
                        }
                        return;
                    }

                    if (headerPattern.test(trimmed)) {
                        if (currentContent.length > 0) {
                            parsedChapters.push({
                                title: currentTitle,
                                content: currentContent,
                                isLocked: parsedChapters.length >= 2 // Lock after first 2 chapters (Preface + Intro)
                            });
                        }
                        currentTitle = trimmed;
                        currentContent = [];
                    } else {
                        currentContent.push(trimmed);
                    }
                });

                // Push last chapter
                if (currentContent.length > 0) {
                    parsedChapters.push({
                        title: currentTitle,
                        content: currentContent,
                        isLocked: parsedChapters.length >= 2
                    });
                }

                setChapters(parsedChapters);

                // Handle URL param
                const chapParam = searchParams.get('chapter');
                if (chapParam) {
                    const idx = parseInt(chapParam);
                    if (!isNaN(idx) && idx >= 0 && idx < parsedChapters.length) {
                        setCurrentChapterIndex(idx);
                    }
                }

                setLoading(false);
            })
            .catch(err => console.error("Failed to load book:", err));
    }, []);

    // Sync URL with chapter
    useEffect(() => {
        setSearchParams({ chapter: currentChapterIndex.toString() });
        // Scroll to top
        window.scrollTo(0, 0);
    }, [currentChapterIndex, setSearchParams]);

    const handleNext = () => {
        if (currentChapterIndex < chapters.length - 1) {
            setCurrentChapterIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
        }
    };

    const currentChapter = chapters[currentChapterIndex];
    const isCurrentLocked = currentChapter?.isLocked && !isMember;

    // Theme Styles
    const themeStyles = {
        light: 'bg-white text-gray-900 selection:bg-yellow-200',
        dark: 'bg-[#0F0015] text-gray-200 selection:bg-[#6A1B9A] selection:text-white',
        sepia: 'bg-[#f4ecd8] text-[#5b4636] selection:bg-[#d6c6a4]'
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans ${themeStyles[theme]}`}>
            {/* Watermark */}
            <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center opacity-[0.03] select-none overflow-hidden">
                <div className="rotate-[-30deg] text-6xl font-black whitespace-nowrap repeat-3">
                    RICH BOSS POOR BOSS &nbsp; RICH BOSS POOR BOSS &nbsp; RICH BOSS POOR BOSS
                </div>
            </div>

            {/* Top Bar */}
            <header className={`fixed top-0 left-0 right-0 z-40 px-4 py-3 flex justify-between items-center backdrop-blur-md border-b transition-colors ${theme === 'dark' ? 'bg-[#0F0015]/80 border-white/5' : 'bg-white/80 border-black/5'
                }`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link to="/" className="flex items-center gap-2 font-bold tracking-tight opacity-80 hover:opacity-100 transition-opacity">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">RichBoss</span>
                    </Link>
                </div>

                <h1 className="text-sm font-medium truncate max-w-[150px] sm:max-w-md opacity-80">
                    {loading ? 'Loading...' : currentChapter?.title}
                </h1>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsMember(!isMember)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition-all ${isMember
                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                            : 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-yellow-500/10 hover:text-yellow-500'
                            }`}
                    >
                        {isMember ? 'VIP' : 'GUEST'}
                    </button>
                    <button onClick={() => setShowSettings(!showSettings)} className="p-2 rounded-full hover:bg-gray-500/10 transition-colors">
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* Initial Loader */}
            {loading && (
                <div className="h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
            )}

            {/* Main Content */}
            {!loading && (
                <main className="pt-24 pb-32 max-w-3xl mx-auto px-6 sm:px-8 relative min-h-screen">
                    <motion.div
                        key={currentChapterIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold mb-8">{currentChapter.title}</h2>

                        <div
                            style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
                            className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}
                        >
                            {isCurrentLocked ? (
                                <div className="relative mt-8 p-8 border border-dashed border-gray-500/30 rounded-2xl bg-gray-500/5 text-center space-y-4">
                                    <div className="absolute inset-0 backdrop-blur-[2px] rounded-2xl" />
                                    <div className="relative z-10 flex flex-col items-center gap-4 py-8">
                                        <div className="w-12 h-12 bg-gray-500/10 rounded-full flex items-center justify-center">
                                            <Lock className="w-6 h-6 opacity-60" />
                                        </div>
                                        <h3 className="text-xl font-bold">本章節為會員專屬</h3>
                                        <p className="text-sm opacity-70 max-w-xs">
                                            解鎖《富老板，穷老板》完整內容，掌握有效決策的關鍵能力。
                                        </p>
                                        <button
                                            onClick={() => alert("Redirecting to payment or mock upgrade")}
                                            className="mt-4 px-8 py-3 bg-[#FFD700] text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                        >
                                            升級會員解鎖
                                        </button>

                                        <div className="mt-8 w-full max-w-sm text-left opacity-30 select-none blur-[1px]">
                                            <p>这里是隐藏的内容预览...</p>
                                            <p>商业世界的决策往往不是非黑即白...</p>
                                            <p>富老板知道什么时候该停下来...</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                currentChapter.content.map((paragraph, idx) => (
                                    <p key={idx} className="mb-4 text-justify tracking-wide">
                                        {paragraph}
                                    </p>
                                ))
                            )}
                        </div>
                    </motion.div>
                </main>
            )}

            {/* Bottom Nav */}
            {!loading && (
                <div className={`fixed bottom-0 left-0 right-0 p-4 border-t backdrop-blur-md flex justify-between items-center z-40 max-w-7xl mx-auto w-full ${theme === 'dark' ? 'bg-[#0F0015]/80 border-white/5' : 'bg-white/80 border-black/5'
                    }`}>
                    <button
                        onClick={handlePrev}
                        disabled={currentChapterIndex === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">上一章</span>
                    </button>

                    <span className="text-xs opacity-50">
                        {Math.round(((currentChapterIndex + 1) / chapters.length) * 100)}% 完成
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={currentChapterIndex === chapters.length - 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-500/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <span className="hidden sm:inline">下一章</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Sidebar TOC */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`fixed top-0 left-0 bottom-0 w-[300px] z-50 overflow-y-auto shadow-2xl ${theme === 'dark' ? 'bg-[#1a0524] text-gray-200' : 'bg-white text-gray-900'
                                }`}
                        >
                            <div className="p-6 flex justify-between items-center border-b border-gray-500/10">
                                <h3 className="font-bold text-lg">目录</h3>
                                <button onClick={() => setSidebarOpen(false)}>
                                    <X className="w-5 h-5 opacity-50 hover:opacity-100" />
                                </button>
                            </div>
                            <div className="p-4 space-y-1">
                                {chapters.map((chap, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setCurrentChapterIndex(idx);
                                            setSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex justify-between items-center ${idx === currentChapterIndex
                                            ? 'bg-primary/20 text-primary font-bold'
                                            : 'hover:bg-gray-500/5 opacity-80 hover:opacity-100'
                                            }`}
                                    >
                                        <span className="truncate flex-1 pr-4">{chap.title}</span>
                                        {chap.isLocked && !isMember && <Lock className="w-3 h-3 opacity-40" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Settings Drawer */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-20 right-4 sm:right-10 w-80 p-6 rounded-2xl shadow-2xl z-50 border ${theme === 'dark' ? 'bg-[#1a0524] border-white/10' : 'bg-white border-gray-200'
                            }`}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold">阅读设置</h3>
                            <button onClick={() => setShowSettings(false)}>
                                <X className="w-4 h-4 opacity-50" />
                            </button>
                        </div>

                        {/* Theme */}
                        <div className="mb-6">
                            <label className="text-xs opacity-50 mb-3 block uppercase tracking-wider">Theme</label>
                            <div className="flex gap-2">
                                {(['light', 'dark', 'sepia'] as const).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t)}
                                        className={`flex-1 py-2 rounded-lg border-2 flex items-center justify-center transition-all ${theme === t ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'
                                            } ${t === 'light' ? 'bg-white text-black' :
                                                t === 'dark' ? 'bg-[#0f0015] text-white' :
                                                    'bg-[#f4ecd8] text-[#5b4636]'
                                            }`}
                                    >
                                        {t === 'light' && <Sun className="w-4 h-4" />}
                                        {t === 'dark' && <Moon className="w-4 h-4" />}
                                        {t === 'sepia' && <Type className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Size */}
                        <div>
                            <label className="text-xs opacity-50 mb-3 block uppercase tracking-wider">Text Size</label>
                            <div className="flex items-center gap-4">
                                <span className="text-sm">A</span>
                                <input
                                    type="range"
                                    min="14"
                                    max="24"
                                    step="1"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="flex-1 accent-primary h-1 rounded-full opacity-80"
                                />
                                <span className="text-xl">A</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Reader;
