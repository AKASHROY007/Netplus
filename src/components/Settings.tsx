import React, { useState } from 'react';
import { 
  CheckCircle,
  HelpCircle,
  Ruler,
  Activity,
  Zap,
  Bell,
  Moon,
  Sun,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Settings() {
  const [unit, setUnit] = useState<'Mbps' | 'MB/s'>(() => {
    return (localStorage.getItem('netpulse-unit') as 'Mbps' | 'MB/s') || 'Mbps';
  });
  const [bgMonitoring, setBgMonitoring] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [dataLimit, setDataLimit] = useState(() => {
    // We'll store this in MB now. Default 500 GB = 512000 MB
    const saved = localStorage.getItem('netpulse-data-limit-mb');
    if (saved) return parseInt(saved);
    const oldGb = localStorage.getItem('netpulse-data-limit');
    if (oldGb) return parseInt(oldGb) * 1024;
    return 512000;
  });
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('netpulse-theme') as 'dark' | 'light') || 'dark';
  });

  const handleUnitChange = (newUnit: 'Mbps' | 'MB/s') => {
    setUnit(newUnit);
    localStorage.setItem('netpulse-unit', newUnit);
    window.dispatchEvent(new Event('netpulse-unit-change'));
  };

  const handleDataLimitChange = (val: number) => {
    setDataLimit(val);
    localStorage.setItem('netpulse-data-limit-mb', val.toString());
  };

  // Mock background monitoring simulation
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (bgMonitoring) {
      interval = setInterval(() => {
        setIsChecking(true);
        setTimeout(() => {
          setIsChecking(false);
          setLastCheck(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 2000);
      }, 15000); // Check every 15 seconds
    }
    return () => clearInterval(interval);
  }, [bgMonitoring]);

  // Data limit alert simulation
  // Mock current usage as 512.4 GB for demonstration
  const currentUsageMB = 512.4 * 1024;
  React.useEffect(() => {
    if (currentUsageMB > dataLimit) {
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [dataLimit]);

  const formatDataLimit = (mb: number) => {
    if (mb < 1024) return { value: mb, unit: 'MB' };
    return { value: (mb / 1024).toFixed(mb % 1024 === 0 ? 0 : 1), unit: 'GB' };
  };

  const limitDisplay = formatDataLimit(dataLimit);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    localStorage.setItem('netpulse-theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <main className="pt-32 pb-32 px-6 max-w-2xl mx-auto space-y-10">
      {/* Page Title */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h2 className="font-headline text-4xl font-bold tracking-tight text-primary">Settings</h2>
        <p className="font-body text-on-surface-variant text-sm">Configure your connection preferences and monitoring tools.</p>
      </motion.section>

      {/* Preference Grid: Unit Selection */}
      <section className="space-y-4">
        <h3 className="font-headline text-lg font-semibold uppercase tracking-widest text-secondary/80 ml-1">Data preferences</h3>
        <div className="bg-surface-container-low rounded-[1.5rem] overflow-hidden border border-outline-variant/10">
          <div className="p-6 flex items-center justify-between hover:bg-surface-container-highest transition-all duration-300 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                <Ruler className="w-6 h-6" />
              </div>
              <div>
                <p className="font-headline font-bold text-lg leading-tight">Unit Measurement</p>
                <p className="font-body text-sm text-on-surface-variant">Choose your preferred bit rate display</p>
              </div>
            </div>
            <div className="flex bg-surface-container p-1 rounded-full border border-outline-variant/10">
              <button 
                onClick={() => handleUnitChange('Mbps')}
                className={cn(
                  "px-5 py-2 rounded-full font-headline font-bold text-xs transition-all",
                  unit === 'Mbps' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:text-primary"
                )}
              >
                Mbps
              </button>
              <button 
                onClick={() => handleUnitChange('MB/s')}
                className={cn(
                  "px-5 py-2 rounded-full font-headline font-bold text-xs transition-all",
                  unit === 'MB/s' ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:text-primary"
                )}
              >
                MB/s
              </button>
            </div>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-surface-container-highest transition-all duration-300 border-t border-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="font-headline font-bold text-lg leading-tight">Background Monitoring</p>
                <p className="font-body text-sm text-on-surface-variant">
                  {isChecking ? (
                    <span className="text-primary flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Checking speed...
                    </span>
                  ) : lastCheck ? (
                    `Last check: ${lastCheck}`
                  ) : (
                    "Periodic speed checks in the background"
                  )}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setBgMonitoring(!bgMonitoring)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                bgMonitoring ? "bg-secondary" : "bg-surface-container-highest"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300",
                bgMonitoring ? "left-6" : "left-1"
              )} />
            </button>
          </div>

          <div className="p-6 flex items-center justify-between hover:bg-surface-container-highest transition-all duration-300 border-t border-outline-variant/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <p className="font-headline font-bold text-lg leading-tight">Data Saver</p>
                <p className="font-body text-sm text-on-surface-variant">Reduce data usage by limiting background activity.</p>
              </div>
            </div>
            <button 
              onClick={() => setDataSaver(!dataSaver)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors duration-300",
                dataSaver ? "bg-secondary" : "bg-surface-container-highest"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300",
                dataSaver ? "left-6" : "left-1"
              )} />
            </button>
          </div>
        </div>
      </section>

      {/* Alerts & Constraints */}
      <section className="space-y-4">
        <h3 className="font-headline text-lg font-semibold uppercase tracking-widest text-secondary/80 ml-1">Thresholds & Alerts</h3>
        <div className={cn(
          "bg-surface-container-low rounded-[1.5rem] p-6 space-y-6 border transition-all duration-500",
          showAlert ? "border-error shadow-[0_0_20px_rgba(220,38,38,0.2)]" : "border-outline-variant/10"
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                showAlert ? "bg-error text-on-error animate-pulse" : "bg-surface-container-highest text-error"
              )}>
                <Bell className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-headline font-bold text-lg leading-tight">Data Limit Alert</p>
                <p className={cn(
                  "font-body text-sm transition-colors",
                  showAlert ? "text-error font-bold" : "text-on-surface-variant"
                )}>
                  {showAlert ? "CRITICAL: Data limit exceeded!" : "Notify when monthly usage exceeds limit"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className={cn("font-headline text-2xl font-bold transition-colors", showAlert ? "text-error" : "text-primary")}>{limitDisplay.value}</span>
              <span className="font-body text-xs font-bold text-on-surface-variant uppercase ml-1">{limitDisplay.unit}</span>
            </div>
          </div>
          <div className="relative pt-2">
            <input 
              className="w-full h-2 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary" 
              max={10000 * 1024} 
              min="10" 
              step="10"
              type="range" 
              value={dataLimit}
              onChange={(e) => handleDataLimitChange(parseInt(e.target.value))}
            />
            <div className="flex justify-between mt-2 font-body text-[10px] font-bold text-on-surface-variant/50 tracking-tighter uppercase">
              <span>10 MB</span>
              <span>10000 GB</span>
            </div>
          </div>
          {showAlert && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 bg-error/10 rounded-xl border border-error/20 flex items-center gap-3"
            >
              <div className="w-2 h-2 rounded-full bg-error animate-ping" />
              <p className="text-xs text-error font-bold">Current usage (512.4 GB) exceeds your {limitDisplay.value} {limitDisplay.unit} threshold.</p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-headline text-lg font-semibold uppercase tracking-widest text-secondary/80 ml-1">Appearance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleThemeChange('dark')}
            className={cn(
              "group relative overflow-hidden rounded-[1.5rem] bg-surface-container-low p-6 text-left hover:bg-surface-container-highest transition-all duration-300 border",
              theme === 'dark' ? "border-secondary" : "border-outline-variant/10"
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <Moon className="w-5 h-5 fill-current" />
              </div>
              {theme === 'dark' && <CheckCircle className="w-6 h-6 text-secondary" />}
            </div>
            <p className="font-headline font-bold text-lg">NetPulse Dark</p>
            <p className="font-body text-xs text-on-surface-variant">Deep nocturnal teal theme</p>
          </button>
          
          <button 
            onClick={() => handleThemeChange('light')}
            className={cn(
              "group relative overflow-hidden rounded-[1.5rem] bg-surface-container-low p-6 text-left hover:bg-surface-container-highest transition-all duration-300 border",
              theme === 'light' ? "border-secondary" : "border-outline-variant/10"
            )}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                <Sun className="w-5 h-5" />
              </div>
              {theme === 'light' && <CheckCircle className="w-6 h-6 text-secondary" />}
            </div>
            <p className="font-headline font-bold text-lg text-on-surface-variant">Kinetic Light</p>
            <p className="font-body text-xs text-on-surface-variant/60">High-contrast editorial light mode</p>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="pb-10">
        <button className="w-full py-4 rounded-[1.5rem] bg-error/10 hover:bg-error/20 transition-colors flex items-center justify-center gap-3 group border border-error/20">
          <RefreshCw className="w-5 h-5 text-error group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-headline font-bold text-error uppercase tracking-widest text-sm">Reset all configurations</span>
        </button>
      </section>
    </main>
  );
}
