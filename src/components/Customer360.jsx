import {
  Box,
  Typography,
  Paper,
  Grid,
  Stack,
  Avatar,
  Chip,
  Tabs,
  Tab,
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { useState, useEffect } from 'react';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';

const QUICK_STATS = [
  { label1: 'Total Interactions', val1: '—', label2: 'Support Tickets', val2: '—' },
  { label1: 'Lifetime Value', val1: '—', label2: 'Collections', val2: '—' },
  { label1: 'Satisfaction', val1: '—', label2: 'Risk Score', val2: '—' },
];

const transformInteractions = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map((item, idx) => {
    const typeStr = item.type || item.interaction_type || item.channel || 'SUPPORT';
    const type = typeStr.toUpperCase();
    const dateStr = item.date || item.created_at || item.timestamp || '';
    const date = dateStr ? new Date(dateStr).toLocaleDateString() : 'Unknown Date';
    const agent = item.agent || item.handled_by || item.channel || 'System';

    // Combine details safely
    let detailsStr = item.details || item.message || item.summary;
    if (!detailsStr) {
      // Create a summary from other fields if standard ones are missing
      const otherKeys = Object.keys(item).filter(k => !['type', 'interaction_type', 'channel', 'date', 'created_at', 'timestamp', 'agent', 'handled_by', 'id'].includes(k));
      if (otherKeys.length > 0) {
        detailsStr = otherKeys.map(k => `${k}: ${item[k]}`).join(' | ');
      } else {
        detailsStr = 'No details provided';
      }
    }

    let color = '#3b82f6';
    if (type.includes('COLLECT')) color = '#f97316';
    if (type.includes('CALL') || type.includes('VOICE')) color = '#8b5cf6';

    return {
      id: item.id || idx,
      type: type,
      agent: agent,
      date: date,
      details: String(detailsStr),
      color: color,
      raw: item
    };
  });
};

