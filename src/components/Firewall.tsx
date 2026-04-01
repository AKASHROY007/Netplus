import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  ChevronDown, 
  Globe, 
  Tv, 
  Music, 
  Smartphone, 
  MessageSquare,
  Wifi,
  Signal,
  CheckCircle2,
  XCircle,
  WifiOff,
  SignalLow,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const INITIAL_APP_LIST = [
  { 
    id: 1, 
    name: 'Chrome', 
    category: 'Web Browser', 
    icon: Globe, 
    color: 'text-primary',
    boxColor: 'bg-on-primary-container',
    mobileData: true,
    wifi: true 
  },
  { 
    id: 2, 
    name: 'YouTube', 
    category: 'Entertainment', 
    icon: Tv, 
    color: 'text-error',
    boxColor: 'bg-error-container',
    mobileData: false,
    wifi: true 
  },
  { 
    id: 3, 
    name: 'Spotify', 
    category: 'Music', 
    icon: Music, 
    color: 'text-secondary',
    boxColor: 'bg-secondary-container',
    mobileData: true,
    wifi: true 
  },
  { 
    id: 4, 
    name: 'Android System', 
    category: 'System • Restricted', 
    icon: Smartphone, 
    color: 'text-on-surface-variant',
    boxColor: 'bg-surface-container-highest',
    mobileData: true,
    wifi: true,
    isSystem: true
  },
  { 
    id: 6, 
    name: 'System UI', 
    category: 'System • Core', 
    icon: Shield, 
    color: 'text-primary',
    boxColor: 'bg-on-primary-container',
    mobileData: true,
    wifi: true,
    isSystem: true
  },
  { 
    id: 7, 
    name: 'Network Manager', 
    category: 'System • Utility', 
    icon: Wifi, 
    color: 'text-secondary',
    boxColor: 'bg-secondary-container',
    mobileData: true,
    wifi: true,
    isSystem: true
  },
  { 
    id: 5, 
    name: 'Discord', 
    category: 'Social', 
    icon: MessageSquare, 
    color: 'text-tertiary',
    boxColor: 'bg-on-tertiary-fixed-variant',
    mobileData: false,
    wifi: false 
  },
];

