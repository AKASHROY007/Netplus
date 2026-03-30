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
  Pie
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const TRAFFIC_DATA = [
  { name: 'Mon', download: 450, upload: 120, latency: 12 },
  { name: 'Tue', download: 520, upload: 150, latency: 15 },
  { name: 'Wed', download: 380, upload: 110, latency: 10 },
  { name: 'Thu', download: 610, upload: 180, latency: 18 },
  { name: 'Fri', download: 580, upload: 160, latency: 14 },
  { name: 'Sat', download: 720, upload: 210, latency: 22 },
  { name: 'Sun', download: 680, upload: 190, latency: 20 },
];

const DEVICE_DATA = [
  { name: 'Mobile', value: 45, color: '#006a6a' },
  { name: 'Desktop', value: 30, color: '#006b5d' },
  { name: 'Smart TV', value: 15, color: '#7d5260' },
  { name: 'IoT', value: 10, color: '#fb923c' },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('Weekly');

  return (
    <main className="pt-32 px-6 pb-32 max-w-5xl mx-auto space-y-8 relative">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 group hover:border-primary/20 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center", stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold",
                stat.isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
              )}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">{stat.label}</p>
            <h3 className="font-headline text-3xl font-black text-on-surface">{stat.value}</h3>
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
          className="lg:col-span-2 bg-surface-container-low p-8 rounded-[3rem] border border-outline-variant/10 space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-headline text-2xl font-bold text-on-surface">Usage Trend</h3>
              <p className="text-sm text-on-surface-variant">Data consumption over time</p>
            </div>
            <button className="p-3 rounded-2xl bg-surface-container-highest hover:bg-primary/10 hover:text-primary transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TRAFFIC_DATA}>
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
                  contentStyle={{ 
                    backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    padding: '16px'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="download" 
                  stroke="var(--color-primary, #006a6a)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorUsage)" 
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
          className="bg-surface-container-low p-8 rounded-[3rem] border border-outline-variant/10 flex flex-col"
        >
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Devices</h3>
          <p className="text-sm text-on-surface-variant mb-8">Traffic by device type</p>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEVICE_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {DEVICE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(20, 20, 20, 0.9)', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(12px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-3 mt-6">
              {DEVICE_DATA.map((device) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                    <span className="text-sm font-bold text-on-surface">{device.name}</span>
                  </div>
                  <span className="text-sm font-bold text-on-surface-variant">{device.value}%</span>
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
        className="bg-surface-container-low p-8 rounded-[3rem] border border-outline-variant/10"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-headline text-2xl font-bold text-on-surface">Hourly Activity</h3>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Last 24 Hours</span>
          </div>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TRAFFIC_DATA}>
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
