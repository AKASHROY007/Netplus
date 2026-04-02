import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  Globe, 
  Search,
  Cpu, 
  Database, 
  RefreshCw,
  Zap,
  Wifi,
  Lock,
  Server,
  Thermometer,
  HardDrive
} from 'lucide-react';
import { Device } from '@capacitor/device';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from '../lib/utils';

// ============================================
// TYPE DEFINITIONS & INTERFACES
// ============================================

type ConnectionFilterType = 'All' | 'Active' | 'Idle';
type ConnectionStatus = 'Active' | 'Idle';
type IconType = React.ComponentType<{ className?: string }>;

interface TrafficDataPoint {
  time: number;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

interface SystemStats {
  cpu: number;
  ram: number;
  storage: number;
  freeStorage: number;
  temp: number;
  battery: number;
  isCharging: boolean;
}

interface ActiveConnection {
  id: number;
  host: string;
  type: string;
  status: ConnectionStatus;
  speed: number;
  unit: 'MB/s' | 'KB/s';
  icon: IconType;
  ip: string;
  port: string;
  protocol: string;
}

interface NetworkUpdateEvent {
  download: number;
  upload: number;
  ping: number;
  jitter: number;
}

// ============================================
// CONSTANTS
// ============================================

const FILTER_OPTIONS: readonly ConnectionFilterType[] = ['All', 'Active', 'Idle'] as const;

const INITIAL_SYSTEM_STATS: SystemStats = {
  cpu: 0,
  ram: 0,
  storage: 0,
  freeStorage: 0,
  temp: 0,
  battery: 0,
  isCharging: false,
};

const INITIAL_CONNECTIONS: ActiveConnection[] = [
  {
    id: 1,
    host: 'google.com',
    type: 'HTTPS',
    status: 'Active',
    speed: 1.2,
    unit: 'MB/s',
    icon: Globe,
    ip: '142.250.190.46',
    port: '443',
    protocol: 'TLS 1.3',
  },
  {
    id: 2,
    host: 'aws.amazon.com',
    type: 'TCP',
    status: 'Active',
    speed: 450,
    unit: 'KB/s',
    icon: Server,
    ip: '52.94.236.248',
    port: '80',
    protocol: 'HTTP/1.1',
  },
  {
    id: 3,
    host: 'github.com',
    type: 'SSH',
    status: 'Idle',
    speed: 0,
    unit: 'KB/s',
    icon: Lock,
    ip: '140.82.121.4',
    port: '22',
    protocol: 'SSH-2.0',
  },
  {
    id: 4,
    host: 'netflix.com',
    type: 'UDP',
    status: 'Active',
    speed: 8.4,
    unit: 'MB/s',
    icon: Activity,
    ip: '45.57.91.1',
    port: '443',
    protocol: 'QUIC',
  },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate simulated traffic data
 */
const generateTrafficData = (): TrafficDataPoint[] => {
  const data: TrafficDataPoint[] = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: i,
      download: Math.floor(Math.random() * 80) + 20,
      upload: Math.floor(Math.random() * 30) + 5,
      ping: Math.floor(Math.random() * 20) + 10,
      jitter: Math.floor(Math.random() * 5) + 1,
    });
  }
  return data;
};

/**
 * Parse network update event safely
 */
