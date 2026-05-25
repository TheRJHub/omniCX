import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const API_BASE = `${import.meta.env.OMNICX_URL}/dashboard/channel-performance`;

// Agent → icon + color config
const AGENT_CONFIG = {
  'Chat Agent': { color: '#3b82f6', icon: <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} /> },
  'Email Agent': { color: '#8b5cf6', icon: <EmailOutlinedIcon sx={{ fontSize: 18 }} /> },
  'Voice Agent': { color: '#f97316', icon: <PhoneOutlinedIcon sx={{ fontSize: 18 }} /> },
  'Human Agent': { color: '#1e293b', icon: <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} /> },
};

function getAgentConfig(agentName) {
  return AGENT_CONFIG[agentName] || { color: '#64748b', icon: <PersonOutlineRoundedIcon sx={{ fontSize: 18 }} /> };
}

// Build trend object from a delta value.
// isGoodWhenDown: true  → negative delta = green (e.g. escalation, handle time)
// isGoodWhenDown: false → positive delta = green (e.g. resolution, volume, csat)
function buildTrend(delta, isGoodWhenDown = false) {
  if (delta === null || delta === undefined) return null;
  const isPositive = delta > 0;
  const sign = isPositive ? '+' : '';
  const trendType = isPositive ? 'up' : 'down';
  let color;
  if (isGoodWhenDown) {
    color = isPositive ? '#ef4444' : '#10b981';
  } else {
    color = isPositive ? '#10b981' : '#ef4444';
  }
  return { text: `${sign}${delta}%`, trendType, color };
}

