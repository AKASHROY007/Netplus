import React, { useState, useEffect } from 'react';
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
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { cn } from '../lib/utils';

// Simulated live data generator
const generateData = () => {
  const data = [];
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

export default function Monitoring() {
  const [data, setData] = useState(generateData());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Active' | 'Idle'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [systemStats, setSystemStats] = useState({ 
    cpu: 14, 
    ram: 2.4,
    storage: 128.5,
    temp: 42
  });
  const [activeConnections, setActiveConnections] = useState([
    { id: 1, host: 'google.com', type: 'HTTPS', status: 'Active', speed: 1.2, unit: 'MB/s', icon: Globe, ip: '142.250.190.46', port: '443', protocol: 'TLS 1.3' },
    { id: 2, host: 'aws.amazon.com', type: 'TCP', status: 'Active', speed: 450, unit: 'KB/s', icon: Server, ip: '52.94.236.248', port: '80', protocol: 'HTTP/1.1' },
    { id: 3, host: 'github.com', type: 'SSH', status: 'Idle', speed: 0, unit: 'KB/s', icon: Lock, ip: '140.82.121.4', port: '22', protocol: 'SSH-2.0' },
    { id: 4, host: 'netflix.com', type: 'UDP', status: 'Active', speed: 8.4, unit: 'MB/s', icon: Activity, ip: '45.57.91.1', port: '443', protocol: 'QUIC' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: prev[prev.length - 1].time + 1,
          download: Math.floor(Math.random() * 80) + 20,
          upload: Math.floor(Math.random() * 30) + 5,
          ping: Math.floor(Math.random() * 20) + 10,
          jitter: Math.floor(Math.random() * 5) + 1,
        });
        return newData;
      });

      setSystemStats(prev => ({
        ...prev,
        cpu: Math.floor(Math.random() * 30) + 10,
        ram: parseFloat((2.2 + Math.random() * 0.8).toFixed(1)),
        temp: Math.floor(Math.random() * 10) + 38
      }));

      setActiveConnections(prev => prev.map(conn => {
        if (conn.status === 'Idle') return conn;
        const change = (Math.random() - 0.5) * (conn.unit === 'MB/s' ? 0.5 : 50);
        const newSpeed = Math.max(0.1, conn.speed + change);
        return { ...conn, speed: parseFloat(newSpeed.toFixed(1)) };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <main className="pt-40 px-6 pb-6 max-w-4xl mx-auto space-y-8 relative flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-0.5"
        >
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary">Live Monitoring</h2>
          <p className="font-body text-on-surface-variant text-xs">Real-time network traffic and connection analysis.</p>
        </motion.div>
        <button 
          onClick={handleRefresh}
          className="p-2.5 rounded-xl bg-surface-container-highest hover:bg-primary/10 hover:text-primary transition-all group"
        >
          <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Download</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">{data[data.length - 1].download}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant">Mbps</span>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-secondary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(data[data.length - 1].download / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

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
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Upload</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">{data[data.length - 1].upload}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant">Mbps</span>
                </div>
              </div>
              <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(data[data.length - 1].upload / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>

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
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Ping</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">{data[data.length - 1].ping}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant">ms</span>
                </div>
              </div>
              <p className="text-[8px] text-secondary font-bold uppercase">Ultra Stable</p>
            </div>
          </div>
        </motion.div>

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
                <span className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant">Jitter</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-headline font-bold text-primary">{data[data.length - 1].jitter}</span>
                  <span className="text-[9px] font-bold text-on-surface-variant">ms</span>
                </div>
              </div>
              <p className="text-[8px] text-on-surface-variant/50 font-bold uppercase">Low Variance</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graph Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/10 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-xl">Traffic Flow</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Download</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Upload</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary, #006b5d)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-secondary, #006b5d)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary, #006a6a)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary, #006a6a)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis hide dataKey="time" />
              <YAxis hide domain={[0, 120]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
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

      {/* Ping & Jitter Graph */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.45 }}
        className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/10 space-y-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-headline font-bold text-xl">Network Stability</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Ping (ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Jitter (ms)</span>
            </div>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-tertiary, #7d5260)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-tertiary, #7d5260)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorJitter" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis hide dataKey="time" />
              <YAxis hide domain={[0, 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.8)', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
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
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ml-1">
          <h3 className="font-headline text-lg font-semibold uppercase tracking-widest text-secondary/80">Active Connections</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
              <input 
                className="bg-surface-container-highest border-none rounded-xl py-2 pl-10 pr-4 text-xs font-bold text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-primary/30 transition-all w-full sm:w-48" 
                placeholder="Search host/IP..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex bg-surface-container-highest rounded-xl p-1">
              {(['All', 'Active', 'Idle'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all",
                    filter === f ? "bg-primary text-on-primary shadow-lg" : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {activeConnections
            .filter(conn => {
              const matchesFilter = filter === 'All' || conn.status === filter;
              const query = searchQuery.toLowerCase();
              const matchesSearch = conn.host.toLowerCase().includes(query) || 
                                  conn.ip.toLowerCase().includes(query) ||
                                  conn.type.toLowerCase().includes(query);
              return matchesFilter && matchesSearch;
            })
            .map((conn, idx) => (
            <motion.div 
              key={conn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex items-center justify-between hover:bg-surface-container-highest transition-all group cursor-pointer relative"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <conn.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-headline font-bold text-lg leading-tight">{conn.host}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase bg-surface-container px-2 py-0.5 rounded-full">{conn.type}</span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase",
                      conn.status === 'Active' ? "text-secondary" : "text-on-surface-variant/50"
                    )}>
                      {conn.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-headline font-bold text-primary">{conn.speed} {conn.unit}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Current Speed</p>
              </div>

              {/* Hover Details Tooltip */}
              <div className="absolute left-1/2 -top-16 -translate-x-1/2 bg-surface-container-highest border border-outline-variant/20 p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 ease-out z-20 w-48 backdrop-blur-md group-hover:-top-20">
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase">
                  <div className="text-on-surface-variant">IP Address</div>
                  <div className="text-primary text-right">{conn.ip}</div>
                  <div className="text-on-surface-variant">Port</div>
                  <div className="text-primary text-right">{conn.port}</div>
                  <div className="text-on-surface-variant">Protocol</div>
                  <div className="text-primary text-right">{conn.protocol}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* System Info */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">CPU</p>
            <p className="font-headline font-bold text-lg">{systemStats.cpu}%</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">RAM</p>
            <p className="font-headline font-bold text-lg">{systemStats.ram} GB</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Storage</p>
            <p className="font-headline font-bold text-lg">{systemStats.storage} GB</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/10 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase">Temp</p>
            <p className="font-headline font-bold text-lg">{systemStats.temp}°C</p>
          </div>
        </div>
      </section>
    </main>
  );
}
