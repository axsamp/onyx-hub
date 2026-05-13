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
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    if (type === 'light') navigator.vibrate(10);
    else if (type === 'medium') navigator.vibrate(20);
  }
};

const apps = [
  {
    id: 'itinerary',
    name: 'Itinerary Command',
    url: 'https://axsamp.github.io/onyx-itinerary/',
    screenshot: '/onyx-itinerary.png',
    color: 'from-onyx-purple to-indigo-900',
    type: 'blade-hero',
    shape: 'obsidian-shape-1'
  },
  {
    id: 'budget',
    name: 'Budget Buffer',
    url: 'https://axsamp.github.io/budget-buffer/',
    screenshot: '/budget-buffer.png',
    color: 'from-onyx-purple to-purple-900',
    type: 'blade-deck-left',
    shape: 'obsidian-shape-2'
  },
  {
    id: 'converter',
    name: 'Onyx Converter',
    url: 'https://axsamp.github.io/onyx-converter/',
    screenshot: '/onyx-converter.png',
    color: 'from-onyx-purple to-violet-900',
    type: 'blade-deck-right',
    shape: 'obsidian-shape-1'
  },
  {
    id: 'stamps',
    name: 'Stamp Collector',
    url: 'https://axsamp.github.io/onyx-stamps/',
    screenshot: '/onyx-stamps.png',
    color: 'from-onyx-purple to-fuchsia-900',
    type: 'blade-hero',
    shape: 'obsidian-shape-2'
  },
];

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
      {/* Background Gradient with Scanning Effect */}
      <div className={cn(
        "absolute inset-0 z-0 bg-gradient-to-br opacity-20",
        app.color
      )}>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-bg via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full p-8 flex flex-col justify-between">
        <div className="flex justify-end items-start">
          <div className="w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Text Area - Blade Typography */}
        <div className="mt-auto">
          <div className="relative group-hover:translate-x-2 transition-transform duration-500">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-onyx-purple shadow-[0_0_12px_rgba(192,132,252,1)]" />
              <p className="text-[12px] text-onyx-purple font-black uppercase tracking-[0.5em]">
                {app.id}
              </p>
            </div>
          </div>
        </div>
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
            <img src="/icon.png" alt="Onyx Hub" className="w-full h-full object-cover" />
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
