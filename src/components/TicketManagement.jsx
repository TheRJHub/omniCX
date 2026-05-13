import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  InputAdornment,
  OutlinedInput,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';

const STATUS_CONFIG = {
  'ai-resolved': {
    label: 'AI Resolved',
    bg: '#dcfce7',
    color: '#15803d',
    icon: <SmartToyRoundedIcon sx={{ fontSize: 13 }} />,
  },
  'ai-processing': {
    label: 'AI Processing',
    bg: '#ede9fe',
    color: '#7c3aed',
    icon: <SmartToyRoundedIcon sx={{ fontSize: 13 }} />,
  },
  'in-progress': {
    label: 'In Progress',
    bg: '#fef3c7',
    color: '#d97706',
    icon: <PersonRoundedIcon sx={{ fontSize: 13 }} />,
  },
};

const TIER_CONFIG = {
  premium: { bg: '#dbeafe', color: '#1d4ed8' },
  standard: { bg: '#f1f5f9', color: '#475569' },
  enterprise: { bg: '#faf5ff', color: '#7e22ce' },
  b2b: { bg: '#ecfdf5', color: '#065f46' },
};

const AGENT_ICONS = {
  phone: <PhoneRoundedIcon sx={{ fontSize: 16 }} />,
  chat: <ChatRoundedIcon sx={{ fontSize: 16 }} />,
  email: <EmailRoundedIcon sx={{ fontSize: 16 }} />,
  person: <PersonRoundedIcon sx={{ fontSize: 16 }} />,
};

const AGENT_COLORS = {
  phone: '#f97316',
  chat: '#8b5cf6',
  email: '#6366f1',
  person: '#374151',
};

// API Integration placeholder - To be filled when API details are provided
// const API_URL = '';
// const API_KEY = '';

/**
 * Transforms raw API data into the format expected by the TicketTable UI
 */
const transformTicketData = (rawData) => {
  if (!rawData) return [];
  return rawData.map(item => {
    // Map communication_channel
    let agentName = 'Email Agent';
    let agentIcon = 'email';
    
    if (item.communication_channel === 'voicebot' || item.communication_channel?.toLowerCase().includes('voice')) {
      agentName = 'Voice Agent';
      agentIcon = 'phone';
    } else if (item.communication_channel === 'dynamic chatbot' || item.communication_channel?.toLowerCase().includes('chat')) {
      agentName = 'Chat Agent';
      agentIcon = 'chat';
    } else if (item.communication_channel === 'CSA' || item.communication_channel?.toLowerCase().includes('agent')) {
      agentName = 'Human Agent';
      agentIcon = 'person';
    } else if (item.communication_channel) {
      agentName = item.communication_channel;
    }

    // Map status
    let status = 'in-progress';
    if (item.ticket_status?.toLowerCase() === 'closed') status = 'ai-resolved';
    else if (item.ticket_status?.toLowerCase() === 'pending') status = 'in-progress';

    // Map customer email to derive name and initials if possible
    const emailStr = item.customer_email || `customer${item.cust_id || ''}@example.com`;
    const namePart = emailStr.split('@')[0];
    const name = namePart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CU';

    return {
      id: item.ticket_number || `#TKT_UNK`,
      customer: { 
        name: name, 
        initials: initials, 
        tier: 'Standard', // API does not provide tier
        tierType: 'standard',
        email: item.customer_email || null,
        phone: null,
        custId: item.cust_id
      },
      subject: `Inquiry regarding ${item.communication_channel || 'service'}`, // Fallback subject
      intent: { 
        label: `Customer Query`, 
        type: 'intent' 
      },
      agent: { name: agentName, icon: agentIcon },
      status: status,
      raw: item // Keep raw item for Dialog
    };
  });
};

function ActionsMenu({ onViewDetails }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreHorizRoundedIcon fontSize="small" sx={{ color: '#94a3b8' }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { minWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } }}
      >
        <MenuItem onClick={() => { setAnchor(null); onViewDetails(); }} sx={{ fontSize: 13 }}>View Details</MenuItem>
        <MenuItem onClick={() => setAnchor(null)} sx={{ fontSize: 13 }}>Reassign</MenuItem>
        <MenuItem onClick={() => setAnchor(null)} sx={{ fontSize: 13 }}>Close Ticket</MenuItem>
      </Menu>
    </>
  );
}

