import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  CircularProgress,
  Alert
} from '@mui/material';
import { cloneElement } from 'react';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';

const API_BASE = `${import.meta.env.OMNICX_URL}/dashboard/agentic-operations?days=7`;

// Map agent name to icon/color config
const AGENT_ICON_MAP = {
  'Chat Agent': {
    icon: <ChatBubbleOutlineRoundedIcon />,
    bgcolor: '#eff6ff',
    color: '#3b82f6'
  },
  'Email Agent (Accelr8cx)': {
    icon: <BoltOutlinedIcon />,
    bgcolor: '#faf5ff',
    color: '#a855f7'
  },
  'Voice Agent': {
    icon: <PhoneInTalkRoundedIcon />,
    bgcolor: '#fff7ed',
    color: '#f97316'
  }
};

function getAgentIconConfig(agentName) {
  return (
    AGENT_ICON_MAP[agentName] || {
      icon: <SmartToyOutlinedIcon />,
      bgcolor: '#f0fdf4',
      color: '#10b981'
    }
  );
}

function formatDelta(delta, isGoodWhenDown = false) {
  if (delta === null || delta === undefined) return null;
  const isPositive = delta > 0;
  const sign = isPositive ? '+' : '';
  const trendType = isPositive ? 'up' : 'down';
  // For human escalation, going down is good (green), going up is bad (red)
  let trendColor;
  if (isGoodWhenDown) {
    trendColor = isPositive ? '#ef4444' : '#10b981';
  } else {
    trendColor = isPositive ? '#10b981' : '#ef4444';
  }
  return {
    text: `${sign}${delta}% from last week`,
    trendType,
    trendColor
  };
}

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function ResolutionVolumeChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ width: '100%', height: 260, mt: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
              </linearGradient>
              <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.2} />
              </linearGradient>
            </defs>
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}
              itemStyle={{ fontWeight: 500 }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="ai_automated"
              name="AI Auto-Resolved"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAI)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="human_escalated"
              name="Human Escalated"
              stroke="#f97316"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHuman)"
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6', border: '1px solid #2563eb' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
            AI Auto-Resolved
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f97316', border: '1px solid #ea580c' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
            Human Escalated
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function ComplexityChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Box sx={{ width: '100%', height: 260, mt: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="complexity"
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
              domain={[0, 100]}
              tickFormatter={(tick) => `${tick}%`}
            />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              labelStyle={{ fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}
              itemStyle={{ fontWeight: 500 }}
              cursor={{ fill: '#f8fafc' }}
              formatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="ai_pct"
              name="AI Handled"
              stackId="a"
              fill="#3b82f6"
              radius={[0, 0, 4, 4]}
              barSize={40}
            />
            <Bar
              dataKey="human_pct"
              name="Human Escalated"
              stackId="a"
              fill="#f97316"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: '#3b82f6' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
            AI Handled
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: '#f97316' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
            Human Escalated
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function AgenticOperations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}&_t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err.message || 'Failed to fetch data');
      setError(err.message || 'Failed to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Re-fetch whenever the tab becomes visible (fixes HMR stale-state)
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') fetchData();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchData]);

  // Auto-poll every 60 seconds to stay in sync with live API data
  useEffect(() => {
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const summary = data?.summary || {};
  const activeAgents = data?.active_agents || [];
  const resolutionVolume = data?.resolution_volume || [];
  const resolutionByComplexity = data?.resolution_by_complexity || [];
  const omniRouterActive = data?.omni_router_active ?? false;

  // Build stat cards from API data
  const totalInteractionsDelta = formatDelta(summary.total_interactions_delta_pct, false);
  const aiResolutionDelta = formatDelta(summary.ai_auto_resolution_delta, false);
  const humanEscalationDelta = formatDelta(summary.human_escalation_delta, true);

  const statCards = [
    {
      label: 'Total Interactions',
      value: summary.total_interactions?.toLocaleString() ?? '—',
      trend: totalInteractionsDelta,
      icon: <ChatBubbleOutlineRoundedIcon sx={{ color: '#475569', fontSize: 18 }} />,
      iconBgColor: '#f8fafc'
    },
    {
      label: 'AI Auto-Resolution',
      value: summary.ai_auto_resolution_pct != null ? `${summary.ai_auto_resolution_pct}%` : '—',
      valueColor: '#2563eb',
      trend: aiResolutionDelta,
      icon: <SmartToyOutlinedIcon sx={{ color: '#3b82f6', fontSize: 18 }} />,
      iconBgColor: '#eff6ff'
    },
    {
      label: 'Human Escalation',
      value: summary.human_escalation_pct != null ? `${summary.human_escalation_pct}%` : '—',
      trend: humanEscalationDelta,
      icon: <PersonOutlineRoundedIcon sx={{ color: '#f97316', fontSize: 18 }} />,
      iconBgColor: '#fff7ed'
    },
    {
      label: 'Avg Resolution Time',
      value: summary.avg_resolution_time_display ?? '—',
      subText: `AI: ${summary.avg_ai_resolution_time_display ?? '—'}  Human: ${summary.avg_human_resolution_time_display ?? '—'}`,
      icon: <AccessTimeOutlinedIcon sx={{ color: '#a855f7', fontSize: 18 }} />,
      iconBgColor: '#faf5ff'
    }
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: { xs: 1.5, md: 2.5 },
        bgcolor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pb: 6
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: '#0f172a' }}>
          Agentic Operations Dashboard
          {loading && <CircularProgress size={16} sx={{ ml: 2 }} />}
        </Typography>
        <Chip
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '14px !important', color: omniRouterActive ? '#3b82f6' : '#94a3b8' }} />}
          label={omniRouterActive ? 'Omni-Router Agent Active' : 'Omni-Router Agent Inactive'}
          size="small"
          sx={{
            bgcolor: omniRouterActive ? '#eff6ff' : '#f1f5f9',
            color: omniRouterActive ? '#1e40af' : '#64748b',
            fontWeight: 600,
            borderRadius: '6px',
            border: `1px solid ${omniRouterActive ? '#dbeafe' : '#e2e8f0'}`,
            height: 24
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 2
        }}
      >
        {statCards.map((stat, idx) => (
          <Paper
            elevation={0}
            key={idx}
            sx={{
              p: 2,
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px', lineHeight: 1.2 }}>
                {stat.label}
              </Typography>
              <Avatar sx={{ width: 32, height: 32, bgcolor: stat.iconBgColor, borderRadius: '8px', flexShrink: 0 }}>
                {stat.icon}
              </Avatar>
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: stat.valueColor || '#0f172a',
                mb: 1,
                fontSize: { xs: '24px', xl: '32px' }
              }}
            >
              {stat.value}
            </Typography>

            <Box sx={{ mt: 'auto' }}>
              {stat.trend ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {stat.trend.trendType === 'up' ? (
                    <TrendingUpRoundedIcon sx={{ fontSize: 16, color: stat.trend.trendColor }} />
                  ) : (
                    <TrendingDownRoundedIcon sx={{ fontSize: 16, color: stat.trend.trendColor }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, color: stat.trend.trendColor, fontSize: '12px' }}
                  >
                    {stat.trend.text}
                  </Typography>
                </Stack>
              ) : stat.subText ? (
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: '#64748b',
                    fontSize: '12px',
                    display: 'block',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {stat.subText}
                </Typography>
              ) : null}
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Active AI Agents Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
          Active AI Agents
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
            gap: 2
          }}
        >
          {activeAgents.map((agent, idx) => {
            const config = getAgentIconConfig(agent.agent);
            const resRate = agent.resolution_rate ?? 0;
            return (
              <Paper
                elevation={0}
                key={idx}
                sx={{
                  p: 2.5,
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start'
                }}
              >
                <Avatar
                  sx={{
                    borderRadius: '10px',
                    bgcolor: config.bgcolor,
                    color: config.color,
                    width: 44,
                    height: 44,
                    flexShrink: 0
                  }}
                >
                  {cloneElement(config.icon, { sx: { fontSize: 22 } })}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        color: '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {agent.agent}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, ml: 1 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: agent.status === 'Online' ? '#10b981' : '#94a3b8'
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: agent.status === 'Online' ? '#10b981' : '#94a3b8',
                          fontSize: '11px'
                        }}
                      >
                        {agent.status}
                      </Typography>
                    </Stack>
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      color: '#64748b',
                      display: 'block',
                      mb: 2.5,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {agent.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '11px' }}>
                      Resolution Rate
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '12px' }}>
                      {resRate}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={resRate}
                    sx={{
                      height: 4,
                      borderRadius: 2,
                      bgcolor: '#f1f5f9',
                      '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: config.color }
                    }}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>

      {/* Charts Section */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 2,
          flexGrow: 1,
          minHeight: 0
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Resolution Volume
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#64748b', mb: 1, display: 'block', fontSize: '11px' }}
          >
            AI Automated vs Human Escalated
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <ResolutionVolumeChart data={resolutionVolume} />
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>
            Resolution by Complexity
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: '#64748b', mb: 1, display: 'block', fontSize: '11px' }}
          >
            How Omni-Router distributes workload (%)
          </Typography>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <ComplexityChart data={resolutionByComplexity} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
