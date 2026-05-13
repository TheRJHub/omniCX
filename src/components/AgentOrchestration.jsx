import React, { useState, useEffect } from 'react';
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

function ArchitectureDiagram({ orchestrationData }) {
  const channelAgents = orchestrationData?.channel_agents || [
    { agent: 'Email Agent', auto_resolve_pct: 94 },
    { agent: 'Chat Agent', auto_resolve_pct: 88 },
    { agent: 'Voice Agent', auto_resolve_pct: 65 },
  ];

  const agentIcons = {
    'Email Agent': { icon: <EmailRoundedIcon sx={{ fontSize: 18 }} />, color: '#f5f3ff', iconColor: '#8b5cf6' },
    'Chat Agent': { icon: <ChatBubbleRoundedIcon sx={{ fontSize: 18 }} />, color: '#eff6ff', iconColor: '#3b82f6' },
    'Voice Agent': { icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 18 }} />, color: '#fff7ed', iconColor: '#f97316' },
  };

  const formattedAgents = channelAgents.map(ag => ({
    label: ag.agent,
    sub: `Auto-resolving (${ag.auto_resolve_pct}%)`,
    ...(agentIcons[ag.agent] || { icon: <PersonRoundedIcon sx={{ fontSize: 18 }} />, color: '#f8fafc', iconColor: '#64748b' })
  }));

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
          <Typography sx={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>Intent & Complexity<br />Classification</Typography>
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
          {formattedAgents.map((agent, i) => (
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
          <Typography sx={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>Complex Issues &<br />Exceptions</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default function AgentOrchestration() {
  const [orchestrationData, setOrchestrationData] = useState(null);
  const [fleetData, setFleetData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    fetch('http://164.52.196.197:8099/dashboard/agent-orchestration')
      .then(r => r.json())
      .then(setOrchestrationData)
      .catch(console.error);

    fetch('http://164.52.196.197:8099/dashboard/sub-agent-fleet')
      .then(r => r.json())
      .then(setFleetData)
      .catch(console.error);

    fetch('http://164.52.196.197:8099/dashboard/agent-performance')
      .then(r => r.json())
      .then(setPerformanceData)
      .catch(console.error);
  }, []);

  const subAgentRows = fleetData?.sub_agents?.map((row, i) => {
    const colors = ['#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#10b981', '#f43f5e'];
    return {
      process: row.agent_name,
      executions: row.executions.toLocaleString(),
      latency: `${row.avg_latency_ms}ms`,
      success: `${row.success_rate_pct}%`,
      confidence: row.avg_confidence !== null ? `${row.avg_confidence}%` : 'N/A',
      color: colors[i % colors.length]
    };
  }) || PERFORMANCE_DATA;

  const omniMetrics = performanceData?.omni_router || {
    status: 'Running',
    active_sessions: '1,247',
    avg_decision_time_sec: 0.3,
    classification_acc_pct: 99.8,
    checkpoints_stored: '3,456'
  };

  const allOperational = orchestrationData ? orchestrationData.all_agents_operational : true;

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>Agent Orchestration & Health</Typography>
        <Chip
          icon={allOperational ? <CheckCircleRoundedIcon sx={{ fontSize: '16px !important', color: '#10b981' }} /> : <WarningRoundedIcon sx={{ fontSize: '16px !important', color: '#f59e0b' }} />}
          label={allOperational ? "All Agents Operational" : "Some Agents Degraded"}
          sx={{ bgcolor: allOperational ? '#dcfce7' : '#fef3c7', color: allOperational ? '#15803d' : '#b45309', fontWeight: 700, border: 'none' }}
        />
      </Box>

      {/* Diagram Section */}
      <ArchitectureDiagram orchestrationData={orchestrationData} />

      {/* Telemetry Section (Takes Remaining Height) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 2, flexGrow: 1, minHeight: 0 }}>
        {/* Left Block: Execution Trace */}
        <Box sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Parallel Execution Trace</Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '10px', color: '#cbd5e1' }}>0ms</Typography>
                <Typography sx={{ fontSize: '10px', color: '#cbd5e1' }}>780ms</Typography>
              </Box>
              {TRACE_DATA.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '11px', color: '#64748b', width: 90, flexShrink: 0 }}>{item.label}</Typography>
                  <Box sx={{ flexGrow: 1, position: 'relative', height: 14 }}>
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
                          <Typography sx={{ color: '#fff', fontSize: '8px', fontWeight: 700 }}>{item.ms}ms</Typography>
                      </Box>
                  </Box>
                </Box>
              ))}
              <Divider sx={{ my: 0.5 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>
                      Total: <Box component="span" sx={{ color: '#2563eb' }}>525ms</Box>
                  </Typography>
                  <Chip 
                      icon={<BoltRoundedIcon sx={{ fontSize: '12px !important', color: '#10b981' }} />}
                      label="Saved 255ms" 
                      size="small" 
                      sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 700, height: 20, fontSize: '10px' }} 
                  />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Block: Performance Table */}
        <Box sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 1.5, px: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Sub-Agent Fleet Performance</Typography>
              <Chip label="Last 1 hour" size="small" variant="outlined" sx={{ borderRadius: '4px', color: '#64748b', height: 20, fontSize: '10px' }} />
            </Box>
            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', py: 1 }}>Process</TableCell>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', py: 1 }}>Executions</TableCell>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', py: 1 }}>Avg Latency</TableCell>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', py: 1 }}>Success</TableCell>
                    <TableCell sx={{ fontSize: '10px', fontWeight: 700, color: '#64748b', py: 1 }}>Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subAgentRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ py: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar sx={{ width: 20, height: 20, bgcolor: `${row.color}15`, color: row.color, borderRadius: '4px' }}>
                              <HubRoundedIcon sx={{ fontSize: 12 }} />
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, fontSize: '11px', color: '#0f172a' }}>{row.process}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 500, color: '#475569', py: 1 }}>{row.executions}</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 600, color: '#16a34a', py: 1 }}>{row.latency}</TableCell>
                      <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', py: 1 }}>{row.success}</TableCell>
                      <TableCell sx={{ py: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                              <Typography sx={{ fontSize: '11px', fontWeight: 600, color: '#64748b', width: 26 }}>{row.confidence}</Typography>
                              {row.confidence !== 'N/A' && (
                                  <Box sx={{ width: 40, height: 4, bgcolor: '#f1f5f9', borderRadius: 2 }}>
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
        </Box>
      </Box>

      {/* Bottom Metrics Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' }, gap: 2, flexShrink: 0 }}>
        {/* Left: Agent Metrics */}
        <Box>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <SpeedRoundedIcon sx={{ color: '#3b82f6', fontSize: 16 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Agent Performance Metrics</Typography>
              </Stack>
              <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>Omni-Router Agent</Typography>
                      <Typography sx={{ color: omniMetrics.status === 'Running' ? '#16a34a' : '#f59e0b', fontSize: '10px', fontWeight: 700 }}>• {omniMetrics.status}</Typography>
                  </Box>
                  <Grid container spacing={1}>
                      <Grid item xs={6}>
                          <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Active Sessions</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>{omniMetrics.active_sessions}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                          <Typography sx={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>Accuracy</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#16a34a' }}>{omniMetrics.classification_acc_pct}%</Typography>
                      </Grid>
                  </Grid>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>Email Agent</Typography>
                      <Typography sx={{ color: '#16a34a', fontSize: '10px', fontWeight: 700 }}>• Running</Typography>
                  </Box>
                  <Grid container spacing={1}>
                      <Grid item xs={6}>
                          <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Avg Draft</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '12px' }}>2.1s</Typography>
                      </Grid>
                      <Grid item xs={6}>
                          <Typography sx={{ fontSize: '10px', color: '#16a34a', fontWeight: 600 }}>Resolution</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '12px', color: '#16a34a' }}>94.2%</Typography>
                      </Grid>
                  </Grid>
              </Box>
          </Paper>
        </Box>

        {/* Middle: Infra */}
        <Box>
          <Stack spacing={2} sx={{ height: '100%' }}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <HubRoundedIcon sx={{ color: '#8b5cf6', fontSize: 16 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Event Bus</Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <Typography sx={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>• Healthy</Typography>
                  </Stack>
                  <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                      <Box>
                          <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Topics</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>12</Typography>
                      </Box>
                      <Box>
                          <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Msg/sec</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '14px' }}>234</Typography>
                      </Box>
                      <Box>
                          <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Lag</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#10b981' }}>&lt;100ms</Typography>
                      </Box>
                  </Box>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                      <StorageRoundedIcon sx={{ color: '#f97316', fontSize: 16 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Context Store</Typography>
                  </Stack>
                  <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>Redis (Fast)</Typography>
                          <Typography sx={{ fontSize: '10px', color: '#64748b' }}>1.2GB | 4.8ms</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>PostgreSQL</Typography>
                          <Typography sx={{ fontSize: '10px', color: '#64748b' }}>Conn: 45 | 12ms</Typography>
                      </Box>
                  </Stack>
              </Paper>
          </Stack>
        </Box>

        {/* Right: Events */}
        <Box>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <ErrorOutlineRoundedIcon sx={{ color: '#ef4444', fontSize: 16 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '13px' }}>Recent Events (1h)</Typography>
              </Stack>
              <Stack spacing={1.5}>
                  <Box sx={{ p: 1, bgcolor: '#fef2f2', borderLeft: '3px solid #ef4444', borderRadius: '4px' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.2 }}>
                          <WarningRoundedIcon sx={{ fontSize: 12, color: '#ef4444' }} />
                          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#b91c1c' }}>Voice Agent: High Latency</Typography>
                      </Stack>
                      <Typography sx={{ fontSize: '10px', color: '#b91c1c', opacity: 0.8 }}>Auto-scaled from 4 to 8. Normalized.</Typography>
                  </Box>
                  <Box sx={{ p: 1, bgcolor: '#fffbeb', borderLeft: '3px solid #f59e0b', borderRadius: '4px' }}>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.2 }}>
                          <BoltRoundedIcon sx={{ fontSize: 12, color: '#f59e0b' }} />
                          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#b45309' }}>Checkpoint save delayed (1)</Typography>
                      </Stack>
                      <Typography sx={{ fontSize: '10px', color: '#b45309', opacity: 0.8 }}>Recovered from previous state.</Typography>
                  </Box>
              </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
