import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Avatar, Chip, Stack, Divider, InputBase, IconButton, Grid } from '@mui/material';
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

const JOURNEY_STEPS = [
  { label: 'Email Agent', status: 'Auto-Resolved', icon: <EmailRoundedIcon />, color: '#3b82f6' },
  { label: 'Chat Agent', status: 'Auto-Resolved', icon: <ChatBubbleRoundedIcon />, color: '#8b5cf6' },
  { label: 'Voice Agent', status: 'Escalated', icon: <PhoneInTalkRoundedIcon />, color: '#f97316', active: true },
  { label: 'Human Agent', status: 'Resolved', icon: <PersonRoundedIcon />, color: '#1e293b' },
];

const AGENT_MAP = {
  'agent_assist': { label: 'Human Agent (Assist)', icon: <PersonRoundedIcon sx={{ fontSize: 18, color: '#1e293b' }} />, color: '#1e293b' },
  'chat': { label: 'Chat Agent', icon: <ChatBubbleRoundedIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />, color: '#8b5cf6' },
  'voicebot': { label: 'Voice Agent', icon: <PhoneInTalkRoundedIcon sx={{ fontSize: 18, color: '#f97316' }} />, color: '#f97316' },
  'email': { label: 'Email Agent', icon: <EmailRoundedIcon sx={{ fontSize: 18, color: '#3b82f6' }} />, color: '#3b82f6' },
};

