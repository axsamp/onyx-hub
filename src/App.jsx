import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Trash2, X, Activity, Cpu, Clock, Wallet } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const triggerHaptic = (type = 'light') => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(type === 'light' ? 10 : 20);
    }
  } catch (e) {}
};

const APPS = [
  { id: 'itinerary', name: 'Itinerary Command', url: 'https://axsamp.github.io/onyx-itinerary/', version: 'V4.1.5', node: '01' },
  { id: 'budget', name: 'Budget Buffer', url: 'https://axsamp.github.io/budget-buffer/', version: 'V3.8.2', node: '02' },
  { id: 'converter', name: 'Unit Converter', url: 'https://axsamp.github.io/onyx-converter/', version: 'V2.5.6', node: '03' },
  { id: 'stamps', name: 'Stamp Collector', url: 'https://axsamp.github.io/onyx-stamps/', version: 'V1.9.11', node: '04' },
  { id: 'signal', name: 'Onyx Signal', url: 'https://axsamp.github.io/onyx-recorder/', version: 'V1.0.2', node: '05' },
];

const NodeLink = React.memo(({ app, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    const handleVisibility = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const handleTap = useCallback(() => {
    triggerHaptic('medium');
    setIsLaunching(true);
  }, []);

  const showActiveState = isHovered || isMobile;

  return (
    <div className="relative pl-16 py-12 group will-change-transform">
      <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-24 pointer-events-none overflow-visible">
        <motion.path d="M0 12 L30 12 L45 32 L64 32" fill="none" stroke={showActiveState ? "#C084FC" : "#3F3F46"} strokeWidth="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: delay + 0.5, duration: 1 }} />
        <motion.circle cx="0" cy="12" r="2" fill={showActiveState ? "#C084FC" : "#27272A"} className="transition-colors duration-300" />
        {showActiveState && isVisible && <motion.circle r="1.5" fill="#C084FC" animate={{ cx: [0, 30, 45, 64], cy: [12, 12, 32, 32] }} transition={{ duration: 1.5 + (Math.random() * 0.5), repeat: Infinity, ease: "linear", delay }} />}
      </svg>
      <motion.a href={app.url} onPointerDown={handleTap} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: isLaunching ? 0.4 : 1, x: isLaunching ? 10 : 0 }} transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="block">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[9px] font-black text-onyx-purple uppercase tracking-[0.5em]">Node_{app.node}</span>
            <div className="h-[1px] w-12 bg-onyx-purple/10" />
            <span className="text-[7px] font-mono text-white/20 uppercase tracking-widest">{app.version}</span>
          </div>
          <h2 className={cn("text-2xl md:text-3xl font-black uppercase tracking-tight leading-none transition-all duration-500", showActiveState ? "text-onyx-purple translate-x-2" : "text-white")}>{app.name.split(' ')[0]}<span className={cn("block text-base font-bold tracking-[0.2em] mt-1 transition-colors duration-500 text-white", showActiveState ? "opacity-100" : "opacity-40")}>{app.name.split(' ').slice(1).join(' ')}</span></h2>
        </div>
      </motion.a>
    </div>
  );
});

