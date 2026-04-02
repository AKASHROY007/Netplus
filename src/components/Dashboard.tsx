import React, { useState, useEffect, useMemo } from 'react';
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
  ShieldCheck,
  Zap
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

// ============================================
// TYPE DEFINITIONS & INTERFACES
// ============================================

type NetworkType = 'wifi' | 'signal' | 'fiber';
type ConnectionStatus = 'Connected' | 'Disconnected';
type TimeRange = 'Daily' | 'Weekly' | 'Monthly';
type SpeedUnit = 'Mbps' | 'MB/s';

interface HistoryItem {
  id: number;
  type: NetworkType;
  name: string;
  code: string;
  subtitle: string;
  time: string;
  download: number;
  upload: number;
  ping: string;
  jitter: string;
  strength: number;
  color: string;
  ip: string;
  provider: string;
  status: ConnectionStatus;
  location: string;
}

interface PerformanceDataPoint {
  time: string;
  download: number;
  upload: number;
}

interface CalculatedMetrics {
  totalDownload: number;
  totalUpload: number;
  totalUsage: string;
}

// ============================================
// CONSTANTS
// ============================================

const TIME_RANGES: readonly TimeRange[] = ['Daily', 'Weekly', 'Monthly'] as const;

const GAUGE_COLORS = ['var(--color-primary)', 'var(--color-surface-container-highest)'];

const DATA_SETS: Record<TimeRange, PerformanceDataPoint[]> = {
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

const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 1,
    type: 'wifi',
    name: 'Starlink',
    code: '12-B',
    subtitle: '(Home_WiFi_5G)',
    time: 'Today, 10:42 AM • Berlin, DE',
    download: 342.1,
    upload: 42.5,
    ping: '18',
    jitter: '2',
    strength: 0.9,
    color: 'text-primary',
    ip: '192.168.1.1',
    provider: 'SpaceX Starlink',
    status: 'Connected',
    location: 'Berlin, DE',
  },
  {
    id: 2,
    type: 'signal',
    name: 'LTE Mobile',
    code: '5G',
    subtitle: 'Mobile Data',
    time: 'Yesterday, 08:15 PM • Mobile Data',
    download: 89.4,
    upload: 12.8,
    ping: '42',
    jitter: '8',
    strength: 0.6,
    color: 'text-secondary',
    ip: '10.0.0.1',
    provider: 'T-Mobile',
    status: 'Connected',
    location: 'New York, US',
  },
  {
    id: 3,
    type: 'fiber',
    name: 'Office Fiber',
    code: '1',
    subtitle: 'Berlin, DE',
    time: '2 days ago • Berlin, DE',
    download: 944.8,
    upload: 890.2,
    ping: '4',
    jitter: '1',
    strength: 1.0,
    color: 'text-primary',
    ip: '172.16.0.1',
    provider: 'Deutsche Telekom',
    status: 'Disconnected',
    location: 'Berlin, DE',
  },
];

// ============================================
// ANIMATED COMPONENTS
// ============================================

interface AnimatedIconProps {
  active?: boolean;
  strength?: number;
  speed?: number;
  className?: string;
}

const WifiAnimated: React.FC<AnimatedIconProps> = ({ 
  active = true, 
  strength = 0.8, 
  className = "" 
}) => {
  const bars = [0.2, 0.4, 0.7, 1.0];
  
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("w-full h-full", className)}
    >
      <path 
        d="M12 20h.01" 
        className={cn(!active && "opacity-20", active && "text-primary")} 
      />
      {bars.map((b, i) => (
        <motion.path
          key={`wifi-bar-${i}`}
          d={i === 0 ? "M8.5 16.5a5 5 0 0 1 7 0" : i === 1 ? "M5 13a10 10 0 0 1 14 0" : i === 2 ? "M2 9.5a15 15 0 0 1 20 0" : ""}
          initial={false}
          animate={{
            opacity: !active ? 0.1 : (strength >= b ? 1 : 0.2),
            scale: active ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
          className={active ? "text-primary" : "text-on-surface-variant/20"}
        />
      ))}
    </svg>
  );
};

