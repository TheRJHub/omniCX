import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Stack, 
  Avatar, 
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

const STAT_CARDS = [
  { label: 'Overall Auto-Resolution', value: '82.3%', trend: '+2.4%', trendType: 'up', color: '#3b82f6', icon: <CheckCircleRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Total Volume', value: '45,231', trend: '+12.5%', trendType: 'up', color: '#8b5cf6', icon: <PeopleOutlineRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Avg Handle Time (AHT)', value: '2m 14s', trend: '-1.2m', trendType: 'down', color: '#f97316', icon: <AccessTimeRoundedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Average CSAT', value: '4.6 / 5.0', trend: '+0.2', trendType: 'up', color: '#10b981', icon: <BarChartRoundedIcon sx={{ fontSize: 18 }} /> },
];

const DETAILED_METRICS = [
  { agent: 'Chat Agent', volume: '19,540', resRate: 88.0, escRate: '12.0%', aht: '1m 12s', csat: '4.5', color: '#3b82f6', icon: <ChatBubbleRoundedIcon sx={{ fontSize: 16 }} /> },
  { agent: 'Email Agent', volume: '12,400', resRate: 94.2, escRate: '5.8%', aht: '2.1s (Draft)', csat: '4.7', color: '#8b5cf6', icon: <EmailRoundedIcon sx={{ fontSize: 16 }} /> },
  { agent: 'Voice Agent', volume: '8,950', resRate: 65.0, escRate: '35.0%', aht: '3m 45s', csat: '4.2', color: '#f97316', icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 16 }} /> },
  { agent: 'Human Agent', volume: '4,341', resRate: 98.5, escRate: '1.5%', aht: '8m 20s', csat: '4.8', color: '#1e293b', icon: <PersonRoundedIcon sx={{ fontSize: 16 }} /> },
];

function VolumeByChannelChart() {
  return (
    <Box sx={{ width: '100%', height: 220, position: 'relative' }}>
      <svg width="100%" height="180" viewBox="0 0 800 180" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 45, 90, 135].map(y => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
        ))}
        
        {/* Multiple Area Paths (Stacked/Overlapping) */}
        {/* Email (Purple) */}
        <path d="M0,150 Q100,140 200,40 T400,130 T600,120 T800,110 L800,180 L0,180 Z" fill="#8b5cf6" opacity="0.3" />
        <path d="M0,150 Q100,140 200,40 T400,130 T600,120 T800,110" fill="none" stroke="#8b5cf6" strokeWidth="2" />
        
        {/* Chat (Blue) */}
        <path d="M0,120 Q100,130 200,150 T400,140 T600,130 T800,100 L800,180 L0,180 Z" fill="#3b82f6" opacity="0.3" />
        <path d="M0,120 Q100,130 200,150 T400,140 T600,130 T800,100" fill="none" stroke="#3b82f6" strokeWidth="2" />

        {/* Voice (Orange) */}
        <path d="M0,160 Q100,165 200,160 T400,155 T600,162 T800,158 L800,180 L0,180 Z" fill="#f97316" opacity="0.2" />
        <path d="M0,160 Q100,165 200,160 T400,155 T600,162 T800,158" fill="none" stroke="#f97316" strokeWidth="2" />

        {/* Human (Dark) */}
        <path d="M0,175 Q100,172 200,174 T400,170 T600,175 T800,172 L800,180 L0,180 Z" fill="#1e293b" opacity="0.1" />
        <path d="M0,175 Q100,172 200,174 T400,170 T600,175 T800,172" fill="none" stroke="#1e293b" strokeWidth="2" />
      </svg>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <Typography key={day} variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{day}</Typography>
        ))}
      </Box>
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        {[
          { label: 'Chat', color: '#3b82f6' },
          { label: 'Email', color: '#8b5cf6' },
          { label: 'Human', color: '#1e293b' },
          { label: 'Voice', color: '#f97316' }
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

function ResRateByAgentChart() {
  const data = [
    { label: 'Chat Agent', val: 88, color: '#3b82f6' },
    { label: 'Email Agent', val: 95, color: '#8b5cf6' },
    { label: 'Voice Agent', val: 65, color: '#f97316' },
    { label: 'Human Agent', val: 98, color: '#1e293b' },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%', pt: 2 }}>
      <Stack spacing={3.5}>
        {data.map(item => (
          <Box key={item.label}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>{item.label}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flexGrow: 1, height: 12, bgcolor: '#f1f5f9', borderRadius: 1, overflow: 'hidden' }}>
                <Box sx={{ width: `${item.val}%`, height: '100%', bgcolor: item.color, borderRadius: 1 }} />
              </Box>
            </Box>
          </Box>
        ))}
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
  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 1.5, md: 2.5 }, 
      bgcolor: '#f8fafc', 
      height: '100%', 
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 2.5
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Channel Performance Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value="7"
            sx={{ 
              borderRadius: '8px', 
              bgcolor: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' }
            }}
          >
            <MenuItem value="7" sx={{ fontSize: '13px' }}>Last 7 Days</MenuItem>
            <MenuItem value="30" sx={{ fontSize: '13px' }}>Last 30 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={2}>
        {STAT_CARDS.map((stat, idx) => (
          <Grid item xs={12} sm={6} lg={3} key={idx}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Avatar sx={{ width: 28, height: 28, bgcolor: `${stat.color}10`, color: stat.color, border: `1px solid ${stat.color}20` }}>
                  {stat.icon}
                </Avatar>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {stat.trendType === 'up' ? (
                    <TrendingUpRoundedIcon sx={{ fontSize: 14, color: '#10b981' }} />
                  ) : (
                    <TrendingDownRoundedIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                  )}
                  <Typography variant="caption" sx={{ fontWeight: 700, color: stat.trendType === 'up' ? '#10b981' : '#ef4444' }}>
                    {stat.trend}
                  </Typography>
                </Stack>
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b', display: 'block', mb: 0.5 }}>{stat.label}</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>{stat.value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Middle Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 3 }}>Interaction Volume by Channel</Typography>
            <VolumeByChannelChart />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 3 }}>Resolution Rate by Agent</Typography>
            <ResRateByAgentChart />
          </Paper>
        </Grid>
      </Grid>

      {/* Table Section */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a' }}>Detailed Channel Metrics</Typography>
        </Box>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} size="small">
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Channel / Agent</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Volume</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Resolution Rate</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Escalation Rate</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Avg Handle Time</TableCell>
                <TableCell sx={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>CSAT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DETAILED_METRICS.map((row) => (
                <TableRow key={row.agent} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 26, height: 26, bgcolor: `${row.color}10`, color: row.color }}>
                        {row.icon}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>{row.agent}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#475569', fontSize: '13px' }}>{row.volume}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '12px', minWidth: 40 }}>{row.resRate}%</Typography>
                      <Box sx={{ width: 60, height: 4, bgcolor: '#f1f5f9', borderRadius: 2, overflow: 'hidden' }}>
                        <Box sx={{ width: `${row.resRate}%`, height: '100%', bgcolor: row.color }} />
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#475569', fontSize: '13px' }}>{row.escRate}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#475569', fontSize: '13px' }}>{row.aht}</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#1e293b', fontSize: '13px' }}>{row.csat}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
