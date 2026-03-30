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
import Analytics from './components/Analytics';
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
      "flex flex-col items-center justify-center transition-all duration-300 relative h-16 w-full max-w-[80px] rounded-2xl overflow-hidden group",
      active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
    )}
  >
    <div className="relative z-10 flex flex-col items-center justify-center gap-1">
      <Icon className={cn("w-6 h-6 transition-transform group-active:scale-90", active && "fill-current")} />
      <span className="font-label text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{label}</span>
    </div>
    {active && (
      <motion.div 
        layoutId="active-nav"
        className="absolute inset-x-1 inset-y-1 bg-primary/10 rounded-xl z-0"
        transition={{ type: "spring", stiffness: 400, damping: 35 }}
      />
    )}
  </button>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analytics' | 'firewall' | 'monitoring' | 'settings'>('dashboard');
  const [profileImage, setProfileImage] = useState<string>(() => {
    return localStorage.getItem('netpulse-profile-image') || "https://picsum.photos/seed/netpulse-user/200/200";
  });

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

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
        return <Dashboard />;
      case 'analytics':
        return <Analytics />;
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
      <header className="fixed top-8 w-full z-50 flex items-center justify-between px-8 py-4 bg-gradient-to-b from-surface-container-low/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/5">
            <Gauge className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-headline tracking-tighter font-black text-3xl text-primary">NetPulse</h1>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentPage('settings')}
            className={cn(
              "p-3 rounded-2xl transition-all border border-outline-variant/10 shadow-sm",
              currentPage === 'settings' ? "bg-primary text-on-primary" : "bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface-variant"
            )}
          >
            <Settings className="w-6 h-6" />
          </button>
          <label className="relative cursor-pointer group">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
            <div className="w-12 h-12 rounded-2xl bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all shadow-md">
              <img 
                className="w-full h-full object-cover" 
                alt="User profile" 
                src={profileImage}
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
            </div>
          </label>
        </div>
      </header>

      {renderPage()}

      {/* BottomNavBar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md z-50 flex justify-around items-center h-20 px-4 bg-surface-container-low/90 backdrop-blur-2xl rounded-[2.5rem] border border-outline-variant/10 shadow-2xl overflow-hidden">
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
      </nav>
    </div>
  );
}
