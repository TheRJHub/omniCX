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
  useTheme,
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
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

function ArchitectureDiagram({ orchestrationData }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const defaultAgents = [
    { agent: 'Email Agent' },
    { agent: 'Chat Agent' },
    { agent: 'Voice Agent' },
  ];

  const channelAgents = orchestrationData?.channel_agents?.length > 0
    ? orchestrationData.channel_agents
    : defaultAgents;

  const agentIcons = {
    'Email Agent': { icon: <EmailRoundedIcon sx={{ fontSize: 18 }} />, color: isDark ? 'rgba(139,92,246,0.15)' : '#f5f3ff', iconColor: '#8b5cf6' },
    'Chat Agent': { icon: <ChatBubbleRoundedIcon sx={{ fontSize: 18 }} />, color: isDark ? 'rgba(59,130,246,0.15)' : '#eff6ff', iconColor: '#3b82f6' },
    'Voice Agent': { icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 18 }} />, color: isDark ? 'rgba(249,115,22,0.15)' : '#fff7ed', iconColor: '#f97316' },
  };

  const formattedAgents = channelAgents.map(ag => ({
    label: ag.agent,
    sub: `Auto-resolving (${ag.auto_resolve_pct !== undefined ? `${ag.auto_resolve_pct}%` : '—'})`,
    ...(agentIcons[ag.agent] || { icon: <PersonRoundedIcon sx={{ fontSize: 18 }} />, color: isDark ? 'rgba(148,163,184,0.15)' : '#f8fafc', iconColor: '#94a3b8' })
  }));

  const strokeColor = isDark ? '#334155' : '#cbd5e1';

  return (
    <Paper elevation={0} sx={{ py: 3, px: 4, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <AccountTreeRoundedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '15px' }}>LangGraph Multi-Agent Architecture</Typography>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 200, gap: 0, px: 2 }}>
        {/* Column 1: Omni-Router */}
        <Box sx={{ textAlign: 'center', width: 140, flexShrink: 0 }}>
          <Box sx={{ width: 72, height: 72, bgcolor: '#2563eb', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, boxShadow: '0 8px 16px rgba(37,99,235,0.25)' }}>
            <PsychologyRoundedIcon sx={{ color: '#fff', fontSize: 38 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: 'text.primary', mb: 0.5 }}>Omni-Router Agent</Typography>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', lineHeight: 1.3 }}>Intent & Complexity<br />Classification</Typography>
        </Box>

        {/* Column 2: First set of lines (Dotted) */}
        <Box sx={{ width: 120, height: 160, flexShrink: 0 }}>
          <svg width="100%" height="100%" viewBox="0 0 100 120" fill="none">
            <path d="M 0 60 C 40 60, 60 20, 100 20" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 0 60 L 100 60" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 4" />
            <path d="M 0 60 C 40 60, 60 100, 100 100" stroke={strokeColor} strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>
        </Box>

        {/* Column 3: Central Agents */}
        <Stack spacing={2.5} sx={{ width: 230, flexShrink: 0 }}>
          {formattedAgents.map((agent, i) => (
            <Paper key={i} elevation={0} sx={{ p: 1.5, px: 2, borderRadius: '14px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', bgcolor: agent.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: agent.iconColor, flexShrink: 0 }}>
                {agent.icon}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '13px', color: 'text.primary', whiteSpace: 'nowrap' }}>{agent.label}</Typography>
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
            bgcolor: 'background.paper',
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
          <Box sx={{ width: 72, height: 72, bgcolor: isDark ? '#334155' : '#0f172a', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5, boxShadow: '0 8px 16px rgba(15,23,42,0.2)' }}>
            <PersonRoundedIcon sx={{ color: '#fff', fontSize: 38 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '14px', color: 'text.primary', mb: 0.5 }}>Human Agent</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '12px', color: 'text.secondary', mb: 0.5 }}>(Agent Assist)</Typography>
          <Typography sx={{ fontSize: '11px', color: 'text.secondary', lineHeight: 1.3 }}>Complex Issues &<br />Exceptions</Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export default function AgentOrchestration() {
  const [orchestrationData, setOrchestrationData] = useState(null);
  const [fleetData, setFleetData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  useEffect(() => {
    fetch(`${import.meta.env.VITE_OMNICX_URL || import.meta.env.OMNICX_URL}/dashboard/agent-orchestration`)
      .then(r => r.json())
      .then(setOrchestrationData)
      .catch(console.error);

    fetch(`${import.meta.env.VITE_OMNICX_URL || import.meta.env.OMNICX_URL}/dashboard/sub-agent-fleet`)
      .then(r => r.json())
      .then(setFleetData)
      .catch(console.error);

    fetch(`${import.meta.env.VITE_OMNICX_URL || import.meta.env.OMNICX_URL}/dashboard/agent-performance`)
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
  }) || [];

  const omniMetrics = performanceData?.omni_router || {};
  const traceData = performanceData?.trace_data || [];

  const allOperational = orchestrationData ? orchestrationData.all_agents_operational : null;

  return (
    <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: 'text.primary' }}>Agent Orchestration & Health</Typography>
        <Chip
          icon={allOperational ? <CheckCircleRoundedIcon sx={{ fontSize: '16px !important', color: '#10b981' }} /> : <WarningRoundedIcon sx={{ fontSize: '16px !important', color: '#f59e0b' }} />}
          label={allOperational ? "All Agents Operational" : "Some Agents Degraded"}
          sx={{ bgcolor: allOperational ? (isDark ? 'rgba(16,185,129,0.1)' : '#dcfce7') : (isDark ? 'rgba(245,158,11,0.1)' : '#fef3c7'), color: allOperational ? (isDark ? '#34d399' : '#15803d') : (isDark ? '#fbbf24' : '#b45309'), fontWeight: 700, border: 'none' }}
        />
      </Box>

      {/* Diagram Section */}
      <ArchitectureDiagram orchestrationData={orchestrationData} />

      {/* Telemetry Section (Takes Remaining Height) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, flexShrink: 0 }}>
        {/* Right Block: Performance Table */}
        <Box sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'text.primary' }}>Sub-Agent Fleet Performance</Typography>
              <Chip label="Last 1 hour" size="small" variant="outlined" sx={{ borderRadius: '6px', color: 'text.secondary', borderColor: 'divider', height: 24, fontSize: '12px' }} />
            </Box>
            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', py: 1.5, bgcolor: 'background.paper', borderBottomColor: 'divider' }}>Process</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', py: 1.5, bgcolor: 'background.paper', borderBottomColor: 'divider' }}>Executions</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', py: 1.5, bgcolor: 'background.paper', borderBottomColor: 'divider' }}>Avg Latency</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', py: 1.5, bgcolor: 'background.paper', borderBottomColor: 'divider' }}>Success</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: 'text.secondary', py: 1.5, bgcolor: 'background.paper', borderBottomColor: 'divider' }}>Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subAgentRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ py: 1.5, borderBottomColor: 'divider' }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 24, height: 24, bgcolor: `${row.color}15`, color: row.color, borderRadius: '6px' }}>
                            <HubRoundedIcon sx={{ fontSize: 14 }} />
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, fontSize: '14px', color: 'text.primary' }}>{row.process}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontSize: '14px', fontWeight: 500, color: 'text.secondary', py: 1.5, borderBottomColor: 'divider' }}>{row.executions}</TableCell>
                      <TableCell sx={{ fontSize: '14px', fontWeight: 600, color: '#10b981', py: 1.5, borderBottomColor: 'divider' }}>{row.latency}</TableCell>
                      <TableCell sx={{ fontSize: '14px', fontWeight: 700, color: 'text.primary', py: 1.5, borderBottomColor: 'divider' }}>{row.success}</TableCell>
                      <TableCell sx={{ py: 1.5, borderBottomColor: 'divider' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.secondary', width: 32 }}>{row.confidence}</Typography>
                          {row.confidence !== 'N/A' && (
                            <Box sx={{ width: 48, height: 6, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', borderRadius: 3 }}>
                              <Box sx={{ width: row.confidence, height: '100%', bgcolor: '#3b82f6', borderRadius: 3 }} />
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexShrink: 0 }}>
        {/* Top Row: Metrics & Infra */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr' }, gap: 2 }}>
          {/* Left: Agent Metrics */}
          <Box>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <TimelineRoundedIcon sx={{ color: '#3b82f6', fontSize: 24 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '18px', color: 'text.primary' }}>Agent Performance Metrics</Typography>
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                <Box sx={{ p: 2.5, borderRadius: '8px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'text.primary' }}>Omni-Router Agent</Typography>
                    <Typography sx={{ color: omniMetrics.status === 'Running' ? '#10b981' : (omniMetrics.status ? '#f59e0b' : 'text.secondary'), fontSize: '14px', fontWeight: 600 }}>• {omniMetrics.status ?? '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>Active Sessions: <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{omniMetrics.active_sessions?.toLocaleString() ?? '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>Avg Decision Time: <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{omniMetrics.avg_decision_time_sec !== undefined ? `${omniMetrics.avg_decision_time_sec}s` : '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>Classification Acc: <Box component="span" sx={{ fontWeight: 700, color: '#10b981' }}>{omniMetrics.classification_acc_pct !== undefined ? `${omniMetrics.classification_acc_pct}%` : '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>Checkpoints Stored: <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{omniMetrics.checkpoints_stored?.toLocaleString() ?? '—'}</Box></Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 2.5, borderRadius: '8px', bgcolor: 'background.default', border: '1px solid', borderColor: 'divider', flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '16px', color: 'text.primary' }}>Accelr8cx Email Agent</Typography>
                    <Typography sx={{ color: orchestrationData?.email_agent?.status === 'Running' ? '#10b981' : 'text.secondary', fontSize: '14px', fontWeight: 600 }}>• {orchestrationData?.email_agent?.status ?? '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>Active Threads: <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{orchestrationData?.email_agent?.active_threads ?? '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>Avg Draft Time: <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{orchestrationData?.email_agent?.avg_draft_time_sec !== undefined ? `${orchestrationData.email_agent.avg_draft_time_sec}s` : '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: 'text.secondary' }}>Auto-Resolution: <Box component="span" sx={{ fontWeight: 700, color: '#10b981' }}>{orchestrationData?.email_agent?.auto_resolution_pct !== undefined ? `${orchestrationData.email_agent.auto_resolution_pct}%` : '—'}</Box></Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
