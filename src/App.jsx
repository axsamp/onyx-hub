import React from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Calculator,
  Map,
  Images,
  ArrowUpRight,
  Cloud,
  Plane
} from 'lucide-react';
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
    name: 'Onyx Converter',
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
      <circle cx="50" cy="50" r="45" strokeWidth="0.1" strokeDasharray="1 2" />
      <circle cx="50" cy="50" r="35" strokeWidth="0.2" />
      
      {/* Compass Needle */}
      <motion.path 
        d="M50 15 L55 50 L50 85 L45 50 Z" 
        strokeWidth="0.3" 
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="origin-center"
      />
      
      {/* Cardinal Points */}
      <text x="50" y="10" className="fill-onyx-purple text-[5px] font-black" textAnchor="middle">N</text>
      <text x="92" y="52" className="fill-onyx-purple text-[5px] font-black" textAnchor="middle">E</text>
      <text x="50" y="95" className="fill-onyx-purple text-[5px] font-black" textAnchor="middle">S</text>
      <text x="8" y="52" className="fill-onyx-purple text-[5px] font-black" textAnchor="middle">W</text>

      {/* Degree Ticks */}
      {Array.from({ length: 72 }).map((_, i) => (
        <line 
          key={i} 
          x1="50" y1="12" x2="50" y2={i % 9 === 0 ? 18 : 14} 
          strokeWidth="0.1" 
          transform={`rotate(${i * 5} 50 50)`} 
        />
      ))}
    </svg>
  );
  if (type === 'data-grid') {
    const [numbers, setNumbers] = React.useState([]);
    React.useEffect(() => {
      const timer = setInterval(() => {
        const count = Math.random() > 0.5 ? 2 : 1;
        setNumbers(Array.from({ length: count }, (_, i) => ({
          id: Math.random(),
          val: Math.floor(Math.random() * 10).toString(),
          x: 30 + Math.random() * 40,
          y: 35 + Math.random() * 35,
          delay: i * 1.0 // Balanced stagger
        })));
      }, 4000); // 4s cycle
      return () => clearInterval(timer);
    }, []);

    return (
      <svg className={blueprintStyles} viewBox="0 0 100 100">
        {Array.from({ length: 10 }).map((_, i) => (
          <React.Fragment key={i}>
            <line x1="0" y1={i * 10} x2="100" y2={i * 10} strokeWidth="0.05" />
            <line x1={i * 10} y1="0" x2={i * 10} y2="100" strokeWidth="0.05" />
          </React.Fragment>
        ))}
        <rect x="20" y="20" width="60" height="60" strokeWidth="0.3" strokeDasharray="2 2" />
        
        {/* Balanced Rhythmic Random Numbers */}
        <g className="fill-onyx-purple text-[8px] font-black">
          <AnimatePresence>
            {numbers.map((n) => (
              <motion.text
                key={n.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ 
                  duration: 0.4, // Snappy entry
                  delay: n.delay,
                  exit: { duration: 1.5 } // Lingering exit
                }}
                x={n.x}
                y={n.y}
                textAnchor="middle"
              >
                {n.val}
              </motion.text>
            ))}
          </AnimatePresence>
        </g>

        <path d="M10 10 L25 10 M10 10 L10 25" strokeWidth="0.4" />
        <path d="M75 90 L90 90 M90 90 L90 75" strokeWidth="0.4" />
      </svg>
    );
  }
  if (type === 'matrix') return (
    <svg className={blueprintStyles} viewBox="0 0 100 100">
      <path d="M18 32 L38 32 L38 68 L18 68 Z" strokeWidth="0.2" />
      <path d="M62 32 L82 32 L82 68 L62 68 Z" strokeWidth="0.2" />
      
      {/* Animated Transfer Arrow (One-Way Loop) */}
      <motion.g
        animate={{ 
          x: [-8, 34],
          opacity: [0, 1, 1, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "linear",
          times: [0, 0.1, 0.7, 0.8]
        }}
      >
        <path d="M40 50 L48 50" strokeWidth="0.4" strokeDasharray="1 1" />
        <path d="M44 47 L48 50 L44 53" strokeWidth="0.4" />
      </motion.g>

      <circle cx="50" cy="50" r="15" strokeWidth="0.1" strokeDasharray="1 1" />
      
      {Array.from({ length: 3 }).map((_, i) => (
        <React.Fragment key={i}>
          <motion.line 
            x1={20} y1={38 + i * 12} x2={36} y2={38 + i * 12} 
            strokeWidth="0.1"
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
          <motion.line 
            x1={64} y1={38 + i * 12} x2={80} y2={38 + i * 12} 
            strokeWidth="0.1"
            animate={{ opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
          />
        </React.Fragment>
      ))}
    </svg>
  );
  if (type === 'celestial') return (
    <svg className={blueprintStyles} viewBox="0 0 100 100">
      <path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" strokeWidth="0.2" />
      <path d="M50 15 L80 30 L80 70 L50 85 L20 70 L20 30 Z" strokeWidth="0.1" strokeDasharray="1 1" />
      <circle cx="50" cy="50" r="10" strokeWidth="0.2" />
      <path d="M50 5 L50 95 M10 25 L90 75 M10 75 L90 25" strokeWidth="0.1" />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={50 + 40 * Math.cos(i * Math.PI / 3 + Math.PI / 6)} cy={50 + 40 * Math.sin(i * Math.PI / 3 + Math.PI / 6)} r="1.5" strokeWidth="0.1" />
      ))}
    </svg>
  );
  return null;
};

