import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowDown, 
  ArrowUp, 
  Wifi, 
  Signal, 
  Network, 
  ChevronRight, 
  Share,
  X,
  Clock,
  MapPin,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

const GAUGE_DATA = [
  { name: 'Used', value: 65 },
  { name: 'Remaining', value: 35 },
];

const GAUGE_COLORS = ['var(--color-primary)', 'var(--color-surface-container-highest)'];

const DATA_SETS: Record<string, any[]> = {
  Daily: [
    { time: '00:00', download: 40, upload: 20 },
    { time: '04:00', download: 50, upload: 30 },
    { time: '08:00', download: 60, upload: 40 },
    { time: '12:00', download: 75, upload: 50 },
    { time: '16:00', download: 55, upload: 35 },
    { time: '20:00', download: 40, upload: 20 },
    { time: '23:59', download: 25, upload: 10 },
  ],
  Weekly: [
    { time: 'Mon', download: 300, upload: 150 },
    { time: 'Tue', download: 450, upload: 200 },
    { time: 'Wed', download: 400, upload: 180 },
    { time: 'Thu', download: 550, upload: 250 },
    { time: 'Fri', download: 600, upload: 300 },
    { time: 'Sat', download: 350, upload: 120 },
    { time: 'Sun', download: 280, upload: 100 },
  ],
  Monthly: [
    { time: 'Week 1', download: 2200, upload: 1100 },
    { time: 'Week 2', download: 2800, upload: 1400 },
    { time: 'Week 3', download: 2500, upload: 1200 },
    { time: 'Week 4', download: 3100, upload: 1600 },
  ],
};

