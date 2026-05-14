import React from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Haptic trigger for supported devices
const triggerHaptic = (type = 'light') => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (type === 'light') navigator.vibrate(10);
      else if (type === 'medium') navigator.vibrate(20);
    }
  } catch (e) {
    // Ignore vibration failures (usually due to lack of user gesture)
  }
};

const apps = [
  {
    id: 'itinerary',
    name: 'Itinerary Command',
    url: 'https://axsamp.github.io/onyx-itinerary/',
    version: 'V4.1.2',
    node: '01',
  },
  {
    id: 'budget',
    name: 'Budget Buffer',
    url: 'https://axsamp.github.io/budget-buffer/',
    version: 'V3.8.0',
    node: '02',
  },
  {
    id: 'converter',
    name: 'Unit Converter',
    url: 'https://axsamp.github.io/onyx-converter/',
    version: 'V2.5.4',
    node: '03',
  },
  {
    id: 'stamps',
    name: 'Stamp Collector',
    url: 'https://axsamp.github.io/onyx-stamps/',
    version: 'V1.9.9',
    node: '04',
  },
];

const NodeLink = ({ app, delay }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLaunching, setIsLaunching] = React.useState(false);

  const handleTap = () => {
    triggerHaptic('medium');
    setIsLaunching(true);
  };

  return (
    <div className="relative pl-16 py-12 group">
      {/* Port Connection Line */}
      <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-24 pointer-events-none overflow-visible">
        <motion.path
          d="M0 12 L30 12 L45 32 L64 32"
          fill="none"
          stroke={isHovered ? "#C084FC" : "#3F3F46"}
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.5, duration: 1 }}
        />
        {/* Connection Joint */}
        <motion.circle
          cx="0" cy="12" r="2"
          fill={isHovered ? "#C084FC" : "#27272A"}
          className="transition-colors duration-300"
        />
        {/* Animated Pulse Packet */}
        {isHovered && (
          <motion.circle
            r="1.5"
            fill="#C084FC"
            animate={{ 
              cx: [0, 30, 45, 64],
              cy: [12, 12, 32, 32]
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}
      </svg>

      <motion.a
        href={app.url}
        onPointerDown={handleTap}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, x: 20 }}
        animate={{ 
          opacity: isLaunching ? 0.4 : 1, 
          x: isLaunching ? 10 : 0 
        }}
        transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="block"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.4em]">NODE_{app.node}</span>
            <div className="h-[1px] w-8 bg-onyx-purple/20" />
            <span className="text-[8px] font-mono text-onyx-muted opacity-40">{app.version}</span>
          </div>
          
          <h2 className={cn(
            "text-3xl md:text-4xl font-black uppercase tracking-tight leading-none transition-all duration-500",
            isHovered ? "text-onyx-purple translate-x-2" : "text-white"
          )}>
            {app.name.split(' ')[0]}
            <span className={cn(
              "block text-lg font-bold tracking-[0.4em] mt-1 transition-colors duration-500",
              isHovered ? "text-onyx-purple/60" : "text-onyx-muted"
            )}>
              {app.name.split(' ').slice(1).join(' ')}
            </span>
          </h2>
        </div>
      </motion.a>
    </div>
  );
};

export default function App() {
  const [isIslandExpanded, setIsIslandExpanded] = React.useState(false);
  const [systemBudget, setSystemBudget] = React.useState(() => {
    return localStorage.getItem('onyx_total_budget') || '585000';
  });
  const { scrollY } = useScroll();

  React.useEffect(() => {
    const handleStorageChange = () => {
      setSystemBudget(localStorage.getItem('onyx_total_budget') || '585000');
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const islandX = useTransform(scrollY, [0, 80], [0, -110]);
  const islandScale = useTransform(scrollY, [0, 80], [1, 0.85]);
  const springConfig = { stiffness: 400, damping: 30, mass: 1 };
  const smoothIslandX = useSpring(islandX, springConfig);
  const smoothIslandScale = useSpring(islandScale, springConfig);

  return (
    <div className="min-h-screen bg-onyx-bg text-white p-4 md:p-6 flex flex-col items-center">
      {/* Onyx Island */}
      <div className="sticky z-[100] top-0 w-full flex justify-center pt-[max(12px,env(safe-area-inset-top))] mb-12">
        <motion.div
          onPointerDown={() => { triggerHaptic('medium'); setIsIslandExpanded(!isIslandExpanded); }}
          layout
          animate={{
            width: isIslandExpanded ? "100%" : "auto",
            maxWidth: isIslandExpanded ? "380px" : "180px",
            height: isIslandExpanded ? "180px" : "36px",
            borderRadius: isIslandExpanded ? "42px" : "18px",
            x: isIslandExpanded ? 0 : smoothIslandX.get(),
            scale: isIslandExpanded ? 1 : smoothIslandScale.get(),
          }}
          transition={springConfig}
          className="bg-black border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer flex flex-col items-center justify-center relative"
        >
          <AnimatePresence mode="wait">
            {!isIslandExpanded ? (
              <motion.div key="compact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 px-4">
                <div className="w-1.5 h-1.5 rounded-full bg-onyx-purple animate-pulse" />
                <span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.4em]">Onyx OS</span>
              </motion.div>
            ) : (
              <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-onyx-muted uppercase tracking-[0.3em] mb-1">System Node</span>
                    <h1 className="text-lg font-black tracking-tighter uppercase leading-none">Onyx<span className="text-onyx-purple ml-1">Hub</span></h1>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-bold text-onyx-muted uppercase tracking-[0.3em] mb-1">Tokyo Time</span>
                    <span className="text-xl font-mono font-bold tabular-nums tracking-tighter">
                      {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                    <span className="text-[7px] font-bold text-onyx-muted uppercase tracking-widest block mb-1">Remaining Budget</span>
                    <span className="text-sm font-black text-onyx-purple">¥{parseInt(systemBudget).toLocaleString()}</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
                    <span className="text-[7px] font-bold text-onyx-muted uppercase tracking-widest block mb-1">Signal Status</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex gap-0.5">
                        <div className="w-0.5 h-1 bg-onyx-purple" /><div className="w-0.5 h-2 bg-onyx-purple" /><div className="w-0.5 h-3 bg-onyx-purple" />
                      </div>
                      <span className="text-[8px] font-bold text-white uppercase">Stable</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Main Structural Lattice */}
      <div className="relative w-full max-w-lg mt-12 pb-32">
        {/* Central Backbone Lines */}
        <div className="absolute left-0 top-0 bottom-0 flex gap-1 ml-[1px]">
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-50" />
          <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-zinc-800 to-transparent opacity-20" />
        </div>

        {/* App Nodes */}
        <div className="flex flex-col">
          {apps.map((app, index) => (
            <NodeLink key={app.id} app={app} delay={index * 0.15} />
          ))}
        </div>
      </div>
      {/* Footer */}
      <footer className="mt-16 text-center pb-12 flex flex-col items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-b from-onyx-purple/40 to-transparent" />
        <p className="text-[8px] font-bold text-onyx-muted uppercase tracking-[0.6em] opacity-40">
          Onyx Digital Architecture // V4.3.0_TSL
        </p>
      </footer>
    </div>
  );
}