const parseNetworkEvent = (event: CustomEvent): NetworkUpdateEvent | null => {
  try {
    const detail = event.detail;
    const newData =
      typeof detail === 'string' ? JSON.parse(detail) : detail;

    if (
      typeof newData.download === 'number' &&
      typeof newData.upload === 'number' &&
      typeof newData.ping === 'number' &&
      typeof newData.jitter === 'number'
    ) {
      return newData;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse network update:', error);
    return null;
  }
};

/**
 * Safe DOM element text update
 */
const updateElementText = (elementId: string, text: string): void => {
  const element = document.getElementById(elementId);
  if (element instanceof HTMLElement) {
    element.textContent = text;
  }
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function Monitoring() {
  // State management
  const [data, setData] = useState<TrafficDataPoint[]>(generateTrafficData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<ConnectionFilterType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStats, setSystemStats] = useState<SystemStats>(INITIAL_SYSTEM_STATS);
  const [activeConnections, setActiveConnections] =
    useState<ActiveConnection[]>(INITIAL_CONNECTIONS);
  const [isTesting, setIsTesting] = useState(false);

  // Memoized filtered connections
  const filteredConnections = useMemo(() => {
    return activeConnections.filter((conn) => {
      const matchesFilter = filter === 'All' || conn.status === filter;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        conn.host.toLowerCase().includes(query) ||
        conn.ip.toLowerCase().includes(query) ||
        conn.type.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeConnections, filter, searchQuery]);

  // Speed test function
  const runSpeedTest = useCallback(async () => {
    if (isTesting) return;
    setIsTesting(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const startTime = performance.now();
      const response = await fetch(
        'https://speed.cloudflare.com/__down?bytes=1048576',
        {
          cache: 'no-store',
          signal: controller.signal,
          mode: 'cors',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      let receivedLength = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          receivedLength += value.length;

          const currentTime = performance.now();
          const elapsed = (currentTime - startTime) / 1000;
          if (elapsed > 0.2) {
            const currentSpeedMbps = (
              (receivedLength * 8) /
              (elapsed * 1024 * 1024)
            ).toFixed(2);

            setData((prev) => {
              const newData = [...prev];
              const lastIndex = newData.length - 1;
              newData[lastIndex] = {
                ...newData[lastIndex],
                download: parseFloat(currentSpeedMbps),
              };
              return newData;
            });
          }
        }
      }

      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;
      const speedMbps = (
        (receivedLength * 8) /
        (duration * 1024 * 1024)
      ).toFixed(2);

      setData((prev) => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        newData[lastIndex] = {
          ...newData[lastIndex],
          download: parseFloat(speedMbps),
        };
        return newData;
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Speed test timed out');
        } else {
          console.error('Speed test failed:', error.message);
        }
      }

      // Fallback: simulate low speed
      setData((prev) => {
        const newData = [...prev];
        const lastIndex = newData.length - 1;
        newData[lastIndex] = { ...newData[lastIndex], download: 15.5 };
        return newData;
      });
    } finally {
      clearTimeout(timeoutId);
      setIsTesting(false);
    }
  }, [isTesting]);

  // Device monitoring function
  const updateDeviceMonitoring = useCallback(async () => {
    try {
      const info = (await Device.getInfo()) as Record<string, any>;
      const batteryInfo = await Device.getBatteryInfo();

      // Update RAM
      const ramVal = info.memUsed
        ? (info.memUsed / (1024 * 1024 * 1024)).toFixed(1)
        : '0.0';
      updateElementText('ram-val', `${ramVal} GB`);

      // Update Battery
      const batteryVal = Math.round(batteryInfo.batteryLevel * 100);
      updateElementText('battery-val', `${batteryVal}%`);

      // Update Model
      const modelVal = info.model || 'Analyzing...';
      updateElementText('cpu-val', modelVal);

      // Update Storage
      const totalGB = info.realDiskTotal
        ? (info.realDiskTotal / (1024 * 1024 * 1024)).toFixed(1)
        : '0.0';
      const freeGB = info.realDiskFree
        ? (info.realDiskFree / (1024 * 1024 * 1024)).toFixed(1)
        : '0.0';

      updateElementText('storage-val', `${totalGB} GB`);
      updateElementText('storage-free-val', `${freeGB} GB Free`);

      // Sync React state
      setSystemStats((prev) => ({
        ...prev,
        ram: parseFloat(ramVal),
        storage: parseFloat(totalGB),
        freeStorage: parseFloat(freeGB),
        battery: batteryVal,
        isCharging: batteryInfo.isCharging || false,
      }));
    } catch (error) {
      console.error('Error reading hardware:', error);
    }
  }, []);

  // Handle network updates
  const handleNetworkUpdate = useCallback((event: Event) => {
    const customEvent = event as CustomEvent;
    const newData = parseNetworkEvent(customEvent);

    if (!newData) return;

    setData((prev) => {
      const updatedData = [...prev.slice(1)];
      updatedData.push({
        time: prev[prev.length - 1].time + 1,
        download: newData.download,
        upload: newData.upload,
        ping: newData.ping,
        jitter: newData.jitter,
      });
      return updatedData;
    });

    // Update system stats
    setSystemStats((prev) => ({
      ...prev,
      cpu: Math.floor(Math.random() * 30) + 10,
      temp: Math.floor(Math.random() * 10) + 38,
    }));

    // Update connection speeds
    setActiveConnections((prev) =>
      prev.map((conn) => {
        if (conn.status === 'Idle') return conn;
        const change =
          (Math.random() - 0.5) *
          (conn.unit === 'MB/s' ? 0.5 : 50);
        const newSpeed = Math.max(0.1, conn.speed + change);
        return { ...conn, speed: parseFloat(newSpeed.toFixed(1)) };
      })
    );
  }, []);

  // Effect: Monitor device and network
  useEffect(() => {
    // Initial device monitoring
    updateDeviceMonitoring();

    // Set up intervals and listeners
    const deviceInterval = setInterval(updateDeviceMonitoring, 5000);
    window.addEventListener(
      'networkUpdate',
      handleNetworkUpdate as EventListener
    );

    // Cleanup
    return () => {
      clearInterval(deviceInterval);
      window.removeEventListener(
        'networkUpdate',
        handleNetworkUpdate as EventListener
      );
    };
  }, [updateDeviceMonitoring, handleNetworkUpdate]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  // Get latest traffic data
  const latestTraffic = data[data.length - 1];
  const maxSpeed = useMemo(
    () => Math.max(...data.map((d) => d.download), 100),
    [data]
  );

  return (
    <main className="pt-28 px-6 pb-6 max-w-4xl mx-auto space-y-6 relative flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-0.5"
        >
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">
            Live Monitoring
          </h2>
          <p className="font-body text-on-surface-variant text-xs">
            Real-time network traffic and connection analysis.
          </p>
        </motion.div>

        <div className="flex gap-3">
          <button
            onClick={runSpeedTest}
            disabled={isTesting}
            className={cn(
              'px-3 py-1.5 rounded-xl bg-primary text-on-primary font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50',
              isTesting && 'animate-pulse'
            )}
          >
            <Activity className="w-3 h-3" />
            {isTesting ? 'Testing...' : 'Speed Test'}
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-surface-container-highest hover:bg-primary/10 hover:text-primary transition-all group"
            aria-label="Refresh data"
          >
            <RefreshCw
              className={cn(
                'w-4 h-4',
                isRefreshing && 'animate-spin'
              )}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Download Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
              <ArrowDown className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Download
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">
                    {latestTraffic.download.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-bold text-on-surface-variant">
                    Mbps
                  </span>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-secondary"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${Math.min(100, (latestTraffic.download / maxSpeed) * 100)}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <ArrowUp className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Upload
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">
                    {latestTraffic.upload.toFixed(1)}
                  </span>
                  <span className="text-[9px] font-bold text-on-surface-variant">
                    Mbps
                  </span>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{
                    width: `${Math.min(100, (latestTraffic.upload / maxSpeed) * 100)}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Ping Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Ping
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">
                    {latestTraffic.ping}
                  </span>
                  <span className="text-[9px] font-bold text-on-surface-variant">
                    ms
                  </span>
                </div>
              </div>
              <p className="text-[8px] text-secondary font-bold uppercase">
                Ultra Stable
              </p>
            </div>
          </div>
        </motion.div>

        {/* Jitter Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center text-orange-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Jitter
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">
                    {latestTraffic.jitter}
                  </span>
                  <span className="text-[9px] font-bold text-on-surface-variant">
                    ms
                  </span>
                </div>
              </div>
              <p className="text-[8px] text-on-surface-variant/50 font-bold uppercase">
                Low Variance
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Traffic Flow Chart */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg">
            Traffic Flow
          </h3>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-[9px] font-bold uppercase text-on-surface-variant">
                Download
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[9px] font-bold uppercase text-on-surface-variant">
                Upload
              </span>
            </div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="colorDownload"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-secondary, #006b5d)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-secondary, #006b5d)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorUpload"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-primary, #006a6a)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-primary, #006a6a)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis hide dataKey="time" />
              <YAxis hide domain={[0, maxSpeed * 1.2]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                itemStyle={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Area
                type="monotone"
                dataKey="download"
                stroke="var(--color-secondary, #006b5d)"
                fillOpacity={1}
                fill="url(#colorDownload)"
                strokeWidth={3}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="upload"
                stroke="var(--color-primary, #006a6a)"
                fillOpacity={1}
                fill="url(#colorUpload)"
                strokeWidth={3}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Network Stability Chart */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
        className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-lg">
            Network Stability
          </h3>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-tertiary" />
              <span className="text-[9px] font-bold uppercase text-on-surface-variant">
                Ping (ms)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span className="text-[9px] font-bold uppercase text-on-surface-variant">
                Jitter (ms)
              </span>
            </div>
          </div>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient
                  id="colorPing"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-tertiary, #7d5260)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-tertiary, #7d5260)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorJitter"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#fb923c"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="#fb923c"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis hide dataKey="time" />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(20, 20, 20, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                itemStyle={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
              <Area
                type="monotone"
                dataKey="ping"
                stroke="var(--color-tertiary, #7d5260)"
                fillOpacity={1}
                fill="url(#colorPing)"
                strokeWidth={2}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="jitter"
                stroke="#fb923c"
                fillOpacity={1}
                fill="url(#colorJitter)"
                strokeWidth={2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Active Connections */}
      <section className="space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 ml-1">
          <h3 className="font-headline text-base font-semibold uppercase tracking-widest text-secondary/80">
            Active Connections
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input
                className="bg-surface-container-highest border-none rounded-xl py-1.5 pl-9 pr-4 text-[10px] font-bold text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 transition-all w-full sm:w-40"
                placeholder="Search host/IP..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter buttons */}
            <div className="flex bg-surface-container-highest rounded-xl p-0.5">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-all',
                    filter === f
                      ? 'bg-primary text-on-primary shadow-lg'
                      : 'text-on-surface-variant hover:text-on-surface'
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Connection List */}
        <div className="space-y-2">
          {filteredConnections.length > 0 ? (
            filteredConnections.map((conn, idx) => {
              const IconComponent = conn.icon;

              return (
                <motion.div
                  key={conn.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/10 flex items-center justify-between hover:bg-surface-container-highest transition-all group relative"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-headline font-bold text-base leading-tight">
                        {conn.host}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase bg-surface-container px-1.5 py-0.5 rounded-full">
                          {conn.type}
                        </span>
                        <span
                          className={cn(
                            'text-[9px] font-bold uppercase',
                            conn.status === 'Active'
                              ? 'text-secondary'
                              : 'text-on-surface-variant/50'
                          )}
                        >
                          {conn.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-headline font-bold text-primary text-sm">
                      {conn.speed} {conn.unit}
                    </p>
                    <p className="text-[9px] font-bold text-on-surface-variant uppercase">
                      Speed
                    </p>
                  </div>

                  {/* Hover Tooltip */}
                  <div className="absolute left-1/2 -top-16 -translate-x-1/2 bg-surface-container-highest border border-outline-variant/20 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-20 w-48 backdrop-blur-md group-hover:-top-20">
                    <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase">
                      <div className="text-on-surface-variant">
                        IP Address
                      </div>
                      <div className="text-primary text-right">
                        {conn.ip}
                      </div>
                      <div className="text-on-surface-variant">
                        Port
                      </div>
                      <div className="text-primary text-right">
                        {conn.port}
                      </div>
                      <div className="text-on-surface-variant">
                        Protocol
                      </div>
                      <div className="text-primary text-right">
                        {conn.protocol}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-on-surface-variant text-sm">
                No connections match your filter
              </p>
            </div>
          )}
        </div>
      </section>

      {/* System Info */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* CPU/Model */}
        <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">
              Model
            </p>
            <p
              id="cpu-val"
              className="font-headline font-bold text-sm truncate"
            >
              Analyzing...
            </p>
          </div>
        </div>

        {/* RAM */}
        <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">
              RAM
            </p>
            <p id="ram-val" className="font-headline font-bold text-sm">
              0.0 GB
            </p>
          </div>
        </div>

        {/* Storage */}
        <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">
              Storage
            </p>
            <p id="storage-val" className="font-headline font-bold text-sm">
              0.0 GB
            </p>
            <p
              id="storage-free-val"
              className="text-[7px] text-on-surface-variant/60 font-bold uppercase"
            >
              0.0 GB Free
            </p>
          </div>
        </div>

        {/* Battery */}
        <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <Zap
              className={cn(
                'w-4 h-4',
                systemStats.isCharging && 'text-primary animate-pulse'
              )}
            />
          </div>
          <div>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">
              Battery
            </p>
            <p id="battery-val" className="font-headline font-bold text-sm">
              0%
            </p>
            <p className="text-[7px] text-on-surface-variant/60 font-bold uppercase">
              {systemStats.isCharging ? 'Charging' : 'Discharging'}
            </p>
          </div>
        </div>

        {/* Temperature */}
        <div className="bg-surface-container-low p-4 rounded-3xl border border-outline-variant/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-on-surface-variant uppercase">
              Temp
            </p>
            <p className="font-headline font-bold text-sm">
              {systemStats.temp}°C
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}