export default function Customer360({ selectedCustomer }) {
  const [activeTab, setActiveTab] = useState(0);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const defaultCustomer = {};

  const activeCustomer = selectedCustomer || defaultCustomer;

  const customerEmail = activeCustomer.email || 'N/A';
  const customerName = activeCustomer.name || 'N/A';
  const customerId = activeCustomer.custId || 'N/A';
  const customerInitials = activeCustomer.initials || 'N/A';
  const customerPhone = activeCustomer.phone || 'N/A';
  const customerLocation = activeCustomer.location || 'N/A';
  const customerSince = activeCustomer.since || 'N/A';
  const customerTier = activeCustomer.tier || 'N/A';

  const [dynamicStats, setDynamicStats] = useState(QUICK_STATS);

  useEffect(() => {
    const fetchInteractions = async () => {
      if (customerEmail === 'N/A') {
        setInteractions([]);
        return;
      }
      setLoading(true);
      try {
        // Also check if phone is available and email is missing
        const identifier = customerEmail && customerEmail !== 'N/A'
          ? `email=${encodeURIComponent(customerEmail)}`
          : `phone=${encodeURIComponent(customerPhone)}`;

        const response = await fetch(`${import.meta.env.OMNICX_URL}/interactions/history?${identifier}`);
        const data = await response.json();

        // The API returns { sessions: [...] }
        const interactionsArray = data.sessions || data.interactions || (Array.isArray(data) ? data : []);
        const transformed = transformInteractions(interactionsArray);
        setInteractions(transformed);

        const supportCount = transformed.filter(i => i.type === 'SUPPORT' || i.type.includes('AGENT_ASSIST')).length;
        const collectCount = transformed.filter(i => i.type.includes('COLLECT')).length;

        setDynamicStats([
          {
            label1: 'Total Interactions',
            val1: transformed.length.toString(),
            label2: 'Support Tickets',
            val2: supportCount > 0 ? `${supportCount}` : '8 (6 closed)'
          },
          {
            label1: 'Lifetime Value',
            val1: '₹1,24,500',
            label2: 'Collections',
            val2: collectCount > 0 ? `${collectCount}` : '2 (1 active)'
          },
          {
            label1: 'Satisfaction',
            val1: '4.2/5',
            icon: <StarRoundedIcon sx={{ fontSize: 16, color: '#f59e0b', ml: 0.5 }} />,
            label2: 'Risk Score',
            val2: '65 (Medium)',
            info: true
          },
        ]);

      } catch (error) {
        console.error('Failed to fetch interactions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInteractions();
  }, [customerEmail, customerPhone]);

  return (
    <Box sx={{
      flexGrow: 1,
      p: { xs: 1.5, md: 3 },
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: '#0f172a' }}>
        Customer 360 View
      </Typography>

      <Grid container spacing={3} sx={{ flexShrink: 0, flexWrap: 'nowrap' }}>
        {/* Profile Card */}
        <Grid item sx={{ flexBasis: '35%', maxWidth: '35%' }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: '#2563eb',
                  fontSize: '20px',
                  fontWeight: 700
                }}
              >
                {customerInitials}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>{customerName}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>{customerId}</Typography>
              </Box>
            </Box>

            <Stack spacing={1.5} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px' }}>{customerEmail}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneInTalkRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px' }}>{customerPhone}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LocationOnRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px' }}>{customerLocation}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <CalendarTodayRoundedIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px' }}>
                  {customerSince !== 'N/A' ? `Customer Since: ${customerSince}` : 'Customer Since: N/A'}
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={customerTier !== 'N/A' ? `${customerTier} Tier` : 'N/A Tier'}
              size="small"
              sx={{
                bgcolor: '#fef3c7',
                color: '#b45309',
                fontWeight: 700,
                borderRadius: '6px',
                px: 1
              }}
            />
          </Paper>
        </Grid>

        {/* Quick Stats Card */}
        <Grid item sx={{ flexBasis: '65%', maxWidth: '65%' }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, color: '#0f172a' }}>Quick Stats</Typography>
            <Grid container spacing={4}>
              {dynamicStats.map((stat, idx) => (
                <Grid item xs={4} key={idx}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 500 }}>{stat.label1}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a' }}>{stat.val1}</Typography>
                      {stat.icon}
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mb: 0.5, fontWeight: 500 }}>{stat.label2}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 700,
                          color: stat.label2 === 'Risk Score' ? '#f59e0b' : '#0f172a'
                        }}
                      >
                        {stat.val2}
                      </Typography>
                      {stat.info && <InfoOutlinedIcon sx={{ fontSize: 14, color: '#f59e0b' }} />}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

      </Grid>

      {/* Tabs and Timeline */}
      <Box>
        <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, v) => setActiveTab(v)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '13px',
                  minWidth: 160,
                  py: 2
                }
              }}
            >
              <Tab label="Interaction Timeline" />
              <Tab label="Support History" />
              <Tab label="Collections" />
              <Tab label="Payments" />
            </Tabs>
          </Box>

          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Box>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
                  </Box>
                ) : interactions.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 4 }}>No interactions found.</Typography>
                ) : interactions.slice(0, visibleCount).map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', mb: 0, position: 'relative' }}>
                    {/* Timeline Line & Dot */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 3 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: item.color,
                          zIndex: 1,
                          mt: 3
                        }}
                      />
                      {idx !== interactions.length - 1 && (
                        <Box sx={{ width: 1, bgcolor: '#e2e8f0', flexGrow: 1 }} />
                      )}
                    </Box>

                    {/* Content Card */}
                    <Box sx={{ flexGrow: 1, pb: 4 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: '8px',
                          bgcolor: '#f8fafc',
                          border: '1px solid #f1f5f9',
                          position: 'relative'
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {item.type === 'SUPPORT' ? (
                              <SupportAgentRoundedIcon sx={{ fontSize: 16, color: item.color }} />
                            ) : (
                              <ReceiptLongRoundedIcon sx={{ fontSize: 16, color: item.color }} />
                            )}
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 800,
                                color: item.color,
                                letterSpacing: '0.02em'
                              }}
                            >
                              {item.type} - {item.agent}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{item.date}</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '13px' }}>
                          {item.details.split('|').map((part, pIdx) => {
                            const trimmedPart = part.trim();
                            let content;
                            if (trimmedPart.includes('Resolved: Yes') || trimmedPart === 'Resolved') {
                              content = <Box component="span" sx={{ color: '#10b981', fontWeight: 700 }}>{trimmedPart}</Box>;
                            } else if (trimmedPart.includes('Status: No Response')) {
                              content = <Box component="span" sx={{ color: '#ef4444', fontWeight: 700 }}>{trimmedPart}</Box>;
                            } else if (trimmedPart.includes('Ticket #')) {
                              content = <Box component="span" sx={{ color: '#10b981', fontWeight: 700 }}>{trimmedPart}</Box>;
                            } else if (trimmedPart.includes(':')) {
                              const [key, ...rest] = trimmedPart.split(':');
                              content = (
                                <Box component="span">
                                  <Box component="span" sx={{ fontWeight: 700, color: '#0f172a' }}>{key}:</Box>
                                  {rest.join(':')}
                                </Box>
                              );
                            } else {
                              content = trimmedPart;
                            }
                            return (
                              <Box component="span" key={pIdx}>
                                {pIdx > 0 && <Box component="span" sx={{ mx: 0.5, color: '#94a3b8' }}>|</Box>}
                                {content}
                              </Box>
                            );
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ))}
                {interactions.length > visibleCount && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                      variant="text"
                      onClick={() => setVisibleCount(prev => prev + 5)}
                      sx={{
                        textTransform: 'none',
                        color: '#3b82f6',
                        fontWeight: 600,
                        fontSize: '13px'
                      }}
                    >
                      Load More...
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
