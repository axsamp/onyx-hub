import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Trash2, X, Activity, Cpu, Clock, Wallet, Layers } from 'lucide-react';
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

  const targetUrl = useMemo(() => {
    try {
      const theme = localStorage.getItem('onyx_theme') || 'cobalt';
      const stealth = localStorage.getItem('onyx_stealth_mode') || 'false';
      const url = new URL(app.url);
      url.searchParams.set('theme', theme);
      url.searchParams.set('stealth', stealth);
      return url.toString();
    } catch (e) {
      return app.url;
    }
  }, [app.url]);

  return (
    <div className="relative pl-16 py-10 group will-change-transform">
      <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-24 pointer-events-none overflow-visible">
        <motion.path 
          d="M0 12 L30 12 L45 32 L64 32" 
          fill="none" 
          stroke={showActiveState ? "#FFC107" : "#27272A"} 
          strokeWidth="0.5" 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ delay: delay + 0.3, duration: 0.8 }} 
        />
        <motion.circle cx="0" cy="12" r="2" fill={showActiveState ? "#FFC107" : "#27272A"} className="transition-colors duration-300" />
        {showActiveState && isVisible && (
          <motion.circle 
            r="1.5" 
            fill="#FFC107" 
            animate={{ cx: [0, 30, 45, 64], cy: [12, 12, 32, 32] }} 
            transition={{ duration: 1.2 + (Math.random() * 0.4), repeat: Infinity, ease: "linear", delay }} 
          />
        )}
      </svg>
      <motion.a 
        href={targetUrl} 
        onPointerDown={handleTap} 
        onMouseEnter={() => setIsHovered(true)} 
        onMouseLeave={() => setIsHovered(false)} 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: isLaunching ? 0.35 : 1, x: isLaunching ? 12 : 0 }} 
        transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} 
        className="block cursor-pointer"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[10px] font-black text-[#FFC107] uppercase tracking-[0.4em] font-mono">Node_{app.node}</span>
            <div className="h-[1px] w-12 bg-[#FFC107]/10" />
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{app.version}</span>
          </div>
          <h2 className={cn("text-2xl md:text-3xl font-black uppercase tracking-tight leading-none transition-all duration-500 font-display", showActiveState ? "text-[#FFC107] translate-x-2" : "text-white")}>
            {app.name.split(' ')[0]}
            <span className={cn("block text-sm font-black tracking-[0.25em] mt-1 transition-colors duration-500 font-sans", showActiveState ? "opacity-100 text-white" : "opacity-35 text-white")}>
              {app.name.split(' ').slice(1).join(' ')}
            </span>
          </h2>
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
    triggerHaptic('heavy');
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        for (const reg of regs) reg.unregister();
        window.location.reload();
      });
    } else window.location.reload();
  }, []);

  const clearSystemCache = useCallback(() => {
    triggerHaptic('heavy');
    if (confirm("RESET ALL ONYX LOCAL DATA?")) {
      localStorage.clear();
      window.location.reload();
    }
  }, []);

  const tokyoTime = useMemo(() => {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Tokyo',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(time);
  }, [time]);

  const springConfig = { stiffness: 450, damping: 28, mass: 0.95 };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center selection:bg-[#FFC107]/30 overflow-hidden touch-none overscroll-none font-sans relative">
      
      {/* Scanline CRT simulation */}
      <div className="fixed inset-0 pointer-events-none z-[501] opacity-[0.015] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Atmospheric Ambience Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_50%_0%,rgba(255,193,7,0.08)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[100vw] h-[50vh] bg-[radial-gradient(circle_at_50%_100%,rgba(255,193,7,0.04)_0%,transparent_50%)]" />
      </div>

      <div className="relative w-full max-w-lg mt-12 pb-60 px-8 h-screen overflow-y-auto no-scrollbar touch-pan-y z-10">
        
        {/* Dynamic Island Safety Spacer */}
        <div className="h-10 w-full shrink-0"></div>

        {/* Outfit Header Title */}
        <header className="flex flex-col gap-3 mb-14 pt-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#FFC107] animate-pulse" />
              <span className="text-[10px] font-black text-[#FFC107] uppercase tracking-[0.6em] opacity-65 font-mono">Lattice Registry</span>
            </div>
            <h1 className="text-[52px] leading-[1.0] font-black tracking-tighter uppercase text-white font-display">
              Hub.
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold px-3 py-1 bg-[#FFC107]/15 text-[#FFC107] rounded-full tracking-wide">
                {tokyoTime.split(':').slice(0, 2).join(':')} JST
              </span>
              <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-white/40">
                Central command suite
              </span>
            </div>
        </header>
        
        {/* Apps Navigation Lattice */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 flex gap-1 ml-[1px] pointer-events-none">
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
            <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-40" />
          </div>
          <div className="flex flex-col">
            {APPS.map((app, index) => <NodeLink key={app.id} app={app} delay={index * 0.08} />)}
          </div>
        </div>
      </div>

      {/* Floating command center trigger */}
      <div className="fixed inset-x-0 bottom-0 z-[600] flex justify-center pointer-events-none pb-[calc(1.5rem+env(safe-area-inset-bottom,20px))]">
        <motion.div
          onPointerDown={(e) => { e.stopPropagation(); triggerHaptic('medium'); setIsOrbExpanded(!isOrbExpanded); }}
          animate={{ 
            width: isOrbExpanded ? "min(340px, 92vw)" : "64px", 
            height: isOrbExpanded ? "400px" : "64px", 
            borderRadius: isOrbExpanded ? "32px" : "32px",
            y: isOrbExpanded ? -10 : 0
          }}
          transition={springConfig}
          className="bg-black/75 border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.9)] cursor-pointer relative flex flex-col items-center pointer-events-auto origin-bottom overflow-hidden backdrop-blur-xl"
        >
          {/* Internal Glowing Pulse Orb */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,193,7,0.12)_0%,transparent_70%)] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!isOrbExpanded ? (
              <motion.div key="compact" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[#FFC107]/20 rounded-full blur-xl animate-pulse" />
                <div className="relative w-3.5 h-3.5 bg-[#FFC107] rounded-full shadow-[0_0_20px_rgba(255,193,7,0.95)]" />
              </motion.div>
            ) : (
              <motion.div key="expanded" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }} className="w-full h-full p-8 flex flex-col relative z-10">
                
                {/* Header status bar */}
                <div className="flex justify-between items-center mb-10 shrink-0">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-[#FFC107] uppercase tracking-[0.4em] font-mono">Command Center</span>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-[0.2em]">Chassis_v6.2</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsOrbExpanded(false); }} 
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Body options */}
                <div className="flex-1 flex flex-col gap-10">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1 opacity-40">
                        <Wallet size={10} className="text-[#FFC107]" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-[0.3em] font-mono">Total Travel Fund</span>
                      </div>
                      <span className="text-4xl font-black tracking-tighter tabular-nums font-display">¥{parseInt(systemBudget).toLocaleString()}</span>
                   </div>

                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-1 opacity-40">
                        <Clock size={10} className="text-[#FFC107]" />
                        <span className="text-[9px] font-bold text-white uppercase tracking-[0.3em] font-mono">Tokyo JST</span>
                      </div>
                      <span className="text-4xl font-black tracking-tighter tabular-nums font-display">
                        {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tokyo' })}
                      </span>
                   </div>

                   {/* Action utility triggers */}
                   <div className="flex flex-col gap-3 mt-auto shrink-0">
                      <button 
                        onClick={(e) => { e.stopPropagation(); forceRefresh(); }} 
                        className="flex items-center justify-between px-5 py-4 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.4em] hover:bg-[#FFC107] hover:text-black transition-all cursor-pointer ripple"
                      >
                        <span>Sync Lattice</span>
                        <RefreshCcw className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); clearSystemCache(); }} 
                        className="flex items-center justify-between px-5 py-4 rounded-xl bg-red-500/5 border border-red-500/10 text-[9px] font-black uppercase tracking-[0.4em] text-red-500/70 hover:bg-red-500 hover:text-black transition-all cursor-pointer ripple"
                      >
                        <span>Reset All Cache</span>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                   </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {isOrbExpanded && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={() => setIsOrbExpanded(false)} 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[550]" 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