const HISTORY_ITEMS = [
  { id: 1, name: 'Starlink 12-B (Home_WiFi_5G)', time: 'Today, 10:42 AM • Berlin, DE', download: 342.1, upload: 42.5, ping: '18', jitter: '2', icon: Wifi, color: 'text-primary', ip: '192.168.1.1', provider: 'SpaceX Starlink', status: 'Connected' },
  { id: 2, name: 'LTE Mobile 5G', time: 'Yesterday, 08:15 PM • Mobile Data', download: 89.4, upload: 12.8, ping: '42', jitter: '8', icon: Signal, color: 'text-secondary', ip: '10.0.0.1', provider: 'T-Mobile', status: 'Connected' },
  { id: 3, name: 'Office Fiber 1', time: '2 days ago • Berlin, DE', download: 944.8, upload: 890.2, ping: '4', jitter: '1', icon: Network, color: 'text-primary', ip: '172.16.0.1', provider: 'Deutsche Telekom', status: 'Disconnected' },
];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('Daily');
  const [selectedTest, setSelectedTest] = useState<typeof HISTORY_ITEMS[0] | null>(null);
  const [unit, setUnit] = useState<'Mbps' | 'MB/s'>(() => {
    return (localStorage.getItem('netpulse-unit') as 'Mbps' | 'MB/s') || 'Mbps';
  });
  const [dataLimit, setDataLimit] = useState(() => {
    const saved = localStorage.getItem('netpulse-data-limit-mb');
    return saved ? parseInt(saved) : 512000;
  });

  // Listen for changes
  React.useEffect(() => {
    const handleUnitChange = () => {
      const newUnit = (localStorage.getItem('netpulse-unit') as 'Mbps' | 'MB/s') || 'Mbps';
      setUnit(newUnit);
    };
    const handleLimitChange = () => {
      const saved = localStorage.getItem('netpulse-data-limit-mb');
      if (saved) setDataLimit(parseInt(saved));
    };
    window.addEventListener('netpulse-unit-change', handleUnitChange);
    window.addEventListener('storage', handleLimitChange);
    return () => {
      window.removeEventListener('netpulse-unit-change', handleUnitChange);
      window.removeEventListener('storage', handleLimitChange);
    };
  }, []);

  const performanceData = DATA_SETS[timeRange] || DATA_SETS.Daily;

  // Unit conversion helper
  const formatValue = (val: number) => {
    if (unit === 'MB/s') {
      return (val / 8).toFixed(1);
    }
    return val.toFixed(1);
  };

  // Calculate totals for the selected range
  const totalDownload = performanceData.reduce((acc, curr) => acc + curr.download, 0);
  const totalUpload = performanceData.reduce((acc, curr) => acc + curr.upload, 0);
  const totalUsage = (totalDownload + totalUpload).toFixed(1);

  // Gauge calculation
  const mockMonthlyUsageGB = 332.4; 
  const limitGB = dataLimit / 1024;
  const usedPercent = Math.min(100, Math.round((mockMonthlyUsageGB / limitGB) * 100));
  
  const gaugeData = [
    { name: 'Used', value: usedPercent },
    { name: 'Remaining', value: 100 - usedPercent },
  ];

  return (
    <main className="pt-32 px-6 max-w-5xl mx-auto relative">
      {/* Hero Section */}
      <section className="mb-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-label text-on-surface-variant uppercase tracking-[0.25em] text-[10px] font-bold mb-2">Network Consumption</p>
            <h2 className="font-headline text-5xl font-bold text-primary tracking-tight">Analytics</h2>
          </motion.div>
          <div className="flex bg-surface-container rounded-full p-1.5 self-start md:self-auto border border-outline-variant/10">
            {['Daily', 'Weekly', 'Monthly'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-bold transition-all duration-300",
                  timeRange === range ? "bg-primary text-on-primary shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-primary"
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </header>

        {/* Main Usage Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Gauge Card */}
          <div className="md:col-span-2 bg-surface-container-low rounded-[2.5rem] p-8 relative overflow-hidden border border-outline-variant/10 group">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 h-full">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      startAngle={225}
                      endAngle={-45}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={10}
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index % GAUGE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-headline font-bold text-primary">{usedPercent}%</span>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Used</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center text-center md:text-left">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-headline text-2xl font-bold">Total Usage</h3>
                    <p className="text-on-surface-variant text-sm">Session: 14h 22m</p>
                  </div>
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                  </div>
                </div>
                <div className="flex items-end gap-2 mb-6 justify-center md:justify-start">
                  <span className="font-headline text-7xl font-extrabold tracking-tighter text-primary">{totalUsage}</span>
                  <span className="font-headline text-2xl font-bold text-primary-dim pb-3">GB</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold text-on-surface-variant">
                  <div className="flex items-center gap-1 text-secondary">
                    <ArrowUp className="w-3 h-3" />
                    <span>12.4%</span>
                  </div>
                  <span>vs. last period</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          </div>

          {/* Small Metric Cards */}
          <div className="flex flex-col gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex-1 bg-surface-container-highest rounded-[2.5rem] p-7 flex flex-col justify-between border border-outline-variant/10"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <ArrowDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Download</p>
                <p className="font-headline text-3xl font-bold">{totalDownload.toFixed(1)} <span className="text-sm font-medium text-on-surface-variant">GB</span></p>
              </div>
            </motion.div>
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex-1 bg-surface-container-highest rounded-[2.5rem] p-7 flex flex-col justify-between border border-outline-variant/10"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <ArrowUp className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-bold mb-1">Upload</p>
                <p className="font-headline text-3xl font-bold">{totalUpload.toFixed(1)} <span className="text-sm font-medium text-on-surface-variant">GB</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage Chart Section */}
      <section className="mb-12">
        <div className="bg-surface-container-low rounded-[2.5rem] p-8 border border-outline-variant/10 shadow-xl shadow-black/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h3 className="font-headline text-xl font-bold mb-1">Performance Flow</h3>
              <p className="text-xs text-on-surface-variant font-medium">Real-time network stability analysis</p>
            </div>
            <div className="flex gap-6 p-3 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(129,236,255,0.5)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Download</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(69,254,201,0.5)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Upload</span>
              </div>
            </div>
          </div>
          
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="var(--color-outline-variant)" opacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)', fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '4 4' }}
                  formatter={(value: number) => [`${formatValue(value)} ${unit}`, '']}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface-container-highest)', 
                    border: '1px solid var(--color-outline-variant)', 
                    borderRadius: '16px', 
                    color: 'var(--color-on-surface)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="download" 
                  stroke="var(--color-primary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorDownload)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="upload" 
                  stroke="var(--color-secondary)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorUpload)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Speed Test History */}
      <section className="mb-24">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-2xl font-bold tracking-tight">Recent Tests</h3>
          <button className="px-4 py-2 rounded-xl bg-surface-container-highest/50 text-primary text-xs font-bold flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/10">
            Export Logs <Share className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="space-y-4">
          {HISTORY_ITEMS.map((item, idx) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedTest(item)}
              className="bg-surface-container p-5 rounded-[1.5rem] flex items-center justify-between hover:bg-surface-container-highest transition-all group cursor-pointer border border-outline-variant/5 hover:border-primary/20"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className={cn("w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/30 transition-colors", item.color)}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  {item.status === 'Connected' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-lg leading-tight">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-on-surface-variant font-medium">{item.time}</p>
                    <div className="w-1 h-1 rounded-full bg-outline-variant/30 sm:hidden" />
                    <p className="text-[10px] font-bold text-primary sm:hidden">{formatValue(Number(item.download))} {unit}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 md:gap-12 text-right">
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Download</p>
                  <p className="font-headline font-bold text-primary text-xl">{formatValue(Number(item.download))} <span className="text-xs uppercase opacity-60">{unit}</span></p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Ping</p>
                  <p className="font-headline font-bold text-on-surface text-xl">{item.ping} <span className="text-xs uppercase opacity-60">ms</span></p>
                </div>
                <button className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary transition-all border border-outline-variant/10 group-hover:border-primary">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Test Detail Modal */}
      <AnimatePresence>
        {selectedTest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTest(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-low rounded-[2.5rem] border border-outline-variant/20 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-8 pb-0 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className={cn("w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/10", selectedTest.color)}>
                    <selectedTest.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface">{selectedTest.name}</h3>
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedTest.time}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTest(null)}
                  className="p-2 rounded-full hover:bg-surface-container-highest transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Speed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-highest/50 p-6 rounded-3xl border border-outline-variant/5">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDown className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Download</span>
                    </div>
                    <p className="font-headline text-3xl font-bold text-primary">{formatValue(selectedTest.download)} <span className="text-sm opacity-60">{unit}</span></p>
                  </div>
                  <div className="bg-surface-container-highest/50 p-6 rounded-3xl border border-outline-variant/5">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUp className="w-4 h-4 text-secondary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Upload</span>
                    </div>
                    <p className="font-headline text-3xl font-bold text-secondary">{formatValue(selectedTest.upload)} <span className="text-sm opacity-60">{unit}</span></p>
                  </div>
                </div>

                {/* Network Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-surface-container/30 rounded-2xl">
                    <p className="text-[9px] font-bold uppercase text-on-surface-variant mb-1">Ping</p>
                    <p className="font-headline font-bold text-lg">{selectedTest.ping} ms</p>
                  </div>
                  <div className="text-center p-4 bg-surface-container/30 rounded-2xl">
                    <p className="text-[9px] font-bold uppercase text-on-surface-variant mb-1">Jitter</p>
                    <p className="font-headline font-bold text-lg">{selectedTest.jitter} ms</p>
                  </div>
                  <div className="text-center p-4 bg-surface-container/30 rounded-2xl">
                    <p className="text-[9px] font-bold uppercase text-on-surface-variant mb-1">Loss</p>
                    <p className="font-headline font-bold text-lg">0.0%</p>
                  </div>
                </div>

                {/* Connection Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-on-surface-variant uppercase">ISP</span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">{selectedTest.provider}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-on-surface-variant uppercase">IP Address</span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">{selectedTest.ip}</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-on-surface-variant uppercase">Server</span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">Berlin, DE</span>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedTest(null)}
                  className="w-full py-5 rounded-3xl bg-primary text-on-primary font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