// Volume-by-channel chart driven by API data
function VolumeByChannelChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorChat" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorEmail" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1e293b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1e293b" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorVoice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}
              itemStyle={{ fontWeight: 500 }}
            />
            <Area type="monotone" dataKey="chat" name="Chat" stroke="#3b82f6" fill="url(#colorChat)" strokeWidth={2} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="email" name="Email" stroke="#8b5cf6" fill="url(#colorEmail)" strokeWidth={2} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="human" name="Human" stroke="#1e293b" fill="url(#colorHuman)" strokeWidth={2} activeDot={{ r: 6, strokeWidth: 0 }} />
            <Area type="monotone" dataKey="voice" name="Voice" stroke="#f97316" fill="url(#colorVoice)" strokeWidth={2} activeDot={{ r: 6, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        {[
          { label: 'Chat', color: '#3b82f6' },
          { label: 'Email', color: '#8b5cf6' },
          { label: 'Human', color: '#1e293b' },
          { label: 'Voice', color: '#f97316' },
        ].map(item => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

// Resolution rate bars driven by API data
function ResRateByAgentChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ width: '100%', height: 320, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              domain={[0, 100]}
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => val}
            />
            <YAxis
              type="category"
              dataKey="agent"
              stroke="#475569"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              width={80}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}
              itemStyle={{ fontWeight: 500 }}
              formatter={(value) => `${value}%`}
            />
            <Bar dataKey="resolution_rate" radius={[0, 4, 4, 0]} barSize={28}>
              {data.map((entry, index) => {
                const config = getAgentConfig(entry.agent);
                return <Cell key={`cell-${index}`} fill={config.color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}

export default function ChannelPerformance() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);

  const fetchData = useCallback(async (d) => {
    try {
      const res = await fetch(`${API_BASE}?days=${d}&_t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err.message || 'Failed to fetch data');
    }
  }, []);

  useEffect(() => {
    fetchData(days);
  }, [fetchData, days]);

  // Re-fetch on tab focus
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchData(days);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchData, days]);

  // Auto-poll every 60 seconds to stay in sync with live API data
  useEffect(() => {
    const interval = setInterval(() => fetchData(days), 60000);
    return () => clearInterval(interval);
  }, [fetchData, days]);

  const summary = data?.summary || {};
  const volumeByChannel = data?.volume_by_channel || [];
  const resolutionRates = data?.resolution_rates || [];
  const channelMetrics = data?.channel_metrics || [];

  // Build stat cards from live API summary
  // overall_auto_resolution_delta: positive = good, negative = bad
  const autoResTrend = buildTrend(summary.overall_auto_resolution_delta, false);
  // total_volume_delta_pct: positive = good
  const volumeTrend = buildTrend(summary.total_volume_delta_pct, false);
  // avg_handle_time_delta_sec: negative is good (time went down)
  const ahtDeltaSec = summary.avg_handle_time_delta_sec;
  const ahtTrendText = ahtDeltaSec != null
    ? `${ahtDeltaSec > 0 ? '+' : ''}${Math.round(ahtDeltaSec)}s`
    : null;
  const ahtTrend = ahtDeltaSec != null
    ? { text: ahtTrendText, trendType: ahtDeltaSec < 0 ? 'down' : 'up', color: ahtDeltaSec < 0 ? '#10b981' : '#ef4444' }
    : null;
  // avg_csat_delta: positive = good
  const csatTrend = buildTrend(summary.avg_csat_delta, false);

  const statCards = [
    {
      label: 'Overall Auto-Resolution',
      value: summary.overall_auto_resolution_pct != null ? `${summary.overall_auto_resolution_pct}%` : '—',
      trend: autoResTrend,
      color: '#3b82f6',
      icon: <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
    },
    {
      label: 'Total Volume',
      value: summary.total_volume != null ? summary.total_volume.toLocaleString() : '—',
      trend: volumeTrend,
      color: '#8b5cf6',
      icon: <PeopleOutlineRoundedIcon sx={{ fontSize: 18 }} />
    },
    {
      label: 'Avg Handle Time (AHT)',
      value: summary.avg_handle_time_display ?? '—',
      trend: ahtTrend,
      color: '#f97316',
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 18 }} />
    },
    {
      label: 'Average CSAT',
      value: summary.avg_csat != null ? `${summary.avg_csat} / 5.0` : '—',
      trend: csatTrend,
      color: '#10b981',
      icon: <BarChartRoundedIcon sx={{ fontSize: 18 }} />
    },
  ];

  return (
    <Box sx={{
      flexGrow: 1,
      p: { xs: 1.5, md: 2 },
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      pb: 6
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: '#0f172a' }}>
          Channel Performance Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            sx={{
              borderRadius: '8px',
              bgcolor: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
            }}
          >
            <MenuItem value={7} sx={{ fontSize: '13px' }}>Last 7 Days</MenuItem>
            <MenuItem value={30} sx={{ fontSize: '13px' }}>Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {statCards.map((stat, idx) => (
          <Paper elevation={0} key={idx} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: `${stat.color}10`, color: stat.color, border: `1px solid ${stat.color}20` }}>
                {stat.icon}
              </Avatar>
              {stat.trend ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {stat.trend.trendType === 'up' ? (
                    <TrendingUpRoundedIcon sx={{ fontSize: 14, color: stat.trend.color }} />
                  ) : (
                    <TrendingDownRoundedIcon sx={{ fontSize: 14, color: stat.trend.color }} />
                  )}
                  <Typography variant="caption" sx={{ fontWeight: 700, color: stat.trend.color }}>
                    {stat.trend.text}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '11px' }}>—</Typography>
              )}
            </Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', display: 'block', mb: 0.5 }}>
              {stat.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Middle Charts */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3 }}>
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
            Interaction Volume by Channel
          </Typography>
          <VolumeByChannelChart data={volumeByChannel} />
        </Paper>
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
            Resolution Rate by Agent
          </Typography>
          <ResRateByAgentChart data={resolutionRates} />
        </Paper>
      </Box>

      {/* Detailed Metrics Table */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Detailed Channel Metrics
          </Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {['Channel / Agent', 'Volume', 'Resolution Rate', 'Escalation Rate', 'Avg Handle Time', 'CSAT'].map(h => (
                  <TableCell key={h} sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {channelMetrics.map((row) => {
                const { color, icon } = getAgentConfig(row.agent);
                const isHuman = row.agent === 'Human Agent';
                const resRate = row.resolution_rate ?? 0;
                const escRate = row.escalation_rate ?? 0;
                return (
                  <TableRow key={row.agent} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ py: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{
                          width: 32, height: 32,
                          bgcolor: isHuman ? '#1e293b' : `${color}15`,
                          color: isHuman ? '#fff' : color
                        }}>
                          {icon}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a', fontSize: '12px' }}>
                          {row.agent}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#64748b', fontSize: '12px', py: 1 }}>
                      {row.volume?.toLocaleString() ?? '—'}
                    </TableCell>
                    <TableCell sx={{ py: 1 }}>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '12px', minWidth: 45 }}>
                          {resRate}%
                        </Typography>
                        <Box sx={{ width: 80, height: 6, bgcolor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                          <Box sx={{ width: `${resRate}%`, height: '100%', bgcolor: color, borderRadius: 4 }} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#64748b', fontSize: '12px', py: 1 }}>
                      {escRate}%
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#64748b', fontSize: '12px', py: 1 }}>
                      {row.avg_handle_time_display ?? '—'}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#0f172a', fontSize: '12px', py: 1 }}>
                      {row.csat != null ? row.csat : '—'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