export default function Firewall() {
  const [apps, setApps] = useState(INITIAL_APP_LIST);
  const [globalBlock, setGlobalBlock] = useState(false);
  const [showSystem, setShowSystem] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | 'All'>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = ['All', 'Active', 'Wi-Fi', ...new Set(INITIAL_APP_LIST.map(app => {
    if (app.category.includes(' • ')) return app.category.split(' • ')[0];
    return app.category;
  }))];

  const toggleAppNetwork = (id: number, type: 'mobileData' | 'wifi') => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, [type]: !app[type] } : app
    ));
  };

  const getStatusInfo = (mobileData: boolean, wifi: boolean) => {
    if (globalBlock) return { label: 'Globally Blocked', color: 'text-error', icon: Shield, bg: 'bg-on-error', glow: '' };
    if (mobileData && wifi) return { label: 'Allowed', color: 'text-secondary', icon: CheckCircle2, bg: 'bg-on-secondary', glow: '' };
    if (!mobileData && !wifi) return { label: 'Blocked', color: 'text-error', icon: XCircle, bg: 'bg-on-error', glow: '' };
    if (wifi) return { label: 'Wi-Fi Only', color: 'text-primary', icon: Wifi, bg: 'bg-on-primary', glow: '' };
    return { label: 'Mobile Only', color: 'text-orange-400', icon: Signal, bg: 'bg-orange-950', glow: '' };
  };

  const blockedCount = globalBlock ? apps.length : apps.filter(app => !app.mobileData && !app.wifi).length;

  return (
    <main className="pt-40 px-6 pb-6 max-w-2xl mx-auto w-full relative flex flex-col">
      {/* Global Block Control */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-5 rounded-[1.5rem] bg-surface-container-low relative overflow-hidden group border border-outline-variant/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="font-headline text-base font-bold tracking-tight text-primary">Global Security</span>
            <span className="text-on-surface-variant text-xs font-medium">Block all background traffic</span>
          </div>
          <button 
            onClick={() => setGlobalBlock(!globalBlock)}
            className="w-12 h-7 rounded-full bg-surface-container-highest relative p-1 transition-all duration-300"
          >
            <div className={cn(
              "w-5 h-5 rounded-full bg-primary-fixed shadow-[0_0_12px_rgba(129,236,255,0.4)] transition-transform duration-300",
              globalBlock ? "translate-x-5" : "translate-x-0"
            )}></div>
          </button>
        </div>
      </motion.section>

      {/* Search & Filter Controls */}
      <div className="flex gap-2 mb-6 relative">
        <div className="flex-1 relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input 
            className="w-full bg-surface-container-highest border-none rounded-xl py-3 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 transition-all font-medium" 
            placeholder="Search apps..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "bg-surface-container-highest w-12 rounded-xl flex items-center justify-center border transition-all active:scale-95",
            selectedCategory !== 'All' ? "text-primary border-primary/30" : "text-primary-fixed border-primary/5"
          )}
        >
          <Filter className="w-4 h-4" />
        </button>

        {/* Category Filter Menu */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-48 bg-surface-container-high border border-outline-variant/20 rounded-2xl shadow-2xl z-50 overflow-hidden p-2"
            >
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsFilterOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                      selectedCategory === cat 
                        ? "bg-primary text-on-primary" 
                        : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface">Application Control</h2>
          <p className="text-on-surface-variant text-xs">Managing {apps.length} installed applications</p>
        </div>
        <button 
          onClick={() => setShowSystem(!showSystem)}
          className={cn(
            "text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2",
            showSystem ? "text-primary" : "text-primary/70 hover:text-primary"
          )}
        >
          {showSystem ? 'Hide System Apps' : 'Show System Apps'} 
          <ChevronDown className={cn("w-4 h-4 transition-transform", showSystem && "rotate-180")} />
        </button>
      </div>

      {/* App List */}
      <div className="space-y-4">
        {apps
          .filter(app => {
            const query = searchQuery.toLowerCase();
            const matchesSearch = app.name.toLowerCase().includes(query) || 
                                app.category.toLowerCase().includes(query);
            const matchesSystem = showSystem ? true : !app.isSystem;
            const matchesCategory = selectedCategory === 'All' || 
                                  (selectedCategory === 'Active' ? (app.mobileData || app.wifi) :
                                   selectedCategory === 'Wi-Fi' ? app.wifi :
                                   app.category.startsWith(selectedCategory));
            return matchesSearch && matchesSystem && matchesCategory;
          })
          .map((app, idx) => {
          const status = getStatusInfo(app.mobileData, app.wifi);
          return (
            <motion.div 
              key={app.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "p-3 rounded-xl transition-all duration-300 group border border-outline-variant/10",
                app.isSystem 
                  ? "bg-surface-container-high border-dashed" 
                  : "bg-surface-container-high hover:bg-surface-container-highest"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn("flex items-center gap-3", app.isSystem && "opacity-70")}>
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center p-2 relative", (app as any).boxColor || "bg-surface-container")}>
                    <app.icon className={cn("w-5 h-5", app.color)} />
                    {/* Status Indicator Dot */}
                    <div className={cn(
                      "absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-container-high flex items-center justify-center",
                      status.bg
                    )}>
                      <status.icon className={cn("w-1.5 h-1.5", status.color)} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-semibold text-sm text-on-surface">{app.name}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded-full border border-outline-variant/10",
                        status.bg
                      )}>
                        <status.icon className={cn("w-2.5 h-2.5", status.color)} />
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-tight",
                          status.color
                        )}>
                          {status.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant/50 font-bold uppercase tracking-widest">{app.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile Data Toggle */}
                  <button 
                    onClick={() => !globalBlock && toggleAppNetwork(app.id, 'mobileData')}
                    disabled={globalBlock}
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center border transition-all active:scale-90",
                      globalBlock ? "bg-surface-container text-on-surface-variant/10 border-transparent cursor-not-allowed opacity-50" :
                      app.mobileData 
                        ? "bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary hover:text-on-secondary" 
                        : "bg-surface-container text-on-surface-variant/30 border-transparent hover:border-secondary/30"
                    )}
                  >
                    <Signal className="w-5 h-5" />
                  </button>
                  {/* WiFi Toggle */}
                  <button 
                    onClick={() => !globalBlock && toggleAppNetwork(app.id, 'wifi')}
                    disabled={globalBlock}
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center border transition-all active:scale-90",
                      globalBlock ? "bg-surface-container text-on-surface-variant/10 border-transparent cursor-not-allowed opacity-50" :
                      app.wifi 
                        ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-on-primary" 
                        : "bg-surface-container text-on-surface-variant/30 border-transparent hover:border-primary/30"
                    )}
                  >
                    <Wifi className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Kinetic Summary Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mt-8 p-4 rounded-[1.5rem] bg-gradient-to-br from-surface-variant to-surface border border-primary/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 blur-[60px]"></div>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-headline font-bold text-base text-primary mb-0.5">Network Hygiene</h3>
            <p className="text-xs text-on-surface-variant max-w-[180px]">{blockedCount} application{blockedCount !== 1 ? 's are' : ' is'} currently blocked.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-headline font-black text-secondary tracking-tighter">1.2 GB</div>
            <div className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant">Data Prevented</div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