export default function CustomerJourney({ selectedCustomer }) {
  const [sessions, setSessions] = useState([]);
  const [dynamicJourney, setDynamicJourney] = useState(JOURNEY_STEPS);
  const [loading, setLoading] = useState(false);
  const [customerTickets, setCustomerTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      // Use selectedCustomer if available, otherwise default to Pratik Abhang
      const target = selectedCustomer || { email: 'pratikabhang@gmail.com', phone: '9673440417' };
      
      setLoading(true);
      try {
        const identifier = target.email ? `email=${target.email}` : `phone=${target.phone}`;
        const response = await fetch(`http://164.52.196.197:8099/interactions/history?${identifier}`);
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

          // Build dynamic Omnichannel Agentic Flow
          const flow = [];
          data.sessions.forEach((s) => {
            const agentCfg = AGENT_MAP[s.channel] || AGENT_MAP['chat'];
            // Deduplicate consecutive same agents
            if (flow.length === 0 || flow[flow.length - 1].label !== agentCfg.label) {
              flow.push({
                label: agentCfg.label,
                channelRaw: s.channel,
                icon: agentCfg.icon,
                color: agentCfg.color
              });
            }
          });

          // Compute status for the flow items
          const finalFlow = flow.map((step, idx) => {
            const isLast = idx === flow.length - 1;
            let status = 'Escalated';
            if (isLast) {
              status = step.channelRaw === 'agent_assist' ? 'Resolved' : 'Auto-Resolved';
            }
            return {
              ...step,
              status
            };
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
  }, [selectedCustomer]);

  useEffect(() => {
    const fetchCustomerTickets = async () => {
      const target = selectedCustomer || { email: 'pratikabhang@gmail.com' };
      setLoadingTickets(true);
      try {
        const response = await fetch(`http://164.52.196.197:8099/tickets`);
        const data = await response.json();
        
        let ticketsArray = [];
        if (Array.isArray(data)) ticketsArray = data;
        else if (data && Array.isArray(data.tickets)) ticketsArray = data.tickets;
        else if (data && Array.isArray(data.data)) ticketsArray = data.data;
        
        // Filter by email
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

  const customer = selectedCustomer || {
    name: 'Pratik Abhang',
    email: 'pratikabhang@gmail.com',
    phone: '9673440417',
    tier: 'GOLD',
    tierType: 'premium'
  };

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, bgcolor: '#f8fafc' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Customer Journey Dashboard
        </Typography>
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 1,
            bgcolor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            width: 300,
          }}
        >
          <SearchRoundedIcon sx={{ color: '#94a3b8', fontSize: 20, mr: 1 }} />
          <InputBase placeholder="Search customer, ID, email..." sx={{ fontSize: '14px', width: '100%' }} />
        </Paper>
      </Box>

      {/* Customer Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          mb: 3,
          background: 'linear-gradient(to right, #ffffff, #f8fafc)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>{customer.name}</Typography>
              <Chip
                label="Active"
                size="small"
                sx={{ bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, px: 1 }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>ID: {customer.custId || customer.id || 'N/A'}</Typography>
            <Stack direction="row" spacing={3} sx={{ color: '#475569' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                <Typography variant="body2">{customer.email || 'N/A'}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneInTalkRoundedIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                <Typography variant="body2">{customer.phone || 'N/A'}</Typography>
              </Box>
            </Stack>
          </Box>
          <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
            Last Contact: <Box component="span" sx={{ color: '#475569' }}>{sessions[0]?.time} {sessions[0]?.date}</Box>
          </Typography>
        </Box>
      </Paper>
      
      {/* Agent Flow Card */}
      {sessions.length > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 4, color: '#0f172a' }}>
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
                bgcolor: '#f1f5f9',
                zIndex: 0,
              }}
            />
            {dynamicJourney.map((step, idx) => (
              <Box key={idx} sx={{ textAlign: 'center', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: '#fff',
                    color: step.color,
                    border: `2px solid ${step.color}`,
                    width: 42,
                    height: 42,
                    mb: 1.5,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  {step.icon}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{step.label}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: step.status === 'Escalated' ? '#f97316' : step.status === 'Resolved' || step.status === 'Auto-Resolved' ? '#10b981' : '#64748b',
                    fontWeight: 600,
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
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>
              Interaction Timeline & AI Reasoning
            </Typography>

            <Box sx={{ position: 'relative', pl: 4, minHeight: 200 }}>
              <Box sx={{ position: 'absolute', left: '7px', top: 0, bottom: 0, width: '2px', bgcolor: '#f1f5f9' }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                  <CircularProgress size={32} />
                </Box>
              ) : sessions.length === 0 ? (
                <Typography sx={{ py: 4, textAlign: 'center', color: '#94a3b8' }}>No interactions found for this customer.</Typography>
              ) : (
                sessions.map((item, idx) => (
                  <Box key={idx} sx={{ mb: 4, position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '-32.5px',
                        top: '0px',
                        bgcolor: '#fff',
                        borderRadius: '50%',
                        p: 0.5,
                        border: '1px solid #e2e8f0',
                        zIndex: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>{item.time} - {item.agent}</Typography>
                      {item.sentiment && (
                        <Chip
                          label={item.sentiment}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '11px',
                            bgcolor: item.sentiment === 'Frustrated' ? '#fef2f2' : '#f8fafc',
                            color: item.sentiment === 'Frustrated' ? '#ef4444' : '#64748b',
                            border: `1px solid ${item.sentiment === 'Frustrated' ? '#fee2e2' : '#e2e8f0'}`,
                          }}
                        />
                      )}
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        bgcolor: '#fff',
                        border: '1px solid #f1f5f9',
                        borderRadius: '12px',
                        '&:hover': { bgcolor: '#fafafa' },
                      }}
                    >
                      <Typography sx={{ fontWeight: 600, color: '#1e293b', mb: item.routing ? 2 : 0 }}>{item.customerMsg}</Typography>

                      {item.routing && (
                        <Box sx={{ bgcolor: item.routing.complexity === 'High' ? '#fff7ed' : '#f0f9ff', p: 2, borderRadius: '8px', borderLeft: `4px solid ${item.routing.complexity === 'High' ? '#f97316' : '#3b82f6'}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AutoAwesomeRoundedIcon sx={{ fontSize: 16, color: item.routing.complexity === 'High' ? '#f97316' : '#3b82f6' }} />
                            <Typography variant="caption" sx={{ fontWeight: 800, color: item.routing.complexity === 'High' ? '#c2410c' : '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Omni-Router Reasoning
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ color: item.routing.complexity === 'High' ? '#9a3412' : '#075985', fontSize: '13px' }}>
                            Intent: <Box component="span" sx={{ fontWeight: 700 }}>{item.routing.intent}</Box> | Complexity: <Box component="span" sx={{ fontWeight: 700 }}>{item.routing.complexity}</Box>
                          </Typography>
                          <Typography variant="body2" sx={{ color: item.routing.complexity === 'High' ? '#9a3412' : '#075985', fontSize: '13px', mt: 0.5 }}>
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
          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>Live Context</Typography>
            <Stack spacing={2.5}>
              {[
                { label: 'Current Intent', value: 'Refund Dispute', color: '#1e293b' },
                { label: 'Complexity', value: 'High', color: '#ef4444' },
                { label: 'Order ID', value: '#12345', color: '#3b82f6', bold: true },
                { label: 'Customer Tier', value: 'Gold', color: '#f59e0b' },
                { label: 'Risk Score', value: 'Low', color: '#10b981' },
              ].map((row, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>{row.label}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: row.bold ? 800 : 700, color: row.color }}>{row.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>Active Tickets</Typography>
            <Stack spacing={2}>
              {loadingTickets ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : customerTickets.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#94a3b8', textAlign: 'center' }}>No active tickets found.</Typography>
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
                        border: '1px solid #f1f5f9',
                        bgcolor: '#fff',
                        '&:hover': { borderColor: '#e2e8f0' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '13px', color: '#3b82f6' }}>
                          {ticket.ticket_number || `#TKT_UNK`}
                        </Typography>
                        <Chip
                          label={status}
                          size="small"
                          sx={{ 
                            height: 18, 
                            fontSize: '9px', 
                            fontWeight: 800, 
                            bgcolor: isClosed ? '#dcfce7' : '#fef3c7', 
                            color: isClosed ? '#15803d' : '#d97706' 
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
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