export default function App() {
  const [isOrbExpanded, setIsOrbExpanded] = useState(false);
  const [systemBudget, setSystemBudget] = useState(() => localStorage.getItem('onyx_total_budget') || '585000');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    let interval;
    const startSync = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        setSystemBudget(localStorage.getItem('onyx_total_budget') || '585000');
        setTime(new Date());
      }, 2000);
    };
    const handleVisibility = () => document.hidden ? clearInterval(interval) : startSync();
    document.addEventListener('visibilitychange', handleVisibility);
    startSync();
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      clearInterval(interval);
    };
  }, []);

  const forceRefresh = useCallback(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (const reg of regs) reg.unregister();
        window.location.reload(true);
      });
    } else window.location.reload(true);
  }, []);

  const clearSystemCache = useCallback(() => {
    if (confirm("RESET ALL ONYX LOCAL DATA?")) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const springConfig = { stiffness: 400, damping: 30, mass: 1 };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center selection:bg-onyx-purple/30 overflow-hidden touch-none overscroll-none font-['Outfit']">
      
      {/* 
        PREMIUM OVERLAYS:
        Added a subtle film grain and scanline pattern to break up the flat black 
        and give it a high-end hardware aesthetic.
      */}
      <div className="fixed inset-0 pointer-events-none z-[500] opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="fixed inset-0 pointer-events-none z-[501] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Atmospheric Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_50%_0%,rgba(192,132,252,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[radial-gradient(circle_at_50%_100%,rgba(192,132,252,0.04)_0%,transparent_50%)]" />
      </div>

      <div className="relative w-full max-w-lg mt-12 pb-60 px-8 h-screen overflow-y-auto no-scrollbar touch-pan-y z-10">
        <div className="flex flex-col gap-4 mb-16 pt-16">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-onyx-purple animate-pulse" />
              <span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.8em] opacity-60">Lattice Registry</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none text-white selection:text-onyx-purple">Onyx Hub</h1>
        </div>
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex gap-1 ml-[1px]"><div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent" /><div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-50" /><div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-20" /></div>
          <div className="flex flex-col">
            {APPS.map((app, index) => <NodeLink key={app.id} app={app} delay={index * 0.12} />)}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[600] flex justify-center pointer-events-none pb-[calc(1.5rem+env(safe-area-inset-bottom,20px))]">
        <motion.div
          onPointerDown={(e) => { e.stopPropagation(); triggerHaptic('medium'); setIsOrbExpanded(!isOrbExpanded); }}
          animate={{ 
            width: isOrbExpanded ? "min(340px, 92vw)" : "64px", 
            height: isOrbExpanded ? "400px" : "64px", 
            borderRadius: isOrbExpanded ? "32px" : "32px",
            y: isOrbExpanded ? -20 : 0
          }}
          transition={springConfig}
          className="bg-black/90 backdrop-blur-3xl border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] cursor-pointer relative flex flex-col items-center pointer-events-auto origin-bottom overflow-hidden"
        >
          {/* Internal Orb Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(192,132,252,0.1)_0%,transparent_70%)] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!isOrbExpanded ? (
              <motion.div key="compact" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-onyx-purple/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-3 h-3 bg-onyx-purple rounded-full shadow-[0_0_20px_rgba(192,132,252,0.9)]" />
              </motion.div>
            ) : (
              <motion.div key="expanded" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full h-full p-8 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-12 shrink-0">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.5em]">Command</span>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Chassis_6.0.2</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsOrbExpanded(false); }} className="p-2 -mr-2 text-zinc-600 hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 flex flex-col gap-12">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1 opacity-40">
                        <Wallet size={10} className="text-onyx-purple" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-[0.3em]">Liquidity</span>
                      </div>
                      <span className="text-4xl font-black tracking-tighter tabular-nums">¥{parseInt(systemBudget).toLocaleString()}</span>
                   </div>

                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1 opacity-40">
                        <Clock size={10} className="text-onyx-purple" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-[0.3em]">JST Time</span>
                      </div>
                      <span className="text-4xl font-black tracking-tighter tabular-nums">
                        {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tokyo' })}
                      </span>
                   </div>

                   <div className="flex flex-col gap-3 mt-auto">
                      <button onClick={(e) => { e.stopPropagation(); forceRefresh(); }} className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-onyx-purple hover:text-black transition-all">
                        <span>Sync</span>
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); clearSystemCache(); }} className="flex items-center justify-between px-6 py-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 hover:bg-red-500 hover:text-black transition-all">
                        <span>Reset</span>
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOrbExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOrbExpanded(false)} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[550]" />
        )}
      </AnimatePresence>
    </div>
  );
}
