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
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import DnsRoundedIcon from '@mui/icons-material/DnsRounded';
import CallSplitRoundedIcon from '@mui/icons-material/CallSplitRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

function ArchitectureDiagram({ orchestrationData }) {
  const defaultAgents = [
    { agent: 'Email Agent' },
    { agent: 'Chat Agent' },
    { agent: 'Voice Agent' },
  ];

  const channelAgents = orchestrationData?.channel_agents?.length > 0
    ? orchestrationData.channel_agents
    : defaultAgents;

  const agentIcons = {
    'Email Agent': { icon: <EmailRoundedIcon sx={{ fontSize: 18 }} />, color: '#f5f3ff', iconColor: '#8b5cf6' },
    'Chat Agent': { icon: <ChatBubbleRoundedIcon sx={{ fontSize: 18 }} />, color: '#eff6ff', iconColor: '#3b82f6' },
    'Voice Agent': { icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 18 }} />, color: '#fff7ed', iconColor: '#f97316' },
  };

  const formattedAgents = channelAgents.map(ag => ({
    label: ag.agent,
    sub: `Auto-resolving (${ag.auto_resolve_pct !== undefined ? `${ag.auto_resolve_pct}%` : '—'})`,
    ...(agentIcons[ag.agent] || { icon: <PersonRoundedIcon sx={{ fontSize: 18 }} />, color: '#f8fafc', iconColor: '#64748b' })
  }));

  return (
    <Paper elevation={0} sx={{ py: 3, px: 4, borderRadius: '16px', border: '1px solid #e2e8f0', bgcolor: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <AccountTreeRoundedIcon sx={{ color: '#3b82f6', fontSize: 20 }} />
        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>LangGraph Multi-Agent Architecture</Typography>
      </Stack>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 200, gap: 0, px: 2 }}>
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
    fetch(`${import.meta.env.OMNICX_URL}/dashboard/agent-orchestration`)
      .then(r => r.json())
      .then(setOrchestrationData)
      .catch(console.error);

    fetch(`${import.meta.env.OMNICX_URL}/dashboard/sub-agent-fleet`)
      .then(r => r.json())
      .then(setFleetData)
      .catch(console.error);

    fetch(`${import.meta.env.OMNICX_URL}/dashboard/agent-performance`)
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
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: '#0f172a' }}>Agent Orchestration & Health</Typography>
        <Chip
          icon={allOperational ? <CheckCircleRoundedIcon sx={{ fontSize: '16px !important', color: '#10b981' }} /> : <WarningRoundedIcon sx={{ fontSize: '16px !important', color: '#f59e0b' }} />}
          label={allOperational ? "All Agents Operational" : "Some Agents Degraded"}
          sx={{ bgcolor: allOperational ? '#dcfce7' : '#fef3c7', color: allOperational ? '#15803d' : '#b45309', fontWeight: 700, border: 'none' }}
        />
      </Box>

      {/* Diagram Section */}
      <ArchitectureDiagram orchestrationData={orchestrationData} />

      {/* Telemetry Section (Takes Remaining Height) */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 2, flexShrink: 0 }}>
        {/* Left Block: Execution Trace */}
        <Box sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#0f172a', mb: 1 }}>Parallel Execution Trace</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <CallSplitRoundedIcon sx={{ color: '#64748b', fontSize: 18 }} />
              <Typography sx={{ fontSize: '14px', color: '#64748b' }}>Example email session timeframe</Typography>
            </Stack>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, position: 'relative' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, ml: '120px' }}>
                <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>0ms</Typography>
                <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>780ms</Typography>
              </Box>
              <Box sx={{ position: 'absolute', top: 20, bottom: 40, left: '120px', right: 0, pointerEvents: 'none' }}>
                <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, borderLeft: '1px dashed #cbd5e1' }} />
                <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, borderLeft: '1px dashed #cbd5e1' }} />
              </Box>
              {traceData.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                  <Typography sx={{ fontSize: '14px', color: '#0f172a', width: 120, flexShrink: 0 }}>{item.label}</Typography>
                  <Box sx={{ flexGrow: 1, position: 'relative', height: 24 }}>
                    <Box sx={{
                      position: 'absolute',
                      left: `${(item.offset / 780) * 100}%`,
                      width: `${(item.ms / 780) * 100}%`,
                      height: '100%',
                      bgcolor: item.color || '#3b82f6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      px: 1
                    }}>
                      <Typography sx={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>{item.ms}ms</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1, position: 'relative' }}>
                <Typography sx={{ fontSize: '15px', color: '#475569' }}>
                  Total: <Box component="span" sx={{ fontWeight: 800, color: '#0f172a' }}>{performanceData?.trace_total_ms !== undefined ? `${performanceData.trace_total_ms}ms` : '—'}</Box>
                </Typography>
                {performanceData?.trace_saved_ms !== undefined && (
                  <Chip
                    icon={<BoltRoundedIcon sx={{ fontSize: '16px !important', color: '#10b981' }} />}
                    label={`Saved ${performanceData.trace_saved_ms}ms`}
                    size="small"
                    sx={{ bgcolor: '#dcfce7', color: '#10b981', fontWeight: 700, height: 28, fontSize: '13px', px: 1, border: 'none' }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Block: Performance Table */}
        <Box sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>Sub-Agent Fleet Performance</Typography>
              <Chip label="Last 1 hour" size="small" variant="outlined" sx={{ borderRadius: '6px', color: '#64748b', height: 24, fontSize: '12px' }} />
            </Box>
            <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: '#64748b', py: 1.5 }}>Process</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: '#64748b', py: 1.5 }}>Executions</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: '#64748b', py: 1.5 }}>Avg Latency</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: '#64748b', py: 1.5 }}>Success</TableCell>
                    <TableCell sx={{ fontSize: '12px', fontWeight: 700, color: '#64748b', py: 1.5 }}>Confidence</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subAgentRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar sx={{ width: 24, height: 24, bgcolor: `${row.color}15`, color: row.color, borderRadius: '6px' }}>
                            <HubRoundedIcon sx={{ fontSize: 14 }} />
                          </Avatar>
                          <Typography sx={{ fontWeight: 600, fontSize: '13px', color: '#0f172a' }}>{row.process}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', fontWeight: 500, color: '#475569', py: 1.5 }}>{row.executions}</TableCell>
                      <TableCell sx={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', py: 1.5 }}>{row.latency}</TableCell>
                      <TableCell sx={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', py: 1.5 }}>{row.success}</TableCell>
                      <TableCell sx={{ py: 1.5 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#64748b', width: 32 }}>{row.confidence}</Typography>
                          {row.confidence !== 'N/A' && (
                            <Box sx={{ width: 48, height: 6, bgcolor: '#f1f5f9', borderRadius: 3 }}>
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
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2 }}>
          {/* Left: Agent Metrics */}
          <Box>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <TimelineRoundedIcon sx={{ color: '#0052cc', fontSize: 24 }} />
                <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>Agent Performance Metrics</Typography>
              </Stack>
              <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                <Box sx={{ p: 2.5, borderRadius: '8px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>Omni-Router Agent</Typography>
                    <Typography sx={{ color: omniMetrics.status === 'Running' ? '#10b981' : (omniMetrics.status ? '#f59e0b' : '#64748b'), fontSize: '14px', fontWeight: 600 }}>• {omniMetrics.status ?? '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Active Sessions: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{omniMetrics.active_sessions?.toLocaleString() ?? '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Avg Decision Time: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{omniMetrics.avg_decision_time_sec !== undefined ? `${omniMetrics.avg_decision_time_sec}s` : '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Classification Acc: <Box component="span" sx={{ fontWeight: 700, color: '#10b981' }}>{omniMetrics.classification_acc_pct !== undefined ? `${omniMetrics.classification_acc_pct}%` : '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Checkpoints Stored: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{omniMetrics.checkpoints_stored?.toLocaleString() ?? '—'}</Box></Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 2.5, borderRadius: '8px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>Accelr8cx Email Agent</Typography>
                    <Typography sx={{ color: orchestrationData?.email_agent?.status === 'Running' ? '#10b981' : '#64748b', fontSize: '14px', fontWeight: 600 }}>• {orchestrationData?.email_agent?.status ?? '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Active Threads: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{orchestrationData?.email_agent?.active_threads ?? '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Avg Draft Time: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{orchestrationData?.email_agent?.avg_draft_time_sec !== undefined ? `${orchestrationData.email_agent.avg_draft_time_sec}s` : '—'}</Box></Typography>
                    <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Auto-Resolution: <Box component="span" sx={{ fontWeight: 700, color: '#10b981' }}>{orchestrationData?.email_agent?.auto_resolution_pct !== undefined ? `${orchestrationData.email_agent.auto_resolution_pct}%` : '—'}</Box></Typography>
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Box>

          {/* Middle: Infra */}
          <Box>
            <Stack spacing={2} sx={{ height: '100%' }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                  <DnsRoundedIcon sx={{ color: '#8b5cf6', fontSize: 24 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>Event Bus (Kafka)</Typography>
                </Stack>
                <Typography sx={{ fontSize: '15px', color: orchestrationData?.event_bus?.status === 'Healthy' ? '#10b981' : '#64748b', fontWeight: 700, mb: 2 }}>• {orchestrationData?.event_bus?.status ?? '—'}</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '8px', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '15px', color: '#64748b', mb: 0.5 }}>Topics</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>{orchestrationData?.event_bus?.topics ?? '—'}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '8px', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '15px', color: '#64748b', mb: 0.5 }}>Messages/sec</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>{orchestrationData?.event_bus?.messages_per_sec ?? '—'}</Typography>
                  </Box>
                  <Box sx={{ flex: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '8px', textAlign: 'center' }}>
                    <Typography sx={{ fontSize: '15px', color: '#64748b', mb: 0.5 }}>Lag</Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#10b981' }}>{orchestrationData?.event_bus?.lag_ms !== undefined ? `<${orchestrationData.event_bus.lag_ms}ms` : '—'}</Typography>
                  </Box>
                </Box>
              </Paper>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
                  <StorageRoundedIcon sx={{ color: '#ea580c', fontSize: 24 }} />
                  <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>Context Store</Typography>
                </Stack>
                <Stack spacing={2} sx={{ flexGrow: 1, justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}><Box component="span" sx={{ color: '#10b981', mr: 1 }}>•</Box>Redis (Fast Context)</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#64748b' }}>{orchestrationData?.context_store?.redis?.used_gb !== undefined ? `${orchestrationData.context_store.redis.used_gb}GB used | ${orchestrationData.context_store.redis.avg_latency_ms}ms avg latency` : '—'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                    <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}><Box component="span" sx={{ color: '#10b981', mr: 1 }}>•</Box>PostgreSQL (Long Term)</Typography>
                    <Typography sx={{ fontSize: '14px', color: '#64748b' }}>{orchestrationData?.context_store?.postgres?.connections !== undefined ? `Conn: ${orchestrationData.context_store.postgres.connections} | Query: ${orchestrationData.context_store.postgres.query_ms}ms` : '—'}</Typography>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Box>
        </Box>

        {/* Bottom Row: Events */}
        <Box sx={{ width: '100%' }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <ErrorOutlineRoundedIcon sx={{ color: '#dc2626', fontSize: 24 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#0f172a' }}>Recent Orchestration Events (Last 1 hour)</Typography>
            </Stack>
            <Stack spacing={2}>
              {orchestrationData?.events?.length > 0 ? orchestrationData.events.map((ev, i) => (
                <Box key={i} sx={{ p: 2, borderRadius: '8px', bgcolor: ev.type === 'error' ? '#fef2f2' : '#fefce8', border: `1px solid ${ev.type === 'error' ? '#fecaca' : '#fef08a'}`, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <AccessTimeRoundedIcon sx={{ color: ev.type === 'error' ? '#dc2626' : '#ca8a04', fontSize: 18, mt: 0.2 }} />
                  <Box>
                    <Typography sx={{ fontWeight: 600, color: ev.type === 'error' ? '#b91c1c' : '#a16207', fontSize: '14px', mb: 0.5 }}>{ev.title}</Typography>
                    <Typography sx={{ fontSize: '14px', color: ev.type === 'error' ? '#dc2626' : '#ca8a04' }}>{ev.description}</Typography>
                  </Box>
                </Box>
              )) : (
                <Typography sx={{ color: '#64748b', fontSize: '14px' }}>—</Typography>
              )}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
