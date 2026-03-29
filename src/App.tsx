import React, { useState, useEffect } from 'react';
import { 
  Gauge, 
  Search, 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  Activity,
  Shield,
  MapPin,
  Signal,
  Wifi,
  Battery,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import Dashboard from './components/Dashboard';
import Firewall from './components/Firewall';
import SettingsPage from './components/Settings';
import MonitoringPage from './components/Monitoring';

// --- Components ---

const StatusBar = () => {
  const [speeds, setSpeeds] = useState({ up: 0, down: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setSpeeds({
        up: Math.floor(Math.random() * 500) + 50,
        down: Math.floor(Math.random() * 2000) + 200
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatSpeed = (kbps: number) => {
    if (kbps > 1024) return `${(kbps / 1024).toFixed(1)} MB/s`;
    return `${kbps} KB/s`;
  };

  return (
    <div className="fixed top-0 w-full z-[100] px-6 py-2 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-md border-b border-outline-variant/5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold font-headline text-on-surface">09:41</span>
          <MapPin className="w-3 h-3 text-on-surface-variant" />
        </div>
        <div className="flex items-center gap-3 border-l border-outline-variant/20 pl-4">
          <div className="flex items-center gap-1">
            <ArrowDown className="w-2.5 h-2.5 text-secondary" />
            <span className="text-[9px] font-mono font-bold text-secondary/80">{formatSpeed(speeds.down)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUp className="w-2.5 h-2.5 text-primary" />
            <span className="text-[9px] font-mono font-bold text-primary/80">{formatSpeed(speeds.up)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Signal className="w-3 h-3 text-on-surface-variant" />
        <Wifi className="w-3 h-3 text-on-surface-variant" />
        <Battery className="w-3 h-3 text-on-surface-variant" />
      </div>
    </div>
  );
};

const NavItem = ({ active, icon: Icon, label, onClick }: { active?: boolean, icon: any, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center py-2 px-5 transition-all duration-300 relative",
      active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
    )}
  >
    {active && (
      <motion.div 
        layoutId="active-nav"
        className="absolute inset-0 bg-primary/10 rounded-2xl -z-10"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    )}
    <Icon className={cn("w-6 h-6 mb-1", active && "fill-current")} />
    <span className="font-label text-[10px] font-semibold uppercase tracking-widest">{label}</span>
  </button>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'firewall' | 'monitoring' | 'settings'>('firewall');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('netpulse-profile-image') || "https://picsum.photos/seed/netpulse-user/200/200";
  });

  // Theme initialization
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('netpulse-theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('netpulse-profile-image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
      case 'analytics':
        return <Dashboard />;
      case 'firewall':
        return <Firewall />;
      case 'monitoring':
        return <MonitoringPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-on-surface-variant">
            <h2 className="text-2xl font-headline font-bold mb-2">Coming Soon</h2>
            <p className="text-sm">The {currentPage} module is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-background text-on-background font-body min-h-screen pb-32 selection:bg-primary/30">
      <StatusBar />

      {/* TopAppBar */}
      <header className="fixed top-8 w-full z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-surface-container-low/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Gauge className="w-6 h-6 text-primary" />
          </div>
          <h1 className="font-headline tracking-tight font-bold text-2xl text-primary">NetPulse</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full bg-surface-container-highest/50 hover:bg-surface-container-highest transition-colors border border-outline-variant/10"
          >
            <Search className="w-5 h-5 text-on-surface-variant" />
          </button>
          <button 
            onClick={() => setCurrentPage('settings')}
            className={cn(
              "p-2.5 rounded-full transition-all border border-outline-variant/10",
              currentPage === 'settings' ? "bg-primary text-on-primary" : "bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface-variant"
            )}
          >
            <Settings className="w-5 h-5" />
          </button>
          <label className="relative cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
            <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all">
              <img 
                className="w-full h-full object-cover" 
                alt="User profile" 
                src={profileImage}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <RefreshCw className="w-4 h-4 text-white" />
              </div>
            </div>
          </label>
        </div>
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-xl flex flex-col items-center pt-32 px-6"
          >
            <div className="w-full max-w-2xl relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
              <input 
                autoFocus
                className="w-full bg-surface-container-highest border-none rounded-[2rem] py-6 pl-16 pr-16 text-xl font-headline font-bold text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/50 transition-all shadow-2xl" 
                placeholder="Search NetPulse..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-surface-container transition-colors"
              >
                <X className="w-6 h-6 text-on-surface-variant" />
              </button>
            </div>

            <div className="mt-12 w-full max-w-2xl space-y-6">
              {searchQuery ? (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 ml-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Check Firewall', page: 'firewall', icon: Shield },
                      { label: 'View Monitoring', page: 'monitoring', icon: Activity },
                      { label: 'System Settings', page: 'settings', icon: Settings }
                    ].filter(a => a.label.toLowerCase().includes(searchQuery.toLowerCase()))
                     .map((action) => (
                      <button 
                        key={action.page}
                        onClick={() => {
                          setCurrentPage(action.page as any);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container-highest border border-outline-variant/10 transition-all group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <action.icon className="w-5 h-5" />
                        </div>
                        <span className="font-headline font-bold text-on-surface">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-on-surface-variant font-headline font-bold text-lg">Type to search across NetPulse</p>
                  <p className="text-on-surface-variant/50 text-sm mt-2">Search for apps, connections, or settings</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {renderPage()}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-surface-container-low/90 backdrop-blur-xl rounded-t-[3rem] border-t border-outline-variant/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <NavItem 
          active={currentPage === 'dashboard'} 
          icon={LayoutDashboard} 
          label="Dashboard" 
          onClick={() => setCurrentPage('dashboard')}
        />
        <NavItem 
          active={currentPage === 'analytics'} 
          icon={BarChart3} 
          label="Analytics" 
          onClick={() => setCurrentPage('analytics')}
        />
        <NavItem 
          active={currentPage === 'firewall'} 
          icon={Shield} 
          label="Firewall" 
          onClick={() => setCurrentPage('firewall')}
        />
        <NavItem 
          active={currentPage === 'monitoring'} 
          icon={Activity} 
          label="Monitoring" 
          onClick={() => setCurrentPage('monitoring')}
        />
        <NavItem 
          active={currentPage === 'settings'} 
          icon={Settings} 
          label="Settings" 
          onClick={() => setCurrentPage('settings')}
        />
      </nav>
    </div>
  );
}
