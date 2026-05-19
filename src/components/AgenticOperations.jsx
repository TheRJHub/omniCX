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

const API_BASE = 'http://164.52.196.197:8099/dashboard/agentic-operations?days=7';

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

function ResolutionVolumeChart({ data }) {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.ai_automated + d.human_escalated), 1);
  const chartHeight = 150;

  // Build SVG path from data points
  const totalPoints = data.length;
  const xStep = totalPoints > 1 ? 800 / (totalPoints - 1) : 800;

  // AI line points
  const aiPoints = data.map((d, i) => {
    const x = i * xStep;
    const y = chartHeight - (d.ai_automated / maxVal) * chartHeight;
    return `${x},${y}`;
  });

  // Human line points
  const humanPoints = data.map((d, i) => {
    const x = i * xStep;
    const y = chartHeight - (d.human_escalated / maxVal) * chartHeight;
    return `${x},${y}`;
  });

  const aiPath = `M${aiPoints.join(' L')}`;
  const aiArea = `M${aiPoints.join(' L')} L800,${chartHeight} L0,${chartHeight} Z`;
  const humanPath = `M${humanPoints.join(' L')}`;
  const humanArea = `M${humanPoints.join(' L')} L800,${chartHeight} L0,${chartHeight} Z`;

  return (
    <Box sx={{ width: '100%', height: 200, position: 'relative', mt: 3 }}>
      <svg width="100%" height="200" viewBox={`0 0 800 ${chartHeight}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="blueGradientAO" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="orangeGradientAO" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 37, 75, 112].map((y) => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
        ))}

        {/* AI Area */}
        <path d={aiArea} fill="url(#blueGradientAO)" opacity="0.6" />
        <path d={aiPath} fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* Human Area */}
        <path d={humanArea} fill="url(#orangeGradientAO)" opacity="0.8" />
        <path d={humanPath} fill="none" stroke="#f97316" strokeWidth="2" />
      </svg>

      {/* Day Labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
        {data.map((d) => (
          <Typography key={d.day} variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            {d.day}
          </Typography>
        ))}
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
            AI Auto-Resolved
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f97316' }} />
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
    <Box sx={{ width: '100%', height: 200, mt: 3, display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          px: 2,
          gap: 4
        }}
      >
        {data.map((item) => (
          <Box
            key={item.complexity}
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'flex-end',
              gap: 0.5
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ height: `${item.human_pct}%`, bgcolor: '#f97316', width: '100%' }} />
              <Box sx={{ height: `${item.ai_pct}%`, bgcolor: '#3b82f6', width: '100%' }} />
            </Box>
            <Typography
              variant="caption"
              align="center"
              sx={{ fontWeight: 600, color: '#64748b', mt: 1 }}
            >
              {item.complexity}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
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
      setError(err.message || 'Failed to fetch data');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Failed to load Agentic Operations data: {error}</Alert>
      </Box>
    );
  }

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
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Agentic Operations Dashboard
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