export default function TicketManagement({ onTicketClick }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewDetails = async (ticketNo) => {
    setDetailsModalOpen(true);
    setLoadingDetails(true);
    try {
      const cleanTicketNo = ticketNo.replace('#', '');
      const response = await fetch(`http://164.52.196.197:8099/tickets/${cleanTicketNo}`);
      const data = await response.json();
      setSelectedTicketDetails(data.ticket || data);
    } catch (error) {
      console.error('Error fetching single ticket details:', error);
      setSelectedTicketDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://164.52.196.197:8099/tickets');
        const data = await response.json();
        console.log("Raw API Response from /tickets:", data);
        
        let ticketsArray = [];
        if (Array.isArray(data)) {
          ticketsArray = data;
        } else if (data && Array.isArray(data.tickets)) {
          ticketsArray = data.tickets;
        } else if (data && Array.isArray(data.data)) {
          ticketsArray = data.data;
        } else if (data && typeof data === 'object') {
          // Fallback: look for any array in the response values
          const possibleArray = Object.values(data).find(val => Array.isArray(val));
          if (possibleArray) {
            ticketsArray = possibleArray;
          } else {
            // If it's a single object that might be a ticket
            ticketsArray = [data];
          }
        }
        
        console.log("Extracted Tickets Array:", ticketsArray);
        setTickets(transformTicketData(ticketsArray));
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filtered = tickets.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
      {/* Page Header */}
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 3,
          bgcolor: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: '#0f172a' }}>
          Accelr8cx Ticket Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <OutlinedInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
              </InputAdornment>
            }
            sx={{
              width: { xs: '100%', sm: 240 },
              borderRadius: '8px',
              fontSize: '13px',
              bgcolor: '#f8fafc',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6', borderWidth: '1.5px' },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            startIcon={<FilterListRoundedIcon fontSize="small" />}
            sx={{
              borderRadius: '8px',
              borderColor: '#e2e8f0',
              color: '#475569',
              fontSize: '13px',
              fontWeight: 500,
              bgcolor: '#f8fafc',
              '&:hover': { bgcolor: '#f1f5f9', borderColor: '#cbd5e1' },
              whiteSpace: 'nowrap',
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Ticket ID</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Customer</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Subject & Intent</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Assigned Agent</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={24} sx={{ color: '#3b82f6' }} />
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94a3b8' }}>
                      No tickets match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((ticket) => {
                    const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG['in-progress'];
                    const tierCfg = TIER_CONFIG[ticket.customer.tierType] || TIER_CONFIG['standard'];

                    return (
                      <TableRow key={ticket.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                        {/* Ticket ID */}
                        <TableCell>
                          <Typography
                            onClick={() => onTicketClick && onTicketClick(ticket.customer, ticket.id)}
                            sx={{
                              color: '#3b82f6',
                              fontWeight: 600,
                              fontSize: '13px',
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' },
                            }}
                          >
                            {ticket.id}
                          </Typography>
                        </TableCell>

                        {/* Customer */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: '#1d4ed8',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              {ticket.customer.initials}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                                {ticket.customer.name}
                              </Typography>
                              <Chip
                                label={ticket.customer.tier}
                                size="small"
                                sx={{
                                  height: 18,
                                  fontSize: '10px',
                                  fontWeight: 500,
                                  bgcolor: tierCfg.bg,
                                  color: tierCfg.color,
                                  '& .MuiChip-label': { px: 1 },
                                }}
                              />
                            </Box>
                          </Box>
                        </TableCell>

                        {/* Subject & Intent */}
                        <TableCell>
                          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', mb: 0.5 }}>
                            {ticket.subject}
                          </Typography>
                          <Chip
                            label={ticket.intent.label}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '11px',
                              fontWeight: 500,
                              bgcolor: ticket.intent.type === 'escalated' ? '#fff7ed' : '#f0f9ff',
                              color: ticket.intent.type === 'escalated' ? '#c2410c' : '#0369a1',
                              border: `1px solid ${ticket.intent.type === 'escalated' ? '#fed7aa' : '#bae6fd'}`,
                              '& .MuiChip-label': { px: 1 },
                            }}
                            variant="outlined"
                          />
                        </TableCell>

                        {/* Assigned Agent */}
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                color: AGENT_COLORS[ticket.agent.icon] || '#374151',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {AGENT_ICONS[ticket.agent.icon] || <PersonRoundedIcon sx={{ fontSize: 16 }} />}
                            </Box>
                            <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                              {ticket.agent.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Chip
                            icon={statusCfg.icon}
                            label={statusCfg.label}
                            size="small"
                            sx={{
                              bgcolor: statusCfg.bg,
                              color: statusCfg.color,
                              fontWeight: 600,
                              fontSize: '12px',
                              height: 24,
                              '& .MuiChip-icon': { color: statusCfg.color, ml: '6px' },
                              '& .MuiChip-label': { px: 1 },
                            }}
                          />
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                            <ActionsMenu onViewDetails={() => handleViewDetails(ticket.id)} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box
            sx={{
              px: 3,
              py: 1.5,
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontSize: '12px', color: '#94a3b8' }}>
              Showing {filtered.length} of {tickets.length} tickets
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {['1', '2', '3'].map((p) => (
                <Button
                  key={p}
                  size="small"
                  variant={p === '1' ? 'contained' : 'text'}
                  sx={{
                    minWidth: 28,
                    height: 28,
                    fontSize: '12px',
                    borderRadius: '6px',
                    ...(p !== '1' && { color: '#64748b' }),
                    ...(p === '1' && { bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }),
                  }}
                >
                  {p}
                </Button>
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Single Ticket Details Dialog */}
      <Dialog
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '16px', color: '#0f172a', borderBottom: '1px solid #e2e8f0' }}>
          Ticket Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loadingDetails ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : selectedTicketDetails ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Ticket Number</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicketDetails.ticket_number || selectedTicketDetails.ticket_no || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Status</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicketDetails.ticket_status || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Customer Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicketDetails.customer_email || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Customer ID</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicketDetails.cust_id || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Communication Channel</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicketDetails.communication_channel || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>Created At</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedTicketDetails.created_at ? new Date(selectedTicketDetails.created_at).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ color: '#ef4444', textAlign: 'center', py: 2 }}>
              Failed to load ticket details.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #e2e8f0' }}>
          <Button onClick={() => setDetailsModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
