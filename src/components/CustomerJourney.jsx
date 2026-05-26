import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, Avatar, Chip, Stack, Divider, InputBase, IconButton, Grid, useTheme } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import { CircularProgress } from '@mui/material';

const JOURNEY_STEPS = [];

const getAgentMap = (isDark) => ({
  'agent_assist': { label: 'Human Agent (Assist)', icon: <PersonRoundedIcon sx={{ fontSize: 18, color: isDark ? '#cbd5e1' : '#1e293b' }} />, color: isDark ? '#cbd5e1' : '#1e293b' },
  'chat': { label: 'Chat Agent', icon: <ChatBubbleRoundedIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />, color: '#8b5cf6' },
  'voicebot': { label: 'Voice Agent', icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 18, color: '#f97316' }} />, color: '#f97316' },
  'email': { label: 'Email Agent', icon: <EmailRoundedIcon sx={{ fontSize: 18, color: '#3b82f6' }} />, color: '#3b82f6' },
});

export default function CustomerJourney({ selectedCustomer }) {
  const [sessions, setSessions] = useState([]);
  const [dynamicJourney, setDynamicJourney] = useState(JOURNEY_STEPS);
  const [loading, setLoading] = useState(false);
  const [customerTickets, setCustomerTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const AGENT_MAP = useMemo(() => getAgentMap(isDark), [isDark]);

  useEffect(() => {
    const fetchHistory = async () => {
      const target = selectedCustomer || {};

      if (!target.email && !target.phone) {
        setSessions([]);
        setDynamicJourney([]);
        return;
      }

      setLoading(true);
      try {
        const identifier = target.email ? `email=${target.email}` : `phone=${target.phone}`;
        const response = await fetch(`${import.meta.env.VITE_OMNICX_URL || import.meta.env.OMNICX_URL}/interactions/history?${identifier}`);
        const data = await response.json();

        if (data && data.sessions) {
          const mapped = data.sessions.map(s => {
            const agentCfg = AGENT_MAP[s.channel] || AGENT_MAP['chat'];
            const date = new Date(s.created_at);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return {
              time: timeStr,
              date: date.toLocaleDateString(),
              agent: agentCfg.label,
              icon: agentCfg.icon,
              sentiment: s.sentiment,
              customerMsg: s.summary || 'No summary available.',
              routing: s.intent ? {
                intent: s.intent.replace(/_/g, ' '),
                complexity: s.intent.includes('escalate') ? 'High' : 'Medium',
                action: s.channel === 'agent_assist' ? 'Routed to Human Agent for complex resolution.' : 'Handled by AI Agent.'
              } : null
            };
          });
          setSessions(mapped);

          const flow = [];
          data.sessions.forEach((s) => {
            const agentCfg = AGENT_MAP[s.channel] || AGENT_MAP['chat'];
            if (flow.length === 0 || flow[flow.length - 1].label !== agentCfg.label) {
              const date = new Date(s.created_at);
              const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const dateStr = date.toLocaleDateString();
              flow.push({
                label: agentCfg.label,
                channelRaw: s.channel,
                icon: agentCfg.icon,
                color: agentCfg.color,
                time: timeStr,
                date: dateStr
              });
            }
          });

          const finalFlow = flow.map((step, idx) => {
            const isLast = idx === flow.length - 1;
            let status = 'Escalated';
            if (isLast) {
              status = step.channelRaw === 'agent_assist' ? 'Resolved' : 'Auto-Resolved';
            }
            return { ...step, status };
          });

          setDynamicJourney(finalFlow.length > 0 ? finalFlow : JOURNEY_STEPS);
        } else {
          setSessions([]);
          setDynamicJourney(JOURNEY_STEPS);
        }
      } catch (error) {
        console.error('Error fetching interaction history:', error);
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedCustomer, AGENT_MAP]);

  useEffect(() => {
    const fetchCustomerTickets = async () => {
      const target = selectedCustomer || {};
      if (!target.email && !target.phone) {
        setCustomerTickets([]);
        return;
      }
      setLoadingTickets(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_OMNICX_URL || import.meta.env.OMNICX_URL}/tickets`);
        const data = await response.json();

        let ticketsArray = [];
        if (Array.isArray(data)) ticketsArray = data;
        else if (data && Array.isArray(data.tickets)) ticketsArray = data.tickets;
        else if (data && Array.isArray(data.data)) ticketsArray = data.data;

        const userTickets = ticketsArray.filter(
          (t) => t.customer_email?.toLowerCase() === target.email?.toLowerCase()
        );

        setCustomerTickets(userTickets);
      } catch (error) {
        console.error('Error fetching customer tickets:', error);
        setCustomerTickets([]);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchCustomerTickets();
  }, [selectedCustomer]);

  const customer = selectedCustomer || {};

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: 'text.primary' }}>
          Customer Journey Dashboard
        </Typography>

      </Box>

      {/* Customer Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'divider',
          mb: 3,
          background: isDark ? 'linear-gradient(to right, #1e293b, #0f172a)' : 'linear-gradient(to right, #ffffff, #f8fafc)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>{customer.name || '—'}</Typography>
              {customer.name && (
                <Chip
                  label="Active"
                  size="small"
                  sx={{ bgcolor: isDark ? 'rgba(21,128,61,0.15)' : '#dcfce7', color: isDark ? '#4ade80' : '#15803d', fontWeight: 700, px: 1 }}
                />
              )}
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>ID: {customer.custId || customer.id || 'N/A'}</Typography>
            <Stack direction="row" spacing={3} sx={{ color: 'text.secondary' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">{customer.email || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneInTalkRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2">{customer.phone || 'N/A'}</Typography>
              </Box>
            </Stack>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Last Contact: <Box component="span" sx={{ color: 'text.primary' }}>{sessions.length > 0 ? `${sessions[0].time} ${sessions[0].date}` : '—'}</Box>
          </Typography>
        </Box>
      </Paper>

      {/* Agent Flow Card */}
      {sessions.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3, bgcolor: 'background.paper' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 4, color: 'text.primary' }}>
            Omnichannel Agentic Flow
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', px: 4 }}>
            <Box
              sx={{
                position: 'absolute',
                top: '20px',
                left: '10%',
                right: '10%',
                height: '2px',
                bgcolor: isDark ? '#334155' : '#f1f5f9',
                zIndex: 0,
              }}
            />
            {dynamicJourney.map((step, idx) => (
              <Box key={idx} sx={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: 'background.paper',
                    color: step.color,
                    border: `2px solid ${step.color}`,
                    width: 42,
                    height: 42,
                    mb: 1.5,
                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  {step.icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>{step.label}</Typography>
                {step.time && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '11px', mt: 0.2 }}>
                    {step.time}
                  </Typography>
                )}
                {step.date && (
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '10px', lineHeight: 1.1 }}>
                    {step.date}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  sx={{
                    color: step.status === 'Escalated' ? '#f97316' : step.status === 'Resolved' || step.status === 'Auto-Resolved' ? '#10b981' : 'text.secondary',
                    fontWeight: 600,
                    mt: 0.2
                  }}
                >
                  {step.status}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      )}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}>
        {/* Left Column */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Timeline Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
              Interaction Timeline & AI Reasoning
            </Typography>

            <Box sx={{ position: 'relative', pl: 4, minHeight: 200 }}>
              <Box sx={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', bgcolor: isDark ? '#334155' : '#f1f5f9' }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : sessions.length === 0 ? (
                <Typography sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No interactions found for this customer.</Typography>
              ) : (
                sessions.map((item, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '-32.5px',
                        top: '0px',
                        bgcolor: 'background.paper',
                        borderRadius: '50%',
                        p: 0.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{item.time} - {item.agent}</Typography>
                      {item.sentiment && (
                        <Chip
                          label={item.sentiment}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '11px',
                            bgcolor: item.sentiment === 'Frustrated' ? (isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2') : (isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc'),
                            color: item.sentiment === 'Frustrated' ? '#ef4444' : 'text.secondary',
                            border: `1px solid ${item.sentiment === 'Frustrated' ? (isDark ? 'rgba(239,68,68,0.3)' : '#fee2e2') : 'divider'}`,
                          }}
                        />
                      )}
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: isDark ? 'divider' : '#f1f5f9',
                        borderRadius: '12px',
                        '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa' },
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, color: 'text.primary', mb: item.routing ? 2 : 0 }}>{item.customerMsg}</Typography>

                      {item.routing && (
                        <Box sx={{ bgcolor: item.routing.complexity === 'High' ? (isDark ? 'rgba(249,115,22,0.1)' : '#fff7ed') : (isDark ? 'rgba(59,130,246,0.1)' : '#f0f9ff'), p: 2, borderRadius: '8px', borderLeft: `4px solid ${item.routing.complexity === 'High' ? '#f97316' : '#3b82f6'}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: item.routing.complexity === 'High' ? '#f97316' : '#3b82f6' }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: item.routing.complexity === 'High' ? (isDark ? '#fdba74' : '#c2410c') : (isDark ? '#7dd3fc' : '#0369a1'), textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Omni-Router Reasoning
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: item.routing.complexity === 'High' ? (isDark ? '#fed7aa' : '#9a3412') : (isDark ? '#bae6fd' : '#075985'), fontSize: '13px' }}>
                            Intent: <Box component="span" sx={{ fontWeight: 700 }}>{item.routing.intent}</Box> | Complexity: <Box component="span" sx={{ fontWeight: 700 }}>{item.routing.complexity}</Box>
                          </Typography>
                          <Typography variant="body2" sx={{ color: item.routing.complexity === 'High' ? (isDark ? '#fed7aa' : '#9a3412') : (isDark ? '#bae6fd' : '#075985'), fontSize: '13px', mt: 0.5 }}>
                            <Box component="span" sx={{ fontWeight: 700 }}>Action:</Box> {item.routing.action}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Box>

        {/* Right Column */}
        <Box sx={{ width: { xs: '100%', md: '350px' }, flexShrink: 0 }}>
          <Box>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>Live Context</Typography>
              <Stack spacing={2.5}>
                {[
                  { label: 'Current Intent', value: '—', color: 'text.primary' },
                  { label: 'Complexity', value: '—', color: 'text.primary' },
                  { label: 'Order ID', value: '—', color: 'text.primary', bold: true },
                  { label: 'Customer Tier', value: '—', color: 'text.primary' },
                  { label: 'Risk Score', value: '—', color: 'text.primary' },
                ].map((row, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{row.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: row.bold ? 800 : 700, color: row.color }}>{row.value}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>Active Tickets</Typography>
              <Stack spacing={2}>
                {loadingTickets ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={20} />
                  </Box>
                ) : customerTickets.length === 0 ? (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>No active tickets found.</Typography>
                ) : (
                  customerTickets.map((ticket, idx) => {
                    const status = ticket.ticket_status || 'In Progress';
                    const isClosed = status.toLowerCase() === 'closed' || status.toLowerCase() === 'ai-resolved';

                    return (
                      <Box
                        key={idx}
                        sx={{
                          p: 2,
                          borderRadius: '12px',
                          border: '1px solid',
                          borderColor: isDark ? 'divider' : '#f1f5f9',
                          bgcolor: 'background.paper',
                          '&:hover': { borderColor: isDark ? '#475569' : '#e2e8f0' }
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '13px', color: isDark ? '#60a5fa' : '#3b82f6' }}>
                            {ticket.ticket_number || `#TKT_UNK`}
                          </Typography>
                          <Chip
                            label={status}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '9px',
                              fontWeight: 800,
                              bgcolor: isClosed ? (isDark ? 'rgba(21,128,61,0.15)' : '#dcfce7') : (isDark ? 'rgba(217,119,6,0.15)' : '#fef3c7'),
                              color: isClosed ? (isDark ? '#4ade80' : '#15803d') : (isDark ? '#fbbf24' : '#d97706')
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {`Inquiry regarding ${ticket.communication_channel || 'service'}`}
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Stack>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
