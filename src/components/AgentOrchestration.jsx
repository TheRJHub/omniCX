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
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
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
              {TRACE_DATA.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                  <Typography sx={{ fontSize: '14px', color: '#0f172a', width: 120, flexShrink: 0 }}>{item.label}</Typography>
                  <Box sx={{ flexGrow: 1, position: 'relative', height: 24 }}>
                      <Box sx={{ 
                          position: 'absolute', 
                          left: `${(item.offset / 780) * 100}%`, 
                          width: `${(item.ms / 780) * 100}%`, 
                          height: '100%', 
                          bgcolor: item.color, 
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
                      Total: <Box component="span" sx={{ fontWeight: 800, color: '#0f172a' }}>525ms</Box>
                  </Typography>
                  <Chip 
                      icon={<BoltRoundedIcon sx={{ fontSize: '16px !important', color: '#10b981' }} />}
                      label="Saved 255ms" 
                      size="small" 
                      sx={{ bgcolor: '#dcfce7', color: '#10b981', fontWeight: 700, height: 28, fontSize: '13px', px: 1, border: 'none' }} 
                  />
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
                            <Typography sx={{ color: omniMetrics.status === 'Running' ? '#10b981' : '#f59e0b', fontSize: '14px', fontWeight: 600 }}>• {omniMetrics.status}</Typography>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Active Sessions: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{omniMetrics.active_sessions?.toLocaleString() || omniMetrics.active_sessions}</Box></Typography>
                            <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Avg Decision Time: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{omniMetrics.avg_decision_time_sec}s</Box></Typography>
                            <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Classification Acc: <Box component="span" sx={{ fontWeight: 700, color: '#10b981' }}>{omniMetrics.classification_acc_pct}%</Box></Typography>
                            <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Checkpoints Stored: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{omniMetrics.checkpoints_stored?.toLocaleString() || omniMetrics.checkpoints_stored}</Box></Typography>
                        </Box>
                    </Box>
                    <Box sx={{ p: 2.5, borderRadius: '8px', bgcolor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '16px', color: '#0f172a' }}>Accelr8cx Email Agent</Typography>
                            <Typography sx={{ color: '#10b981', fontSize: '14px', fontWeight: 600 }}>• Running</Typography>
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Active Threads: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>89</Box></Typography>
                            <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Avg Draft Time: <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>2.1s</Box></Typography>
                            <Typography sx={{ fontSize: '15px', color: '#64748b' }}>Auto-Resolution: <Box component="span" sx={{ fontWeight: 700, color: '#10b981' }}>94.2%</Box></Typography>
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
                  <Typography sx={{ fontSize: '15px', color: '#10b981', fontWeight: 700, mb: 2 }}>• Healthy</Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ flex: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '8px', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '15px', color: '#64748b', mb: 0.5 }}>Topics</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>12</Typography>
                      </Box>
                      <Box sx={{ flex: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '8px', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '15px', color: '#64748b', mb: 0.5 }}>Messages/sec</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>234</Typography>
                      </Box>
                      <Box sx={{ flex: 1, bgcolor: '#f8fafc', p: 2, borderRadius: '8px', textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '15px', color: '#64748b', mb: 0.5 }}>Lag</Typography>
                          <Typography sx={{ fontWeight: 800, fontSize: '18px', color: '#10b981' }}>&lt;100ms</Typography>
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
                          <Typography sx={{ fontSize: '14px', color: '#64748b' }}>1.2GB used | 4.8ms avg latency</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                          <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}><Box component="span" sx={{ color: '#10b981', mr: 1 }}>•</Box>PostgreSQL (Long Term)</Typography>
                          <Typography sx={{ fontSize: '14px', color: '#64748b' }}>Conn: 45/100 | Query: 12ms</Typography>
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
                  <Box sx={{ p: 2, borderRadius: '8px', bgcolor: '#fef2f2', border: '1px solid #fecaca', display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <AccessTimeRoundedIcon sx={{ color: '#dc2626', fontSize: 18, mt: 0.2 }} />
                      <Box>
                          <Typography sx={{ fontWeight: 600, color: '#b91c1c', fontSize: '14px', mb: 0.5 }}>Voice Agent: High Latency Detected</Typography>
                          <Typography sx={{ fontSize: '14px', color: '#dc2626' }}>Auto-scaled Voice Agent instances from 4 to 8. Latency normalized.</Typography>
                      </Box>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: '8px', bgcolor: '#fefce8', border: '1px solid #fef08a', display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                      <AccessTimeRoundedIcon sx={{ color: '#ca8a04', fontSize: 18, mt: 0.2 }} />
                      <Box>
                          <Typography sx={{ fontWeight: 600, color: '#a16207', fontSize: '14px', mb: 0.5 }}>LangGraph checkpoint save delayed (1)</Typography>
                          <Typography sx={{ fontSize: '14px', color: '#ca8a04' }}>Recovered from previous state. No context lost.</Typography>
                      </Box>
                  </Box>
              </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