const AppCard = ({ app, delay }) => {
  const { scrollY } = useScroll();
  // Parallax offset for the image inside the card
  const yRange = [0, 1000];
  const imageY = useTransform(scrollY, yRange, [0, -60]);
  const smoothImageY = useSpring(imageY, { stiffness: 100, damping: 30 });

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
        {/* Text Area - Blade Typography (Moved to Top Left) */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative group-hover:translate-x-2 transition-transform duration-500"
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-onyx-purple shadow-[0_0_12px_rgba(192,132,252,1)]" />
            <p className="text-[12px] text-onyx-purple font-black uppercase tracking-[0.5em]">
              {app.id}
            </p>
          </div>
        </motion.div>

        {/* Bottom Spacer */}
        <div className="mt-auto" />
      </div>
    </motion.a>
  );
};

export default function App() {
  const [weather, setWeather] = React.useState({ temp: '--', condition: 'Updating...' });
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

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true');
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;

        // Simple mapping for weather codes
        const conditions = {
          0: 'Clear Skies',
          1: 'Mainly Clear',
          2: 'Partly Cloudy',
          3: 'Overcast',
          45: 'Foggy',
          48: 'Depositing Rime Fog',
          51: 'Light Drizzle',
          61: 'Rainy',
          71: 'Snowy',
          95: 'Thunderstorms'
        };

        setWeather({
          temp: `${temp}°`,
          condition: conditions[code] || 'Clear Skies'
        });
      } catch (e) {
        console.error('Weather fetch failed', e);
        setWeather({ temp: '22°', condition: 'Clear Skies' });
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 mins
    return () => clearInterval(interval);
  }, []);

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

        {/* Tokyo Status Blade - Minimalist & Integrated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="onyx-card p-6 flex items-center justify-between bg-onyx-purple/5 border-onyx-purple/20 obsidian-shape-1 h-[100px] overflow-hidden group hover:border-onyx-purple/40 transition-colors mt-8 relative"
        >
          <div className="flex flex-col gap-1 relative z-10">
            <span className="text-[10px] font-black text-onyx-purple uppercase tracking-[0.6em]">Tokyo</span>
            <p className="text-[10px] text-onyx-muted font-bold uppercase tracking-[0.4em]">
              {weather.condition}
            </p>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter text-white">{weather.temp}</span>
              <span className="text-sm font-bold text-onyx-purple/60 uppercase">C</span>
            </div>
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-sm border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-onyx-purple animate-pulse shadow-[0_0_8px_rgba(192,132,252,1)]" />
              <span className="text-[8px] font-bold text-onyx-purple uppercase tracking-widest">Live</span>
            </div>
          </div>

          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(192,132,252,0.03)_1px,transparent_1px)] bg-[size:100%_20px] pointer-events-none opacity-50" />
        </motion.div>
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
