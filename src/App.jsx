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
  {
    id: 'signal',
    name: 'Onyx Signal',
    url: 'http://localhost:5174/', // Dev port for Signal
    version: 'V1.0.0',
    node: '05',
  },
  {
    id: 'waypoint',
    name: 'Onyx Waypoint',
    url: 'http://localhost:5173/', // Verified Port for Waypoint
    version: 'V1.0.0',
    node: '06',
  },
];

const NodeLink = ({ app, delay }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isLaunching, setIsLaunching] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);

  const handleTap = () => {
    triggerHaptic('medium');
    setIsLaunching(true);
  };

  const showActiveState = isHovered || isMobile;

  return (
    <div className="relative pl-16 py-12 group">
      {/* Port Connection Line */}
      <svg className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-24 pointer-events-none overflow-visible">
        <motion.path
          d="M0 12 L30 12 L45 32 L64 32"
          fill="none"
          stroke={showActiveState ? "#C084FC" : "#3F3F46"}
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: delay + 0.5, duration: 1 }}
        />
        {/* Connection Joint */}
        <motion.circle
          cx="0" cy="12" r="2"
          fill={showActiveState ? "#C084FC" : "#27272A"}
          className="transition-colors duration-300"
        />
        {/* Animated Pulse Packet */}
        {showActiveState && (
          <motion.circle
            r="1.5"
            fill="#C084FC"
            animate={{
              cx: [0, 30, 45, 64],
              cy: [12, 12, 32, 32]
            }}
            transition={{ 
              duration: 1.5 + (Math.random() * 0.5), 
              repeat: Infinity, 
              ease: "linear",
              delay: delay // Stagger the pulses
            }}
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
            "text-2xl md:text-3xl font-black uppercase tracking-tight leading-none transition-all duration-500",
            showActiveState ? "text-onyx-purple translate-x-2" : "text-white"
          )}>
            {app.name.split(' ')[0]}
            <span className={cn(
              "block text-base font-bold tracking-[0.2em] mt-1 transition-colors duration-500 text-white",
              showActiveState ? "opacity-100" : "opacity-40"
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

  return (
    <div className="min-h-screen bg-onyx-bg text-white p-4 md:p-6 flex flex-col items-center">
      {/* Onyx Chassis Tab - Top Left System Hub */}
      <div className="fixed left-0 top-0 pt-[env(safe-area-inset-top)] z-[100]">
        <motion.div
          onPointerDown={() => { triggerHaptic('medium'); setIsIslandExpanded(!isIslandExpanded); }}
          animate={{
            width: isIslandExpanded ? "300px" : "80px",
            height: isIslandExpanded ? "280px" : "44px",
            borderBottomRightRadius: isIslandExpanded ? "24px" : "12px",
          }}
          transition={springConfig}
          className="bg-black border-r border-b border-white/10 shadow-[20px_20px_40px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer relative flex items-center"
        >
          <AnimatePresence mode="wait">
            {!isIslandExpanded ? (
              <motion.div 
                key="tab-compact" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="w-full h-full flex items-center justify-center"
              >
                <span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.4em] ml-[0.4em]">
                  ONYX
                </span>
              </motion.div>
            ) : (
              <motion.div 
                key="tab-expanded" 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0 }} 
                className="w-full h-full p-6 flex flex-col"
              >
                <div className="flex flex-col gap-1 mb-8">
                  <span className="text-[8px] font-bold text-onyx-muted uppercase tracking-[0.3em]">Onyx Chassis</span>
                  <div className="w-12 h-[1px] bg-onyx-purple/40" />
                </div>

                {/* Unique Fractal Mini Lattice */}
                <div className="relative flex-1">
                  {/* Onyx Double-Rail Backbone */}
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] flex justify-between">
                    <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-onyx-purple to-transparent opacity-40" />
                    <div className="w-[1px] h-full bg-onyx-purple/10" />
                  </div>

                  <div className="flex flex-col gap-12 pl-8">
                    {/* Node: Budget */}
                    <div className="relative group">
                      <svg className="absolute -left-8 top-2 w-8 h-4 overflow-visible">
                        <path d="M0 0 L18 0 L24 6" fill="none" stroke="#C084FC" strokeWidth="1" opacity="0.4" />
                        <rect x="-2" y="-2" width="4" height="4" fill="#C084FC" transform="rotate(45)" />
                      </svg>
                      <span className="text-[7px] font-bold text-onyx-muted uppercase tracking-widest block mb-1">LIQUIDITY</span>
                      <span className="text-xl font-black text-white">¥{parseInt(systemBudget).toLocaleString()}</span>
                    </div>

                    {/* Node: Time */}
                    <div className="relative group">
                      <svg className="absolute -left-8 top-2 w-8 h-4 overflow-visible">
                        <path d="M0 0 L18 0 L24 6" fill="none" stroke="#3F3F46" strokeWidth="1" opacity="0.4" />
                        <rect x="-2" y="-2" width="4" height="4" fill="#27272A" transform="rotate(45)" />
                      </svg>
                      <span className="text-[7px] font-bold text-onyx-muted uppercase tracking-widest block mb-1">TOKYO STATION</span>
                      <span className="text-xl font-black tabular-nums">
                        {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
                      </span>
                    </div>

                    {/* Node: Signal Arch (New Integration) */}
                    <div className="relative group">
                      <svg className="absolute -left-8 top-2 w-8 h-4 overflow-visible">
                        <path d="M0 0 L18 0 L24 6" fill="none" stroke="#C084FC" strokeWidth="1" opacity="0.4" />
                        <rect x="-2" y="-2" width="4" height="4" fill="#C084FC" transform="rotate(45)" />
                      </svg>
                      <span className="text-[7px] font-bold text-onyx-purple/60 uppercase tracking-widest block mb-1">SIGNAL ARCHIVE</span>
                      <span className="text-xl font-black tabular-nums text-white">
                        {localStorage.getItem('onyx_signal_count') || '0'} <span className="text-[10px] text-onyx-muted">NODES</span>
                      </span>
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
      <div className="h-24" />
    </div>
  );
}
