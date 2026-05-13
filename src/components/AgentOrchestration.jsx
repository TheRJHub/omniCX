import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PsychologyRoundedIcon from '@mui/icons-material/PsychologyRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import HubRoundedIcon from '@mui/icons-material/HubRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import BoltRoundedIcon from '@mui/icons-material/BoltRounded';

const PERFORMANCE_DATA = [
  { process: 'Intent Classifier', executions: '24,592', latency: '142ms', success: '99.2%', confidence: '94%', color: '#3b82f6' },
  { process: 'Sentiment Analyzer', executions: '24,592', latency: '156ms', success: '98.5%', confidence: '88%', color: '#ec4899' },
  { process: 'Ticket Lookup', executions: '21,304', latency: '89ms', success: '100.0%', confidence: 'N/A', color: '#f59e0b' },
  { process: 'Entity Extractor', executions: '19,840', latency: '134ms', success: '96.4%', confidence: '91%', color: '#8b5cf6' },
  { process: 'Response Generator', executions: '22,145', latency: '324ms', success: '98.9%', confidence: 'N/A', color: '#10b981' },
  { process: 'Escalation Decision', executions: '24,592', latency: '45ms', success: '99.8%', confidence: '96%', color: '#f43f5e' },
];

const TRACE_DATA = [
  { label: 'Intent Classifier', ms: 142, color: '#3b82f6', offset: 0 },
  { label: 'Sentiment Anal...', ms: 156, color: '#ec4899', offset: 0 },
  { label: 'Ticket Lookup', ms: 89, color: '#f59e0b', offset: 0 },
  { label: 'Entity Extractor', ms: 134, color: '#8b5cf6', offset: 0 },
  { label: 'Response Gene...', ms: 324, color: '#10b981', offset: 160 },
  { label: 'Escalation Deci...', ms: 45, color: '#f43f5e', offset: 480 },
];

