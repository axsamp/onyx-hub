import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Trash2, X } from 'lucide-react';
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
  { id: 'waypoint', name: 'Onyx Waypoint', url: 'https://axsamp.github.io/onyx-waypoint/', version: 'V1.0.4', node: '06' },
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
          <div className="flex items-center gap-3 mb-2"><span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.4em]">NODE_{app.node}</span><div className="h-[1px] w-8 bg-onyx-purple/20" /><span className="text-[8px] font-mono text-onyx-muted opacity-40">{app.version}</span></div>
          <h2 className={cn("text-2xl md:text-3xl font-black uppercase tracking-tight leading-none transition-all duration-500", showActiveState ? "text-onyx-purple translate-x-2" : "text-white")}>{app.name.split(' ')[0]}<span className={cn("block text-base font-bold tracking-[0.2em] mt-1 transition-colors duration-500 text-white", showActiveState ? "opacity-100" : "opacity-40")}>{app.name.split(' ').slice(1).join(' ')}</span></h2>
        </div>
      </motion.a>
    </div>
  );
});

export default function App() {
  const [isIslandExpanded, setIsIslandExpanded] = useState(false);
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
    <div className="min-h-screen bg-onyx-bg text-white p-4 md:p-6 flex flex-col items-center selection:bg-onyx-purple/30 overflow-x-hidden">
      {/* Stabilized Dynamic Island Mimic */}
      <div className="fixed left-0 right-0 top-0 z-[100] flex justify-center pointer-events-none p-4">
        <motion.div
          onPointerDown={(e) => { e.stopPropagation(); triggerHaptic('medium'); setIsIslandExpanded(!isIslandExpanded); }}
          animate={{ 
            width: isIslandExpanded ? "min(340px, 92vw)" : "84px", 
            height: isIslandExpanded ? "420px" : "38px", 
            borderRadius: isIslandExpanded ? "32px" : "19px",
            y: isIslandExpanded ? 0 : 4
          }}
          transition={springConfig}
          style={{ marginTop: 'env(safe-area-inset-top)' }}
          className="bg-black border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.9)] overflow-hidden cursor-pointer relative flex items-center pointer-events-auto"
        >
          <AnimatePresence mode="wait">
            {!isIslandExpanded ? (
              <motion.div key="compact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex items-center justify-center">
                <span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.4em] ml-[0.4em]">ONYX</span>
              </motion.div>
            ) : (
              <motion.div key="expanded" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full h-full p-6 flex flex-col">
                <div className="flex justify-between items-start mb-6 pt-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-bold text-onyx-muted uppercase tracking-[0.3em]">Onyx Chassis // V5.3.0</span>
                    <div className="w-12 h-[1px] bg-onyx-purple/40" />
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setIsIslandExpanded(false); }} className="p-2 -mr-2 text-zinc-600 hover:text-white transition-colors"><X size={18} /></button>
                </div>

                <div className="relative flex-1">
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] flex justify-between"><div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-onyx-purple to-transparent opacity-40" /><div className="w-[1px] h-full bg-onyx-purple/10" /></div>
                  <div className="flex flex-col gap-8 pl-8">
                    <div className="relative group"><span className="text-[7px] font-bold text-onyx-muted uppercase tracking-widest block mb-1">LIQUIDITY</span><span className="text-2xl font-black text-white">¥{parseInt(systemBudget).toLocaleString()}</span></div>
                    <div className="relative group"><span className="text-[7px] font-bold text-onyx-muted uppercase tracking-widest block mb-1">TOKYO TIME</span><span className="text-2xl font-black tabular-nums">{time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}</span></div>
                    <div className="flex flex-col gap-2 pt-6">
                      <button onClick={(e) => { e.stopPropagation(); forceRefresh(); }} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-onyx-purple hover:text-black transition-all"><RefreshCcw className="w-3.5 h-3.5" /> Force Update</button>
                      <button onClick={(e) => { e.stopPropagation(); clearSystemCache(); }} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-black transition-all"><Trash2 className="w-3.5 h-3.5" /> Reset Lattice</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {isIslandExpanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsIslandExpanded(false)} className="fixed inset-0 bg-black/70 backdrop-blur-md z-[90]" />
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-lg mt-32 pb-40">
        <div className="absolute left-0 top-0 bottom-0 flex gap-1 ml-[1px]"><div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent" /><div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-50" /><div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-20" /></div>
        <div className="flex flex-col">
          {APPS.map((app, index) => <NodeLink key={app.id} app={app} delay={index * 0.12} />)}
        </div>
      </div>
    </div>
  );
}