const SignalAnimated: React.FC<AnimatedIconProps> = ({ 
  active = true, 
  strength = 0.6, 
  className = "" 
}) => {
  const bars = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("w-full h-full", className)}
    >
      {bars.map((b, i) => (
        <motion.path
          key={`signal-bar-${i}`}
          d={`M${2 + i * 4} ${22 - (i + 1) * 4}v${(i + 1) * 4}`}
          initial={false}
          animate={{
            opacity: !active ? 0.1 : (strength >= b ? 1 : 0.2),
            height: active ? [(i + 1) * 4, (i + 1) * 4 + 2, (i + 1) * 4] : (i + 1) * 4
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className={active ? "text-secondary" : "text-on-surface-variant/20"}
        />
      ))}
    </svg>
  );
};

const FiberAnimated: React.FC<AnimatedIconProps> = ({ 
  active = true, 
  speed = 1.0, 
  className = "" 
}) => {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={cn("w-full h-full", className)}
    >
      <path 
        d="M12 2v8" 
        className={cn(!active && "opacity-20", active && "text-primary")} 
      />
      <path 
        d="m16 12-4 4-4-4" 
        className={cn(!active && "opacity-20", active && "text-primary")} 
      />
      <path 
        d="M12 16v6" 
        className={cn(!active && "opacity-20", active && "text-primary")} 
      />
      
      {active && (
        <>
          <motion.circle
            cx="12" 
            cy="2" 
            r="2"
            animate={{ r: [2, 3, 2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2 / speed, repeat: Infinity }}
            className="fill-primary"
          />
          <motion.path
            d="M12 2v20"
            strokeDasharray="4 4"
            animate={{ strokeDashoffset: [0, -20] }}
            transition={{ duration: 3 / speed, repeat: Infinity, ease: "linear" }}
            className="stroke-primary/40"
          />
          <motion.circle
            cx="12" 
            cy="22" 
            r="2"
            animate={{ r: [2, 3, 2], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2 / speed, repeat: Infinity, delay: 0.5 }}
            className="fill-primary"
          />
        </>
      )}
    </svg>
  );
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Safely calculate percentage without division by zero
 */
const calculatePercentage = (value: number, total: number): string => {
  if (total === 0) return '0';
  return ((value / total) * 100).toFixed(0);
};

/**
 * Format speed value based on selected unit
 */
const formatSpeedValue = (val: number, unit: SpeedUnit): string => {
  if (unit === 'MB/s') {
    return (val / 8).toFixed(1);
  }
  return val.toFixed(1);
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function Dashboard() {
  // State management
  const [timeRange, setTimeRange] = useState<TimeRange>('Daily');
  const [selectedTest, setSelectedTest] = useState<HistoryItem | null>(null);
  const [unit, setUnit] = useState<SpeedUnit>(() => {
    const stored = localStorage.getItem('netpulse-unit');
    return (stored === 'Mbps' || stored === 'MB/s') ? stored : 'Mbps';
  });
  const [dataLimit, setDataLimit] = useState(() => {
    const saved = localStorage.getItem('netpulse-data-limit-mb');
    return saved ? parseInt(saved, 10) : 512000;
  });

  // Listen for storage changes
  useEffect(() => {
    const handleUnitChange = () => {
      const newUnit = localStorage.getItem('netpulse-unit');
      if (newUnit === 'Mbps' || newUnit === 'MB/s') {
        setUnit(newUnit);
      }
    };

    const handleLimitChange = () => {
      const saved = localStorage.getItem('netpulse-data-limit-mb');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          setDataLimit(parsed);
        }
      }
    };

    window.addEventListener('netpulse-unit-change', handleUnitChange);
    window.addEventListener('storage', handleLimitChange);

    return () => {
      window.removeEventListener('netpulse-unit-change', handleUnitChange);
      window.removeEventListener('storage', handleLimitChange);
    };
  }, []);

  // Get current performance data
  const performanceData = useMemo(
    () => DATA_SETS[timeRange] || DATA_SETS.Daily,
    [timeRange]
  );

  // Memoized calculations
  const metrics: CalculatedMetrics = useMemo(() => {
    const totalDown = performanceData.reduce((acc, curr) => acc + curr.download, 0);
    const totalUp = performanceData.reduce((acc, curr) => acc + curr.upload, 0);
    
    return {
      totalDownload: totalDown,
      totalUpload: totalUp,
      totalUsage: (totalDown + totalUp).toFixed(1),
    };
  }, [performanceData]);

  // Gauge data calculation
  const mockMonthlyUsageGB = 332.4;
  const limitGB = dataLimit / 1024;
  const usedPercent = Math.min(100, Math.round((mockMonthlyUsageGB / limitGB) * 100));

  const gaugeData = useMemo(
    () => [
      { name: 'Used', value: usedPercent },
      { name: 'Remaining', value: 100 - usedPercent },
    ],
    [usedPercent]
  );

  // Export logs as CSV
  const handleExportLogs = () => {
    try {
      const headers = [
        'ID',
        'Type',
        'Name',
        'Code',
        'Subtitle',
        'Time',
        'Download (Mbps)',
        'Upload (Mbps)',
        'Ping (ms)',
        'Jitter (ms)',
        'IP',
        'Provider',
        'Status',
      ];

      const csvContent = [
        headers.join(','),
        ...HISTORY_ITEMS.map((item) =>
          [
            item.id,
            item.type,
            `"${item.name}"`,
            `"${item.code}"`,
            `"${item.subtitle}"`,
            `"${item.time}"`,
            item.download,
            item.upload,
            item.ping,
            item.jitter,
            item.ip,
            `"${item.provider}"`,
            item.status,
          ].join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `netpulse_logs_${new Date().toISOString().split('T')[0]}.csv`
      );
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTest(null);
      }
    };

    if (selectedTest) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [selectedTest]);

  return (
    <main className="pt-40 px-6 pb-6 max-w-5xl mx-auto relative flex flex-col">
      {/* Hero Section */}
      <section className="mb-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-label text-on-surface-variant uppercase tracking-[0.25em] text-[10px] font-bold mb-2">
              Network Consumption
            </p>
            <h2 className="font-headline text-5xl font-bold text-primary tracking-tight">
              Analytics
            </h2>
          </motion.div>

          {/* Time range selector */}
          <div className="flex bg-surface-container rounded-full p-1.5 self-start md:self-auto border border-outline-variant/10">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  'px-6 py-2 rounded-full text-xs font-bold transition-all duration-300',
                  timeRange === range
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                    : 'text-on-surface-variant hover:text-primary'
                )}
              >
                {range}
              </button>
            ))}
          </div>
        </header>

        {/* Main Usage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data Gauge Card */}
          <div className="md:col-span-2 bg-surface-container-low rounded-2xl p-4 relative overflow-hidden border border-outline-variant/10 shadow-sm dark:shadow-none group">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 h-full">
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={60}
                      startAngle={225}
                      endAngle={-45}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={6}
                    >
                      {gaugeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={GAUGE_COLORS[index % GAUGE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-headline font-bold text-primary">
                    {usedPercent}%
                  </span>
                  <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">
                    Used
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center text-center md:text-left min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-headline text-lg font-bold truncate">
                      Total Usage
                    </h3>
                    <p className="text-on-surface-variant text-[10px]">
                      Session: 14h 22m
                    </p>
                  </div>
                  <div className="p-1 bg-secondary/10 rounded-lg shrink-0">
                    <TrendingUp className="w-3.5 h-3.5 text-secondary" />
                  </div>
                </div>
                <div className="flex items-end gap-1.5 mb-2 justify-center md:justify-start">
                  <span className="font-headline text-4xl font-extrabold tracking-tighter text-primary leading-none">
                    {metrics.totalUsage}
                  </span>
                  <span className="font-headline text-lg font-bold text-primary-dim">
                    GB
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-on-surface-variant">
                  <div className="flex items-center gap-1 text-secondary">
                    <ArrowUp className="w-2.5 h-2.5" />
                    <span>12.4%</span>
                  </div>
                  <span className="opacity-60">vs. last period</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Metric Card */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-container-highest rounded-2xl p-4 border border-outline-variant/10 h-full flex flex-col justify-center gap-4"
            >
              {/* Download Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <ArrowDown className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-on-surface-variant text-[7px] uppercase tracking-[0.2em] font-bold truncate">
                        Download
                      </p>
                      <p className="font-headline text-base font-bold leading-none truncate">
                        {metrics.totalDownload.toFixed(1)}{' '}
                        <span className="text-[8px] font-medium opacity-60">GB</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-[8px] font-bold text-primary bg-primary/5 px-1 py-0.5 rounded border border-primary/10 shrink-0">
                    {calculatePercentage(metrics.totalDownload, metrics.totalDownload + metrics.totalUpload)}%
                  </div>
                </div>
                <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(metrics.totalDownload / (metrics.totalDownload + metrics.totalUpload)) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <ArrowUp className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-on-surface-variant text-[7px] uppercase tracking-[0.2em] font-bold truncate">
                        Upload
                      </p>
                      <p className="font-headline text-base font-bold leading-none truncate">
                        {metrics.totalUpload.toFixed(1)}{' '}
                        <span className="text-[8px] font-medium opacity-60">GB</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-[8px] font-bold text-secondary bg-secondary/5 px-1 py-0.5 rounded border border-secondary/10 shrink-0">
                    {calculatePercentage(metrics.totalUpload, metrics.totalDownload + metrics.totalUpload)}%
                  </div>
                </div>
                <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(metrics.totalUpload / (metrics.totalDownload + metrics.totalUpload)) * 100}%`,
                    }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-secondary"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Usage Chart Section */}
      <section className="mb-8">
        <div className="bg-surface-container-low rounded-[2rem] p-6 border border-outline-variant/10 shadow-xl dark:shadow-black/20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="font-headline text-lg font-bold mb-0.5">
                Performance Flow
              </h3>
              <p className="text-[10px] text-on-surface-variant font-medium">
                Real-time network stability analysis
              </p>
            </div>
            <div className="flex gap-4 p-2 bg-surface-container-highest/30 rounded-xl border border-outline-variant/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(129,236,255,0.5)]"></div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Download
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(69,254,201,0.5)]"></div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Upload
                </span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-secondary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-secondary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="8 8"
                  vertical={false}
                  stroke="var(--color-outline-variant)"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: 'var(--color-on-surface-variant)',
                    fontWeight: 'bold',
                  }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{
                    stroke: 'var(--color-primary)',
                    strokeWidth: 1,
                    strokeDasharray: '4 4',
                  }}
                  formatter={(value: number) => [
                    `${formatSpeedValue(value, unit)} ${unit}`,
                    '',
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--color-surface-container-highest)',
                    border: '1px solid var(--color-outline-variant)',
                    borderRadius: '16px',
                    color: 'var(--color-on-surface)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                  }}
                  itemStyle={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
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
      <section className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline text-xl font-bold tracking-tight">
            Recent Tests
          </h3>
          <button
            onClick={handleExportLogs}
            className="px-3 py-1.5 rounded-xl bg-surface-container-highest/50 text-primary text-[10px] font-bold flex items-center gap-2 hover:bg-primary hover:text-on-primary transition-all border border-outline-variant/10"
          >
            Export Logs <Share className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {HISTORY_ITEMS.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedTest(item)}
              className="w-full text-left bg-surface-container p-3.5 rounded-[1.5rem] flex items-center justify-between hover:bg-surface-container-highest transition-all group border border-outline-variant/5 hover:border-primary/20"
            >
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/30 transition-colors p-3'
                    )}
                  >
                    {item.type === 'wifi' && (
                      <WifiAnimated
                        active={item.status === 'Connected'}
                        strength={item.strength}
                      />
                    )}
                    {item.type === 'signal' && (
                      <SignalAnimated
                        active={item.status === 'Connected'}
                        strength={item.strength}
                      />
                    )}
                    {item.type === 'fiber' && (
                      <FiberAnimated
                        active={item.status === 'Connected'}
                        speed={item.download / 500}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-lg leading-tight">
                    {item.name}
                    {item.code && (
                      <span className="text-xs font-medium text-on-surface-variant/60 ml-1.5">
                        ({item.code})
                      </span>
                    )}
                    <span className="text-[11px] font-medium text-on-surface-variant ml-1.5 opacity-70">
                      {item.subtitle}
                    </span>
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      {item.time}
                    </p>
                    <div className="w-1 h-1 rounded-full bg-outline-variant/30 sm:hidden" />
                    <p className="text-[10px] font-bold text-primary sm:hidden">
                      {formatSpeedValue(item.download, unit)} {unit}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 md:gap-12 text-right">
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Download
                  </p>
                  <p className="font-headline font-bold text-primary text-xl">
                    {formatSpeedValue(item.download, unit)}{' '}
                    <span className="text-xs uppercase opacity-60">{unit}</span>
                  </p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Ping
                  </p>
                  <p className="font-headline font-bold text-on-surface text-xl">
                    {item.ping}{' '}
                    <span className="text-xs uppercase opacity-60">ms</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface-container-highest group-hover:bg-primary group-hover:text-on-primary transition-all border border-outline-variant/10 group-hover:border-primary shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.button>
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
              <div className="p-6 pb-0 flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl bg-surface-container-highest flex items-center justify-center border border-outline-variant/10 p-3'
                    )}
                  >
                    {selectedTest.type === 'wifi' && (
                      <WifiAnimated
                        active={selectedTest.status === 'Connected'}
                        strength={selectedTest.strength}
                      />
                    )}
                    {selectedTest.type === 'signal' && (
                      <SignalAnimated
                        active={selectedTest.status === 'Connected'}
                        strength={selectedTest.strength}
                      />
                    )}
                    {selectedTest.type === 'fiber' && (
                      <FiberAnimated
                        active={selectedTest.status === 'Connected'}
                        speed={selectedTest.download / 500}
                      />
                    )}
                  </div>
                  <div>
                    <h3 className="font-headline text-2xl font-bold text-on-surface flex items-baseline">
                      {selectedTest.name}
                      {selectedTest.code && (
                        <span className="text-sm font-medium text-on-surface-variant/60 ml-1.5">
                          ({selectedTest.code})
                        </span>
                      )}
                      <span className="text-sm font-medium text-on-surface-variant ml-2 opacity-60">
                        {selectedTest.subtitle}
                      </span>
                    </h3>
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedTest.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Speed Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-highest/50 p-4 rounded-3xl border border-outline-variant/5">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDown className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Download
                      </span>
                    </div>
                    <p className="font-headline text-3xl font-bold text-primary">
                      {formatSpeedValue(selectedTest.download, unit)}{' '}
                      <span className="text-sm opacity-60">{unit}</span>
                    </p>
                  </div>
                  <div className="bg-surface-container-highest/50 p-4 rounded-3xl border border-outline-variant/5">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUp className="w-4 h-4 text-secondary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                        Upload
                      </span>
                    </div>
                    <p className="font-headline text-3xl font-bold text-secondary">
                      {formatSpeedValue(selectedTest.upload, unit)}{' '}
                      <span className="text-sm opacity-60">{unit}</span>
                    </p>
                  </div>
                </div>

                {/* Network Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-surface-container/30 rounded-2xl">
                    <p className="text-[9px] font-bold uppercase text-on-surface-variant mb-1">
                      Ping
                    </p>
                    <p className="font-headline font-bold text-lg">
                      {selectedTest.ping} ms
                    </p>
                  </div>
                  <div className="text-center p-3 bg-surface-container/30 rounded-2xl">
                    <p className="text-[9px] font-bold uppercase text-on-surface-variant mb-1">
                      Jitter
                    </p>
                    <p className="font-headline font-bold text-lg">
                      {selectedTest.jitter} ms
                    </p>
                  </div>
                  <div className="text-center p-3 bg-surface-container/30 rounded-2xl">
                    <p className="text-[9px] font-bold uppercase text-on-surface-variant mb-1">
                      Loss
                    </p>
                    <p className="font-headline font-bold text-lg">0.0%</p>
                  </div>
                </div>

                {/* Connection Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-on-surface-variant uppercase">
                        ISP
                      </span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      {selectedTest.provider}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-on-surface-variant uppercase">
                        IP Address
                      </span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      {selectedTest.ip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/5">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-on-surface-variant uppercase">
                        Server
                      </span>
                    </div>
                    <span className="text-sm font-bold text-on-surface">
                      {selectedTest.location}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTest(null)}
                  className="w-full py-3.5 rounded-3xl bg-primary text-on-primary font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
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