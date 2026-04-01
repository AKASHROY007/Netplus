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
  RefreshCw,
  AlertTriangle
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
    <main className="pt-32 px-6 max-w-2xl mx-auto space-y-10 relative min-h-[calc(100vh-80px)] flex flex-col">
      {/* Page Title */}
      <motion.section 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-0.5"
      >
        <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">Settings</h2>
        <p className="font-body text-on-surface-variant text-xs">Configure your connection preferences and monitoring tools.</p>
      </motion.section>

      {/* Preference Grid: Unit Selection */}
      <section className="space-y-2">
        <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/60 ml-1">Data preferences</h3>
        <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/10 shadow-sm dark:shadow-none">
          <div className="p-3 flex items-center justify-between hover:bg-surface-container-highest transition-all duration-300 group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary/60 dark:text-primary shrink-0">
                <Ruler className="w-4 h-4" />
              </div>
              <div>
                <p className="font-headline font-bold text-sm leading-tight text-on-surface">Unit Measurement</p>
                <p className="font-body text-[10px] text-on-surface-variant">Choose bit rate display</p>
              </div>
            </div>
            <div className="flex bg-surface-container p-0.5 rounded-full border border-outline-variant/10 shrink-0">
              <button 
                onClick={() => handleUnitChange('Mbps')}
                className={cn(
                  "px-3 py-1 rounded-full font-headline font-bold text-[9px] transition-all",
                  unit === 'Mbps' ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:text-primary bg-surface-container-highest/30 dark:bg-transparent"
                )}
              >
                Mbps
              </button>
              <button 
                onClick={() => handleUnitChange('MB/s')}
                className={cn(
                  "px-3 py-1 rounded-full font-headline font-bold text-[9px] transition-all",
                  unit === 'MB/s' ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:text-primary bg-surface-container-highest/30 dark:bg-transparent"
                )}
              >
                MB/s
              </button>
            </div>
          </div>

          <div className="p-3 flex items-center justify-between hover:bg-surface-container-highest transition-all duration-300 border-t border-outline-variant/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary/60 dark:text-primary shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="font-headline font-bold text-sm leading-tight text-on-surface">Background Monitoring</p>
                <p className="font-body text-[10px] text-on-surface-variant">
                  {isChecking ? (
                    <span className="text-primary flex items-center gap-1.5">
                      <RefreshCw className="w-2 h-2 animate-spin" /> Checking...
                    </span>
                  ) : lastCheck ? (
                    `Last: ${lastCheck}`
                  ) : (
                    "Periodic speed checks"
                  )}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setBgMonitoring(!bgMonitoring)}
              className={cn(
                "w-8 h-4 rounded-full relative transition-all duration-300 flex items-center shrink-0",
                bgMonitoring ? "bg-primary shadow-[0_0_8px_rgba(129,236,255,0.3)]" : "bg-on-surface-variant/20"
              )}
            >
              <motion.div 
                animate={{ x: bgMonitoring ? 18 : 2 }}
                className="w-3 h-3 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          <div className="p-3 flex items-center justify-between hover:bg-surface-container-highest transition-all duration-300 border-t border-outline-variant/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary/60 dark:text-primary shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-headline font-bold text-sm leading-tight text-on-surface">Data Saver</p>
                <p className="font-body text-[10px] text-on-surface-variant">Limit background activity</p>
              </div>
            </div>
            <button 
              onClick={() => setDataSaver(!dataSaver)}
              className={cn(
                "w-8 h-4 rounded-full relative transition-all duration-300 flex items-center shrink-0",
                dataSaver ? "bg-primary shadow-[0_0_8px_rgba(129,236,255,0.3)]" : "bg-on-surface-variant/20"
              )}
            >
              <motion.div 
                animate={{ x: dataSaver ? 18 : 2 }}
                className="w-3 h-3 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Alerts & Constraints */}
      <section className="space-y-2">
        <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-secondary/60 ml-1">Thresholds & Alerts</h3>
        <div className={cn(
          "bg-surface-container-low rounded-2xl p-3.5 space-y-3 border transition-all duration-500 shadow-sm dark:shadow-none",
          showAlert ? "border-error shadow-[0_0_15px_rgba(220,38,38,0.2)]" : "border-outline-variant/10"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                showAlert ? "bg-error text-on-error animate-pulse" : "bg-surface-container-highest text-error/60 dark:text-error"
              )}>
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-headline font-bold text-sm leading-tight text-on-surface">Data Limit Alert</p>
                <p className={cn(
                  "font-body text-[10px] transition-colors truncate",
                  showAlert ? "text-error font-bold" : "text-on-surface-variant"
                )}>
                  {showAlert ? "CRITICAL: Exceeded!" : "Notify on usage limit"}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={cn("font-headline text-lg font-bold transition-colors", showAlert ? "text-error" : "text-primary")}>{limitDisplay.value}</span>
              <span className="font-body text-[9px] font-bold text-on-surface-variant uppercase ml-0.5">{limitDisplay.unit}</span>
            </div>
          </div>
          <div className="relative pt-1">
            <input 
              className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary custom-slider" 
              max={10000 * 1024} 
              min="10" 
              step="10"
              type="range" 
              value={dataLimit}
              onChange={(e) => handleDataLimitChange(parseInt(e.target.value))}
            />
            <div className="flex justify-between mt-1.5 font-body text-[8px] font-bold text-on-surface-variant/40 tracking-tighter uppercase">
              <span>10 MB</span>
              <span>10000 GB</span>
            </div>
          </div>
          {showAlert && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-2 bg-error/10 rounded-lg border border-error/20 flex items-center gap-2"
            >
              <AlertTriangle className="w-3 h-3 text-error shrink-0" />
              <p className="text-[9px] text-error font-bold uppercase leading-none">Exceeded limit</p>
            </motion.div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-headline text-lg font-semibold uppercase tracking-widest text-secondary/80 ml-1">Appearance</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleThemeChange('dark')}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-surface-container-low p-4 text-left hover:bg-surface-container-highest transition-all duration-300 border shadow-sm dark:shadow-none",
              theme === 'dark' ? "border-secondary" : "border-outline-variant/10"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
                <Moon className="w-4 h-4 fill-current" />
              </div>
              {theme === 'dark' && <CheckCircle className="w-5 h-5 text-secondary" />}
            </div>
            <p className="font-headline font-bold text-sm leading-tight">Dark Mode</p>
            <p className="font-body text-[10px] text-on-surface-variant mt-0.5">Nocturnal theme</p>
          </button>
          
          <button 
            onClick={() => handleThemeChange('light')}
            className={cn(
              "group relative overflow-hidden rounded-2xl bg-surface-container-low p-4 text-left hover:bg-surface-container-highest transition-all duration-300 border shadow-sm dark:shadow-none",
              theme === 'light' ? "border-secondary" : "border-outline-variant/10"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                <Sun className="w-4 h-4" />
              </div>
              {theme === 'light' && <CheckCircle className="w-5 h-5 text-secondary" />}
            </div>
            <p className="font-headline font-bold text-sm leading-tight text-on-surface-variant">Light Mode</p>
            <p className="font-body text-[10px] text-on-surface-variant/60 mt-0.5">High-contrast</p>
          </button>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <button className="w-full py-4 rounded-[1.5rem] bg-error/10 hover:bg-error/20 transition-colors flex items-center justify-center gap-3 group border border-error/20">
          <RefreshCw className="w-5 h-5 text-error group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-headline font-bold text-error uppercase tracking-widest text-sm">Reset all configurations</span>
        </button>
      </section>

      {/* Version Number */}
      <div className="text-center pb-12 pt-2">
        <p className="font-body text-[10px] text-on-surface-variant/40 uppercase tracking-[0.2em]">Version 1.2.0 (Stable)</p>
      </div>
    </main>
  );
}
