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

  const CHANNEL_COLORS = {
    chat: '#3b82f6',
    email: '#8b5cf6',
    voice: '#f97316',
    human: '#1e293b',
  };

  const maxVal = Math.max(...data.map(d => d.chat + d.email + d.voice + d.human), 1);
  const H = 180;
  const W = 800;
  const xStep = data.length > 1 ? W / (data.length - 1) : W;

  function makePath(key) {
    const pts = data.map((d, i) => {
      const x = i * xStep;
      const y = H - (d[key] / maxVal) * (H - 20);
      return `${x},${y}`;
    });
    const line = `M${pts.join(' L')}`;
    const area = `${line} L${W},${H} L0,${H} Z`;
    return { line, area };
  }

  const channels = ['email', 'voice', 'human', 'chat'];

  return (
    <Box sx={{ width: '100%', flexGrow: 1, minHeight: 180, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 140 }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <defs>
            {channels.map(ch => (
              <linearGradient key={ch} id={`grad-${ch}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHANNEL_COLORS[ch]} stopOpacity="0.35" />
                <stop offset="100%" stopColor={CHANNEL_COLORS[ch]} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
          {[0, 45, 90, 135].map(y => (
            <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
          ))}
          {channels.map(ch => {
            const { line, area } = makePath(ch);
            return (
              <g key={ch}>
                <path d={area} fill={`url(#grad-${ch})`} />
                <path d={line} fill="none" stroke={CHANNEL_COLORS[ch]} strokeWidth="2" />
              </g>
            );
          })}
        </svg>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        {data.map(d => (
          <Typography key={d.day} variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{d.day}</Typography>
        ))}
      </Box>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        {[
          { label: 'Chat', color: '#3b82f6' },
          { label: 'Email', color: '#8b5cf6' },
          { label: 'Human', color: '#1e293b' },
          { label: 'Voice', color: '#f97316' },
        ].map(item => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: item.color }}>{item.label}</Typography>
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
    <Box sx={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1, minHeight: 160 }}>
      <Stack spacing={2.5} sx={{ flexGrow: 1, justifyContent: 'center' }}>
        {data.map(item => {
          const { color } = getAgentConfig(item.agent);
          const val = item.resolution_rate ?? 0;
          return (
            <Box key={item.agent} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ minWidth: 80, fontWeight: 600, color: '#475569' }}>
                {item.agent}
              </Typography>
              <Box sx={{ flexGrow: 1, height: 28, bgcolor: 'transparent', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ width: `${val}%`, height: '100%', bgcolor: color, borderRadius: 1 }} />
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', minWidth: 36, textAlign: 'right' }}>
                {val}%
              </Typography>
            </Box>
          );
        })}
      </Stack>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 0.5 }}>
        {[0, 25, 50, 75, 100].map(v => (
          <Typography key={v} variant="caption" sx={{ color: '#94a3b8' }}>{v}</Typography>
        ))}
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
