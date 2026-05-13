import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Stack, 
  Chip, 
  Avatar, 
  LinearProgress,
  IconButton
} from '@mui/material';
import { cloneElement } from 'react';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';

const STAT_CARDS = [
  {
    label: 'Total Interactions',
    value: '31,420',
    trend: '+5.2% from last week',
    trendType: 'up',
    icon: <ChatBubbleRoundedIcon sx={{ color: '#94a3b8' }} />,
    color: '#3b82f6'
  },
  {
    label: 'AI Auto-Resolution',
    value: '82.4%',
    trend: '+2.1% efficiency gain',
    trendType: 'up',
    icon: <SmartToyRoundedIcon sx={{ color: '#3b82f6' }} />,
    color: '#3b82f6'
  },
  {
    label: 'Human Escalation',
    value: '17.6%',
    trend: '-2.1% from last week',
    trendType: 'down',
    icon: <PersonRoundedIcon sx={{ color: '#f97316' }} />,
    color: '#f97316'
  },
  {
    label: 'Avg Resolution Time',
    value: '1m 45s',
    subText: 'AI: 12s | Human: 6m 30s',
    icon: <AccessTimeRoundedIcon sx={{ color: '#8b5cf6' }} />,
    color: '#8b5cf6'
  }
];

const AGENTS = [
  {
    name: 'Chat Agent',
    description: 'Handles real-time web & mobile chat',
    status: 'Online',
    resolutionRate: 88,
    icon: <ChatBubbleRoundedIcon />,
    bgcolor: '#eff6ff',
    color: '#3b82f6'
  },
  {
    name: 'Email Agent (Accelr8cx)',
    description: 'Asynchronous complex queries',
    status: 'Online',
    resolutionRate: 94,
    icon: <BoltRoundedIcon />,
    bgcolor: '#f5f3ff',
    color: '#8b5cf6'
  },
  {
    name: 'Voice Agent',
    description: 'Conversational IVR & outbound',
    status: 'Online',
    resolutionRate: 65,
    icon: <SmartToyRoundedIcon />,
    bgcolor: '#fff7ed',
    color: '#f97316'
  }
];

function ResolutionVolumeChart() {
  return (
    <Box sx={{ width: '100%', height: 240, position: 'relative', mt: 4 }}>
      <svg width="100%" height="200" viewBox="0 0 800 200" preserveAspectRatio="none">
        {/* Grid Lines */}
        {[0, 50, 100, 150].map((y) => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
        ))}
        
        {/* AI Auto-Resolved Path (Blue) */}
        <path
          d="M0,150 Q100,80 200,100 T400,60 T600,100 T800,80 L800,200 L0,200 Z"
          fill="url(#blueGradient)"
          opacity="0.6"
        />
        <path
          d="M0,150 Q100,80 200,100 T400,60 T600,100 T800,80"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Human Escalated Path (Orange) */}
        <path
          d="M0,180 Q100,170 200,175 T400,170 T600,178 T800,175 L800,200 L0,200 Z"
          fill="url(#orangeGradient)"
          opacity="0.8"
        />
        <path
          d="M0,180 Q100,170 200,175 T400,170 T600,178 T800,175"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
        />

        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Labels */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, px: 1 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <Typography key={day} variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
            {day}
          </Typography>
        ))}
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>AI Auto-Resolved</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#f97316' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>Human Escalated</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function ComplexityChart() {
  const data = [
    { label: 'Simple', ai: 95, human: 5 },
    { label: 'Medium', ai: 70, human: 30 },
    { label: 'Complex', ai: 15, human: 85 },
  ];

  return (
    <Box sx={{ width: '100%', height: 240, mt: 4, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', px: 2, gap: 4 }}>
        {data.map((item) => (
          <Box key={item.label} sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', gap: 0.5 }}>
            <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: '4px', overflow: 'hidden' }}>
              <Box sx={{ height: `${item.human}%`, bgcolor: '#f97316', width: '100%' }} />
              <Box sx={{ height: `${item.ai}%`, bgcolor: '#3b82f6', width: '100%' }} />
            </Box>
            <Typography variant="caption" align="center" sx={{ fontWeight: 600, color: '#64748b', mt: 1 }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
      
      {/* Legend */}
      <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: '#3b82f6' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>AI Handled</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '2px', bgcolor: '#f97316' }} />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>Human Escalated</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

export default function AgenticOperations() {
  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 1.5, md: 2.5 }, 
      bgcolor: '#f8fafc', 
      height: '100%', 
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Agentic Operations Dashboard
        </Typography>
        <Chip 
          icon={<AutoAwesomeRoundedIcon sx={{ fontSize: '14px !important', color: '#3b82f6' }} />}
          label="Omni-Router Agent Active"
          size="small"
          sx={{ 
            bgcolor: '#eff6ff', 
            color: '#1e40af', 
            fontWeight: 600, 
            borderRadius: '6px',
            border: '1px solid #dbeafe',
            height: 24
          }}
        />
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2}>
        {STAT_CARDS.map((stat, idx) => (
          <Grid item xs={12} sm={6} lg={3} key={idx}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', fontSize: '11px' }}>{stat.label}</Typography>
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  {cloneElement(stat.icon, { sx: { fontSize: 16 } })}
                </Avatar>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>{stat.value}</Typography>
              {stat.trend ? (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {stat.trendType === 'up' ? (
                    <TrendingUpRoundedIcon sx={{ fontSize: 14, color: '#10b981' }} />
                  ) : (
                    <TrendingDownRoundedIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                  )}
                  <Typography variant="caption" sx={{ fontWeight: 600, color: stat.trendType === 'up' ? '#10b981' : '#ef4444', fontSize: '11px' }}>
                    {stat.trend}
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '11px' }}>{stat.subText}</Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Active AI Agents Section */}
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
          Active AI Agents
        </Typography>
        <Grid container spacing={2}>
          {AGENTS.map((agent, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                  <Avatar sx={{ borderRadius: '8px', bgcolor: agent.bgcolor, color: agent.color, width: 36, height: 36 }}>
                    {cloneElement(agent.icon, { sx: { fontSize: 20 } })}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{agent.name}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', fontSize: '10px' }}>{agent.status}</Typography>
                      </Stack>
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '10px' }}>{agent.description}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', fontSize: '11px' }}>Resolution Rate</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '11px' }}>{agent.resolutionRate}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={agent.resolutionRate} 
                  sx={{ 
                    height: 4, 
                    borderRadius: 2, 
                    bgcolor: '#f1f5f9',
                    '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: agent.color }
                  }} 
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Charts Section */}
      <Grid container spacing={2} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>Resolution Volume</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontSize: '11px' }}>AI Automated vs Human Escalated</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 180 }}>
              <ResolutionVolumeChart />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>Resolution by Complexity</Typography>
            <Typography variant="caption" sx={{ color: '#64748b', mb: 1, display: 'block', fontSize: '11px' }}>How Omni-Router distributes workload (%)</Typography>
            <Box sx={{ flexGrow: 1, minHeight: 180 }}>
              <ComplexityChart />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