function ArchitectureDiagram() {
  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 6 }}>
        <AccountTreeRoundedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>LangGraph Multi-Agent Architecture</Typography>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 320, gap: 0, px: 2 }}>
        {/* Column 1: Omni-Router */}
        <Box sx={{ textAlign: 'center', width: 140, flexShrink: 0 }}>
          <Box sx={{ width: 72, height: 72, bgcolor: '#2563eb', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, boxShadow: '0 8px 16px rgba(37,99,235,0.25)' }}>
            <PsychologyRoundedIcon sx={{ color: '#fff', fontSize: 38 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', mb: 0.5 }}>Omni-Router Agent</Typography>
          <Typography sx={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>Intent & Complexity<br/>Classification</Typography>
        </Box>

        {/* Column 2: First set of lines (Dotted) */}
        <Box sx={{ width: 120, height: 160, flexShrink: 0 }}>
            <svg width="100%" height="100%" viewBox="0 0 100 120" fill="none">
                <path d="M 0 60 C 40 60, 60 20, 100 20" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 0 60 L 100 60" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 0 60 C 40 60, 60 100, 100 100" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
            </svg>
        </Box>

        {/* Column 3: Central Agents */}
        <Stack spacing={2.5} sx={{ width: 230, flexShrink: 0 }}>
          {[
            { label: 'Email Agent', sub: 'Auto-resolving (94%)', icon: <EmailRoundedIcon sx={{ fontSize: 18 }} />, color: '#f5f3ff', iconColor: '#8b5cf6' },
            { label: 'Chat Agent', sub: 'Auto-resolving (88%)', icon: <ChatBubbleRoundedIcon sx={{ fontSize: 18 }} />, color: '#eff6ff', iconColor: '#3b82f6' },
            { label: 'Voice Agent', sub: 'Auto-resolving (65%)', icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 18 }} />, color: '#fff7ed', iconColor: '#f97316' },
          ].map((agent, i) => (
            <Paper key={i} elevation={0} sx={{ p: 1.5, px: 2, borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: agent.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: agent.iconColor, flexShrink: 0 }}>
                {agent.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#0f172a', whiteSpace: 'nowrap' }}>{agent.label}</Typography>
                <Typography sx={{ fontSize: '10px', color: '#10b981', fontWeight: 700, whiteSpace: 'nowrap' }}>{agent.sub}</Typography>
              </Box>
            </Paper>
          ))}
        </Stack>

        {/* Column 4: Escalation lines (Orange) */}
        <Box sx={{ width: 120, height: 160, flexShrink: 0, position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 100 120" fill="none">
                <path d="M 0 20 C 40 20, 60 60, 100 60" stroke="#f97316" strokeWidth="2" />
                <path d="M 0 60 L 100 60" stroke="#f97316" strokeWidth="2" />
                <path d="M 0 100 C 40 100, 60 60, 100 60" stroke="#f97316" strokeWidth="2" />
            </svg>
            <Box sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                bgcolor: '#fff',
                px: 1,
                py: 0.2,
                borderRadius: '10px',
                border: '1px solid #f97316',
                zIndex: 2
            }}>
                <Typography sx={{ fontSize: '8px', fontWeight: 900, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Escalations</Typography>
            </Box>
        </Box>

        {/* Column 5: Human Agent */}
        <Box sx={{ textAlign: 'center', width: 140, flexShrink: 0 }}>
          <Box sx={{ width: 72, height: 72, bgcolor: '#0f172a', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, boxShadow: '0 8px 16px rgba(15,23,42,0.2)' }}>
            <PersonRoundedIcon sx={{ color: '#fff', fontSize: 38 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', mb: 0.5 }}>Human Agent</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#64748b', mb: 0.5 }}>(Agent Assist)</Typography>
          <Typography sx={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>Complex Issues &<br/>Exceptions</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default function AgentOrchestration() {
  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>Agent Orchestration & Health</Typography>
        <Chip 
          icon={<CheckCircleRoundedIcon sx={{ fontSize: '16px !important', color: '#10b981' }} />}
          label="All Agents Operational"
          sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, border: 'none' }}
        />
      </Box>

      {/* Diagram Section */}
      <ArchitectureDiagram />

      {/* Telemetry Section */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', mb: 0.5 }}>Sub-Agent Orchestration & Telemetry</Typography>
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>Monitor the underlying specialized sub-agents powering your top-level channel agents.</Typography>

        <Grid container spacing={3}>
          {/* Execution Trace */}
          <Grid item xs={12} lg={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: '15px' }}>Parallel Execution Trace</Typography>
              <Typography sx={{ fontSize: '12px', color: '#94a3b8', mb: 4 }}>"Y" Example email session timeframe</Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, position: 'relative' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '11px', color: '#cbd5e1' }}>0ms</Typography>
                  <Typography sx={{ fontSize: '11px', color: '#cbd5e1' }}>780ms</Typography>
                </Box>
                {TRACE_DATA.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: '12px', color: '#64748b', width: 100, flexShrink: 0 }}>{item.label}</Typography>
                    <Box sx={{ flexGrow: 1, position: 'relative', height: 16 }}>
                        <Box sx={{ 
                            position: 'absolute', 
                            left: `${(item.offset / 780) * 100}%`, 
                            width: `${(item.ms / 780) * 100}%`, 
                            height: '100%', 
                            bgcolor: item.color, 
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            px: 0.5
                        }}>
                            <Typography sx={{ color: '#fff', fontSize: '9px', fontWeight: 700 }}>{item.ms}ms</Typography>
                        </Box>
                    </Box>
                  </Box>
                ))}
                
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                        Total: <Box component="span" sx={{ color: '#2563eb' }}>525ms</Box>
                    </Typography>
                    <Chip 
                        icon={<BoltRoundedIcon sx={{ fontSize: '14px !important', color: '#10b981' }} />}
                        label="Saved 255ms" 
                        size="small" 
                        sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, height: 24 }} 
                    />
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Performance Table */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>Sub-Agent Fleet Performance</Typography>
                <Chip label="Last 1 hour" size="small" variant="outlined" sx={{ borderRadius: '6px', color: '#64748b' }} />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Sub-Agent Process</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Executions</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Avg Latency</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Success Rate</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Avg Confidence</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {PERFORMANCE_DATA.map((row, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 24, height: 24, bgcolor: `${row.color}15`, color: row.color, borderRadius: '6px' }}>
                                <HubRoundedIcon sx={{ fontSize: 14 }} />
                            </Avatar>
                            <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{row.process}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>{row.executions}</TableCell>
                        <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#16a34a' }}>{row.latency}</TableCell>
                        <TableCell sx={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{row.success}</TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#64748b', width: 30 }}>{row.confidence}</Typography>
                                {row.confidence !== 'N/A' && (
                                    <Box sx={{ width: 60, height: 4, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                                        <Box sx={{ width: row.confidence, height: '100%', bgcolor: '#3b82f6', borderRadius: 2 }} />
                                    </Box>
                                )}
                            </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Bottom Metrics Section */}
      <Grid container spacing={3}>
          {/* Top Row: Left - Agent Performance Metrics */}
          <Grid item xs={12} lg={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                    <SpeedRoundedIcon sx={{ color: '#3b82f6', fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>Agent Performance Metrics</Typography>
                </Stack>
                <Stack spacing={3} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Omni-Router Agent</Typography>
                            <Chip size="small" label="Running" sx={{ height: 20, bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '10px' }} />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Typography sx={{ fontSize: '11px', color: '#64748b' }}>Active Sessions</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>1,247</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ fontSize: '11px', color: '#64748b' }}>Avg Decision Time</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>0.3s</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Classification Acc</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#16a34a' }}>99.8%</Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Typography sx={{ fontSize: '11px', color: '#64748b' }}>Checkpoints Stored</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>3,456</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>Accelr8cx Email Agent</Typography>
                            <Chip size="small" label="Running" sx={{ height: 20, bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: '10px' }} />
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography sx={{ fontSize: '11px', color: '#64748b' }}>Active Threads</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>89</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography sx={{ fontSize: '11px', color: '#64748b' }}>Avg Draft Time</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>2.1s</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography sx={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Auto-Resolution</Typography>
                                <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#16a34a' }}>94.2%</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Stack>
            </Paper>
          </Grid>

          {/* Top Row: Right - Infra & Store */}
          <Grid item xs={12} lg={5}>
            <Stack spacing={3} sx={{ height: '100%' }}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                        <HubRoundedIcon sx={{ color: '#8b5cf6', fontSize: 18 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>Event Bus (Kafka)</Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981' }} />
                        <Typography sx={{ fontSize: '12px', color: '#10b981', fontWeight: 700 }}>Healthy</Typography>
                    </Stack>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <Box>
                            <Typography sx={{ fontSize: '11px', color: '#64748b', mb: 0.5 }}>Topics</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '18px' }}>12</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '11px', color: '#64748b', mb: 0.5 }}>Messages/sec</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '18px' }}>234</Typography>
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '11px', color: '#64748b', mb: 0.5 }}>Lag</Typography>
                            <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#10b981' }}>&lt; 100ms</Typography>
                        </Box>
                    </Box>
                </Paper>
                <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2.5 }}>
                        <StorageRoundedIcon sx={{ color: '#f97316', fontSize: 18 }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>Context Store</Typography>
                    </Stack>
                    <Stack spacing={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>Redis (Fast Context)</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>1.2GB used | 4.8ms avg latency</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981' }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>PostgreSQL (Long Term)</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: '11px', color: '#64748b' }}>Conn: 45/100 | Query: 12ms</Typography>
                        </Box>
                    </Stack>
                </Paper>
            </Stack>
          </Grid>

          {/* Bottom Row: Full-width Events */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                    <ErrorOutlineRoundedIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>Recent Orchestration Events (Last 1 hour)</Typography>
                </Stack>
                <Stack spacing={2}>
                    <Box sx={{ p: 1.5, bgcolor: '#fef2f2', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <WarningRoundedIcon sx={{ fontSize: 14, color: '#ef4444' }} />
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#b91c1c' }}>Voice Agent: High Latency Detected</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '11px', color: '#b91c1c', opacity: 0.8 }}>Auto-scaled Voice Agent instances from 4 to 8. Latency normalized.</Typography>
                    </Box>
                    <Box sx={{ p: 1.5, bgcolor: '#fffbeb', borderLeft: '4px solid #f59e0b', borderRadius: '4px' }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <BoltRoundedIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                            <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#b45309' }}>LangGraph checkpoint save delayed (1)</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: '11px', color: '#b45309', opacity: 0.8 }}>Recovered from previous state. No context lost.</Typography>
                    </Box>
                </Stack>
            </Paper>
          </Grid>
      </Grid>
    </Box>
  );
}
