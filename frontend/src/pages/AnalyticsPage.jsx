import { useState, useEffect } from 'react';
import { consultationAPI } from '../api';
import { motion } from 'framer-motion';
import {
  BarChart2, Mic2, Clock, TrendingUp, CheckCircle2,
  Archive, Loader2, AlertCircle
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { formatDuration, getMonthName } from '../utils/format';

const COLORS = ['#8b5cf6', '#10b981', '#64748b'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await consultationAPI.getAnalytics();
        setData(res.data.data);
      } catch (err) {
        setError('Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
      <p className="text-dark-muted">{error}</p>
    </div>
  );

  const { totalConsultations, totalDuration, statusBreakdown, monthlyData } = data;

  const monthlyChartData = (monthlyData || []).map(item => ({
    name: getMonthName(item._id.month),
    count: item.count,
    minutes: Math.round((item.totalDuration || 0) / 60),
  }));

  const pieData = [
    { name: 'Pending', value: statusBreakdown?.pending || 0 },
    { name: 'Completed', value: statusBreakdown?.completed || 0 },
    { name: 'Archived', value: statusBreakdown?.archived || 0 },
  ].filter(d => d.value > 0);

  const STAT_CARDS = [
    { label: 'Total Consultations', value: totalConsultations, icon: Mic2, color: 'text-primary-400', bg: 'bg-primary-600/15' },
    { label: 'Total Duration', value: formatDuration(totalDuration), icon: Clock, color: 'text-accent-400', bg: 'bg-accent-500/15' },
    { label: 'Completed', value: statusBreakdown?.completed || 0, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/15' },
    { label: 'Archived', value: statusBreakdown?.archived || 0, icon: Archive, color: 'text-slate-400', bg: 'bg-slate-500/15' },
  ];

  const customTooltipStyle = {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2d2d4e',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: '13px',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-dark-text flex items-center gap-2">
          <BarChart2 className="w-6 h-6 text-primary-400" />
          Analytics
        </h1>
        <p className="text-dark-muted text-sm mt-1">Overview of your consultation activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="stat-card"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-dark-text">{card.value}</p>
            <p className="text-xs text-dark-muted mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2"
        >
          <h2 className="font-semibold text-dark-text mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-400" />
            Monthly Consultations (Last 6 Months)
          </h2>
          {monthlyChartData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-dark-muted text-sm">
              No data available yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyChartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  cursor={{ fill: 'rgba(109,40,217,0.1)' }}
                />
                <Bar dataKey="count" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Consultations" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <h2 className="font-semibold text-dark-text mb-4">Status Breakdown</h2>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-dark-muted text-sm">
              No data yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Recent consultations table */}
      {data.recentConsultations?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h2 className="font-semibold text-dark-text mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-muted text-xs uppercase tracking-wide border-b border-dark-border">
                  <th className="pb-3 text-left font-medium">Title</th>
                  <th className="pb-3 text-left font-medium hidden sm:table-cell">Client</th>
                  <th className="pb-3 text-left font-medium hidden md:table-cell">Date</th>
                  <th className="pb-3 text-left font-medium">Status</th>
                  <th className="pb-3 text-right font-medium hidden sm:table-cell">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border/50">
                {data.recentConsultations.map((c) => (
                  <tr key={c._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-medium text-dark-text truncate max-w-[160px]">{c.title}</td>
                    <td className="py-3 text-dark-muted hidden sm:table-cell">{c.clientName}</td>
                    <td className="py-3 text-dark-muted hidden md:table-cell">
                      {new Date(c.consultationDate).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <span className={`badge-${c.status} badge`}>{c.status}</span>
                    </td>
                    <td className="py-3 text-right text-dark-muted hidden sm:table-cell font-mono text-xs">
                      {formatDuration(c.duration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
