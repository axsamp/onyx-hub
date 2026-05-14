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
    color: 'from-onyx-purple to-indigo-900',
    type: 'blade-hero',
    shape: 'obsidian-shape-1',
    blueprint: 'radar'
  },
  {
    id: 'budget',
    name: 'Budget Buffer',
    url: 'https://axsamp.github.io/budget-buffer/',
    color: 'from-onyx-purple to-purple-900',
    type: 'blade-deck-left',
    shape: 'obsidian-shape-2',
    blueprint: 'data-grid'
  },
  {
    id: 'converter',
    name: 'Unit Converter',
    url: 'https://axsamp.github.io/onyx-converter/',
    color: 'from-onyx-purple to-violet-900',
    type: 'blade-deck-right',
    shape: 'obsidian-shape-1',
    blueprint: 'matrix'
  },
  {
    id: 'stamps',
    name: 'Stamp Collector',
    url: 'https://axsamp.github.io/onyx-stamps/',
    color: 'from-onyx-purple to-fuchsia-900',
    type: 'blade-hero',
    shape: 'obsidian-shape-2',
    blueprint: 'celestial'
  },
];

const Blueprint = ({ type }) => {
  const blueprintStyles = "w-full h-full opacity-[0.18] stroke-onyx-purple fill-none drop-shadow-[0_0_2px_#c084fc] drop-shadow-[0_0_8px_rgba(192,132,252,0.2)] hologram-blueprint";
  
  if (type === 'radar') return (
    <svg className={blueprintStyles} viewBox="0 0 100 100">
      {/* Static Detail Rings */}
      <circle cx="50" cy="50" r="48" strokeWidth="0.1" strokeDasharray="1 3" className="opacity-30" />
      <circle cx="50" cy="50" r="35" strokeWidth="0.05" strokeDasharray="4 2" className="opacity-40" />
      <circle cx="50" cy="50" r="12" strokeWidth="0.05" />
      
      {/* Cardinal Labels */}
      <g className="fill-onyx-purple text-[5px] font-black opacity-60" textAnchor="middle">
        <text x="50" y="8">N</text>
        <text x="92" y="52">E</text>
        <text x="50" y="96">S</text>
        <text x="8" y="52">W</text>
      </g>

      <defs>
        <linearGradient id="needleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Compass Needle - High Precision */}
      <motion.g
        animate={{ rotate: [0, 15, -10, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="origin-center"
      >
        <path 
          d="M50 15 L53 50 L50 85 L47 50 Z" 
          strokeWidth="0.3" 
          className="opacity-90"
          fill="url(#needleGradient)"
        />
        <circle cx="50" cy="50" r="1.5" fill="currentColor" />
      </motion.g>

      {/* Degree Ticks */}
      {Array.from({ length: 36 }).map((_, i) => (
        <line 
          key={i} 
          x1="50" y1="2" x2="50" y2={i % 9 === 0 ? 8 : 4} 
          strokeWidth="0.1" 
          transform={`rotate(${i * 10} 50 50)`} 
          className="opacity-40"
        />
      ))}
    </svg>
  );
  if (type === 'data-grid') {
    const [numbers, setNumbers] = React.useState([]);
    React.useEffect(() => {
      const timer = setInterval(() => {
        setNumbers(Array.from({ length: 3 }, (_, i) => ({
          id: Math.random(),
          val: (Math.random() * 99).toFixed(2),
          x: 25 + Math.random() * 50, // Centered range
          y: 30 + Math.random() * 40, // Centered range
          delay: i * 0.8
        })));
      }, 3000);
      return () => clearInterval(timer);
    }, []);

    return (
      <svg className={blueprintStyles} viewBox="0 0 100 100">
        {/* Main Grid */}
        {Array.from({ length: 11 }).map((_, i) => (
          <React.Fragment key={i}>
            <line x1="0" y1={i * 10} x2="100" y2={i * 10} strokeWidth="0.05" className="opacity-20" />
            <line x1={i * 10} y1="0" x2={i * 10} y2="100" strokeWidth="0.05" className="opacity-20" />
          </React.Fragment>
        ))}
        
        {/* Scanning Beam */}
        <motion.line
          x1="0" x2="100"
          animate={{ y: [0, 100, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          strokeWidth="0.3"
          className="opacity-40"
        />

        {/* Ledger/Data Stream - Constrained to Grid */}
        <g className="fill-onyx-purple text-[4px] font-mono opacity-60" textAnchor="middle">
          <AnimatePresence>
            {numbers.map((n) => (
              <motion.text
                key={n.id}
                initial={{ opacity: 0, y: n.y - 2 }}
                animate={{ opacity: 1, y: n.y }}
                exit={{ opacity: 0, y: n.y + 2 }}
                transition={{ duration: 0.5 }}
                x={n.x}
                y={n.y}
              >
                {`DATA_${n.val}`}
              </motion.text>
            ))}
          </AnimatePresence>
        </g>

        {/* Mini Chart */}
        <motion.path
          d="M70 85 L75 80 L80 82 L85 75 L90 78 L95 70"
          fill="none"
          strokeWidth="0.2"
          strokeDasharray="100"
          animate={{ strokeDashoffset: [100, 0, 100] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <rect x="5" y="5" width="90" height="90" strokeWidth="0.2" strokeDasharray="1 4" />
        <path d="M5 15 L5 5 L15 5 M85 5 L95 5 L95 15 M95 85 L95 95 L85 95 M15 95 L5 95 L5 85" strokeWidth="0.5" />
      </svg>
    );
  }
  if (type === 'matrix') return (
    <svg className={blueprintStyles} viewBox="0 0 100 100">
      {/* Hexagonal Frame */}
      <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" strokeWidth="0.1" strokeDasharray="2 2" className="opacity-30" />
      
      {/* Logic Gates/Nodes */}
      <rect x="25" y="40" width="10" height="20" strokeWidth="0.2" className="opacity-40" />
      <rect x="65" y="40" width="10" height="20" strokeWidth="0.2" className="opacity-40" />
      <circle cx="50" cy="50" r="8" strokeWidth="0.2" strokeDasharray="1 1" />
      
      {/* Flow Particles */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r="0.5"
          fill="currentColor"
          animate={{ 
            cx: [35, 50, 65],
            cy: [50, 50, 50],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: i * 0.6,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Binary Stream */}
      <g className="fill-onyx-purple text-[2.5px] font-mono opacity-40">
        {Array.from({ length: 6 }).map((_, i) => (
          <text key={i} x="15" y={30 + i * 8}>{Math.random() > 0.5 ? '1010' : '0101'}</text>
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <text key={i} x="75" y={30 + i * 8}>{Math.random() > 0.5 ? '1100' : '0011'}</text>
        ))}
      </g>

      <motion.path
        d="M35 50 L42 50 M58 50 L65 50"
        strokeWidth="0.3"
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  );
  if (type === 'celestial') return (
    <svg className={blueprintStyles} viewBox="0 0 100 100">
      {/* Rotating Orbital Rings */}
      <motion.circle 
        cx="50" cy="50" r="40" strokeWidth="0.05" strokeDasharray="4 8"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="origin-center opacity-30"
      />
      <motion.circle 
        cx="50" cy="50" r="30" strokeWidth="0.05" strokeDasharray="2 4"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="origin-center opacity-40"
      />
      
      {/* Constellation Lines - More geometric/technical */}
      <path d="M25 25 L50 15 L75 25 L85 50 L75 75 L50 85 L25 75 L15 50 Z" strokeWidth="0.05" strokeDasharray="1 4" className="opacity-30" />
      <path d="M35 35 L50 25 L65 35 L65 65 L50 75 L35 65 Z" strokeWidth="0.1" strokeDasharray="2 2" className="opacity-40" />
      
      {/* Central Core */}
      <circle cx="50" cy="50" r="5" strokeWidth="0.2" />
      <motion.circle 
        cx="50" cy="50" r="8" strokeWidth="0.05" 
        animate={{ r: [8, 10, 8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Perimeter Markers */}
      {Array.from({ length: 4 }).map((_, i) => (
        <rect 
          key={i} 
          x="48" y="0" width="4" height="0.5" 
          transform={`rotate(${i * 90} 50 50)`} 
          className="opacity-60"
        />
      ))}
    </svg>
  );
  return null;
};

const AppCard = ({ app, delay }) => {
  return (
    <motion.a
      href={app.url}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -5 }}
      whileTap={{
        scale: 0.97,
        rotateX: -5,
        rotateY: 2,
        transition: { type: "spring", stiffness: 500, damping: 25 }
      }}
      onPointerDown={() => triggerHaptic('light')}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "onyx-card group block perspective-2000 relative overflow-hidden",
        app.shape,
        app.type === 'blade-hero' && "w-full h-[320px] mb-8",
        app.type === 'blade-deck-left' && "w-[90%] h-[240px] -mb-20 self-start z-10 shadow-2xl",
        app.type === 'blade-deck-right' && "w-[90%] h-[240px] mb-12 self-end z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
      )}
    >
      {/* Generative Pulse Line */}
      <div className="pulse-line" style={{ animationDelay: `${delay}s` }} />

      {/* Holographic Blueprint Background */}
      <div className="absolute inset-0 z-10 p-12 overflow-hidden flex items-center justify-center">
        <div className="w-full h-full max-w-[240px] max-h-[240px]">
          <Blueprint type={app.blueprint} />
        </div>
      </div>

      {/* Pure Obsidian Surface */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none" />

      {/* Background Gradient with Scanning Effect */}
      <div className={cn(
        "absolute inset-0 z-0 bg-gradient-to-br opacity-5",
        app.color
      )}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-bg via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full p-8 flex flex-col">
        {/* Top Section - ID and Status */}
        <div className="flex justify-between items-start">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group-hover:translate-x-2 transition-transform duration-500"
          >
            <div className="flex items-center gap-3 mb-1">

              <p className="text-[10px] text-onyx-purple font-black uppercase tracking-[0.4em]">
                ONYX
              </p>
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black uppercase tracking-wide leading-none text-white group-hover:text-onyx-purple transition-colors duration-500">
                {app.name.split(' ')[0]}
              </h2>
              <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-onyx-muted group-hover:text-onyx-purple/60 transition-colors duration-500 mt-1">
                {app.name.split(' ').slice(1).join(' ')}
              </span>
            </div>
          </motion.div>

          <div className="text-[8px] font-mono text-onyx-muted opacity-40 uppercase tracking-widest text-right">
            SEC_LEVEL: 05<br />
            STATUS: ACTIVE
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="mt-auto flex justify-between items-end">
          <div className="w-8 h-px bg-onyx-purple/20 group-hover:w-16 transition-all duration-700" />
          <ArrowUpRight className="w-4 h-4 text-onyx-purple opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
        </div>
      </div>
    </motion.a>
  );
};

export default function App() {
  const { scrollY } = useScroll();

  // Direct mapping of scroll to style values for peak performance
  const headerMaxWidth = useTransform(scrollY, [0, 80], ["512px", "64px"]);
  const headerPadding = useTransform(scrollY, [0, 80], ["16px", "8px"]);
  const headerRadius = useTransform(scrollY, [0, 80], [28, 20]);
  const headerX = useTransform(scrollY, [0, 80], [0, -130]);
  const contentOpacity = useTransform(scrollY, [0, 40], [1, 0]);
  const contentScale = useTransform(scrollY, [0, 80], [1, 0.8]);

  // Smooth out the motion values with a spring
  const springConfig = { stiffness: 400, damping: 40, mass: 1, restDelta: 0.001 };
  const smoothMaxWidth = useSpring(headerMaxWidth, springConfig);
  const smoothPadding = useSpring(headerPadding, springConfig);
  const smoothRadius = useSpring(headerRadius, springConfig);
  const smoothX = useSpring(headerX, springConfig);
  const smoothOpacity = useSpring(contentOpacity, springConfig);



  return (
    <div className="min-h-screen bg-onyx-bg text-white p-4 md:p-6 flex flex-col items-center">
      {/* Header - Modular & Optimized for iPhone 16 Pro */}
      <motion.header
        style={{
          maxWidth: smoothMaxWidth,
          padding: smoothPadding,
          borderRadius: smoothRadius,
          x: smoothX,
          width: "100%",
          top: "max(24px, env(safe-area-inset-top))",
        }}
        onPointerDown={() => triggerHaptic('medium')}
        className="mb-10 flex justify-between items-center bg-black/60 backdrop-blur-3xl border border-white/10 sticky z-50 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        <div className="flex items-center gap-4 min-w-max">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <img src={`${import.meta.env.BASE_URL}icon.png`} alt="Onyx Hub" className="w-full h-full object-cover" />
          </div>

          <motion.div
            style={{ opacity: smoothOpacity, scale: contentScale }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-[2px] bg-onyx-purple" />
              <span className="text-[8px] font-bold text-onyx-purple uppercase tracking-[0.3em]">Onyx OS</span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">
              Onyx<span className="text-onyx-purple ml-1">Hub</span>
            </h1>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: smoothOpacity, scale: contentScale }}
          className="flex flex-col items-end min-w-max"
        >
          <span className="text-[8px] font-bold text-onyx-muted uppercase tracking-widest mb-0.5">System Time</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono font-bold tabular-nums tracking-tighter">
              {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tokyo' })}
            </span>
          </div>
        </motion.div>
      </motion.header>

      {/* Fluid Blade Stack */}
      <div className="w-full max-w-lg flex flex-col items-stretch">
        {apps.map((app, index) => (
          <AppCard key={app.id} app={app} delay={0.1 * (index + 1)} />
        ))}


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
