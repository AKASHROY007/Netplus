import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Download,
  Filter,
  Activity,
  Globe,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  Brush
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const DATA_SETS: Record<string, any[]> = {
  Daily: [
    { name: '00:00', download: 120, upload: 40, latency: 10 },
    { name: '04:00', download: 80, upload: 30, latency: 12 },
    { name: '08:00', download: 350, upload: 90, latency: 15 },
    { name: '12:00', download: 620, upload: 180, latency: 18 },
    { name: '16:00', download: 480, upload: 140, latency: 14 },
    { name: '20:00', download: 750, upload: 220, latency: 20 },
    { name: '23:59', download: 300, upload: 80, latency: 11 },
  ],
  Weekly: [
    { name: 'Mon', download: 450, upload: 120, latency: 12 },
    { name: 'Tue', download: 520, upload: 150, latency: 15 },
    { name: 'Wed', download: 380, upload: 110, latency: 10 },
    { name: 'Thu', download: 610, upload: 180, latency: 18 },
    { name: 'Fri', download: 580, upload: 160, latency: 14 },
    { name: 'Sat', download: 720, upload: 210, latency: 22 },
    { name: 'Sun', download: 680, upload: 190, latency: 20 },
  ],
  Monthly: [
    { name: 'Week 1', download: 2800, upload: 850, latency: 14 },
    { name: 'Week 2', download: 3200, upload: 920, latency: 16 },
    { name: 'Week 3', download: 2950, upload: 880, latency: 13 },
    { name: 'Week 4', download: 3500, upload: 1100, latency: 18 },
  ],
};

const DEVICE_DATA = [
  { name: 'Mobile', value: 45, color: '#006a6a' },
  { name: 'Desktop', value: 30, color: '#006b5d' },
  { name: 'Smart TV', value: 15, color: '#7d5260' },
  { name: 'IoT', value: 10, color: '#fb923c' },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Weekly');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-highest/90 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl shadow-2xl min-w-[160px]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 border-b border-outline-variant/10 pb-1.5">
            {label}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-bold text-on-surface">Download</span>
              </div>
              <span className="text-xs font-black text-primary">{payload[0].value} Mbps</span>
            </div>
            {payload[1] && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-xs font-bold text-on-surface">Upload</span>
                </div>
                <span className="text-xs font-black text-secondary">{payload[1].value} Mbps</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="pt-40 px-6 pb-6 max-w-5xl mx-auto space-y-8 relative flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-3 text-primary">
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Network Intelligence</span>
          </div>
          <h2 className="font-headline text-5xl font-black tracking-tighter text-on-surface">Analytics</h2>
          <p className="text-on-surface-variant font-medium">Deep insights into your network performance and usage patterns.</p>
        </motion.div>

        <div className="flex items-center gap-3 bg-surface-container-low p-1.5 rounded-2xl border border-outline-variant/10">
          {['Daily', 'Weekly', 'Monthly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                timeRange === range 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Traffic', value: '4.2 TB', trend: '+12.5%', isUp: true, icon: Globe, color: 'text-primary' },
          { label: 'Avg. Latency', value: '14.2 ms', trend: '-2.1%', isUp: false, icon: Zap, color: 'text-secondary' },
          { label: 'Peak Speed', value: '942 Mbps', trend: '+5.4%', isUp: true, icon: Activity, color: 'text-tertiary' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 group hover:border-primary/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className={cn("w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0", stat.color)}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant truncate">{stat.label}</p>
                  <div className={cn(
                    "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-bold shrink-0",
                    stat.isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {stat.isUp ? <ArrowUpRight className="w-2 h-2" /> : <ArrowDownRight className="w-2 h-2" />}
                    {stat.trend}
                  </div>
                </div>
                <h3 className="font-headline text-lg font-black text-on-surface leading-none">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Trend */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 space-y-4"
        >
          <div className="flex items-center">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface leading-tight">Usage Trend</h3>
              <p className="text-[10px] text-on-surface-variant font-medium">Data consumption over time</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA_SETS[timeRange]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary, #006a6a)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary, #006a6a)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-on-surface-variant, #c4c7c5)', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-on-surface-variant, #c4c7c5)', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="download" 
                  stroke="var(--color-primary, #006a6a)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorUsage)" 
                  animationDuration={1000}
                />
                <Area 
                  type="monotone" 
                  dataKey="upload" 
                  stroke="var(--color-secondary, #008567)" 
                  strokeWidth={2}
                  fillOpacity={0} 
                  fill="transparent" 
                  animationDuration={1000}
                />
                <Brush 
                  dataKey="name" 
                  height={30} 
                  stroke="var(--color-primary)" 
                  fill="var(--color-surface-container-highest)"
                  travellerWidth={10}
                  className="recharts-brush-container"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* Device Distribution */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10 flex flex-col"
        >
          <h3 className="font-headline text-lg font-bold text-on-surface leading-tight">Devices</h3>
          <p className="text-[10px] text-on-surface-variant font-medium mb-4">Traffic by device type</p>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEVICE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {DEVICE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(12px)',
                      fontSize: '10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-2 mt-4">
              {DEVICE_DATA.map((device) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: device.color }} />
                    <span className="text-xs font-bold text-on-surface">{device.name}</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">{device.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* Hourly Activity */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline text-lg font-bold text-on-surface leading-tight">Hourly Activity</h3>
          <div className="flex items-center gap-1.5 text-on-surface-variant">
            <Calendar className="w-3 h-3" />
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">Last 24 Hours</span>
          </div>
        </div>

        <div className="h-36 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA_SETS['Daily']}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--color-on-surface-variant, #c4c7c5)', fontSize: 10, fontWeight: 600 }}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ 
                  backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)'
                }}
              />
              <Bar 
                dataKey="latency" 
                fill="var(--color-primary, #006a6a)" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>
    </main>
  );
}
