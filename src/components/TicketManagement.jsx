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
  Pagination,
  Popover,
  FormControl,
  Select,
  InputLabel,
  useTheme
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';

const getStatusConfig = (status, isDark) => {
  const configs = {
    'ai-resolved': {
      label: 'AI Resolved',
      bg: isDark ? 'rgba(21,128,61,0.15)' : '#dcfce7',
      color: isDark ? '#4ade80' : '#15803d',
      icon: <SmartToyRoundedIcon sx={{ fontSize: 13 }} />,
    },
    'ai-processing': {
      label: 'AI Processing',
      bg: isDark ? 'rgba(124,58,237,0.15)' : '#ede9fe',
      color: isDark ? '#a78bfa' : '#7c3aed',
      icon: <SmartToyRoundedIcon sx={{ fontSize: 13 }} />,
    },
    'in-progress': {
      label: 'In Progress',
      bg: isDark ? 'rgba(217,119,6,0.15)' : '#fef3c7',
      color: isDark ? '#fbbf24' : '#d97706',
      icon: <PersonRoundedIcon sx={{ fontSize: 13 }} />,
    },
    'pending': {
      label: 'Pending',
      bg: isDark ? 'rgba(217,119,6,0.15)' : '#fef3c7',
      color: isDark ? '#fbbf24' : '#d97706',
      icon: <PersonRoundedIcon sx={{ fontSize: 13 }} />,
    },
    'closed': {
      label: 'Closed',
      bg: isDark ? 'rgba(21,128,61,0.15)' : '#dcfce7',
      color: isDark ? '#4ade80' : '#15803d',
      icon: <SmartToyRoundedIcon sx={{ fontSize: 13 }} />,
    },
    'open': {
      label: 'Open',
      bg: isDark ? 'rgba(29,78,216,0.15)' : '#dbeafe',
      color: isDark ? '#60a5fa' : '#1d4ed8',
      icon: <PersonRoundedIcon sx={{ fontSize: 13 }} />,
    }
  };
  return configs[status] || {
    label: status,
    bg: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
    color: isDark ? '#cbd5e1' : '#475569',
    icon: <SmartToyRoundedIcon sx={{ fontSize: 13 }} />,
  };
};

const getTierConfig = (tier, isDark) => {
  const configs = {
    premium: { bg: isDark ? 'rgba(29,78,216,0.15)' : '#dbeafe', color: isDark ? '#60a5fa' : '#1d4ed8' },
    standard: { bg: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9', color: isDark ? '#cbd5e1' : '#475569' },
    enterprise: { bg: isDark ? 'rgba(126,34,206,0.15)' : '#faf5ff', color: isDark ? '#c084fc' : '#7e22ce' },
    b2b: { bg: isDark ? 'rgba(6,95,70,0.15)' : '#ecfdf5', color: isDark ? '#34d399' : '#065f46' },
  };
  return configs[tier] || configs['standard'];
};

const AGENT_ICONS = {
  phone: <PhoneRoundedIcon sx={{ fontSize: 16 }} />,
  chat: <ChatRoundedIcon sx={{ fontSize: 16 }} />,
  email: <EmailRoundedIcon sx={{ fontSize: 16 }} />,
  person: <PersonRoundedIcon sx={{ fontSize: 16 }} />,
};

const getAgentColor = (iconName, isDark) => {
  const colors = {
    phone: '#f97316',
    chat: '#8b5cf6',
    email: '#6366f1',
    person: isDark ? '#94a3b8' : '#374151',
  };
  return colors[iconName] || (isDark ? '#94a3b8' : '#374151');
};

const transformTicketData = (rawData) => {
  if (!rawData) return [];
  return rawData.map(item => {
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

    let status = item.ticket_status || 'In Progress';

    const emailStr = item.customer_email || `customer${item.cust_id || ''}@example.com`;
    const namePart = emailStr.split('@')[0];
    const name = namePart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CU';

    return {
      id: item.ticket_number || `#TKT_UNK`,
      customer: {
        name: name,
        initials: initials,
        tier: 'Standard',
        tierType: 'standard',
        email: item.customer_email || null,
        phone: null,
        custId: item.cust_id
      },
      subject: `Inquiry regarding ${item.communication_channel || 'service'}`,
      intent: {
        label: `Customer Query`,
        type: 'intent'
      },
      agent: { name: agentName, icon: agentIcon },
      status: status,
      raw: item
    };
  });
};

function ActionsMenu({ onViewDetails }) {
  const [anchor, setAnchor] = useState(null);
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
        <MoreHorizRoundedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
      </IconButton>
      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        PaperProps={{ sx: { minWidth: 160, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } }}
      >
        <MenuItem onClick={() => { setAnchor(null); onViewDetails(); }} sx={{ fontSize: 13 }}>View Details</MenuItem>
      </Menu>
    </>
  );
}

export default function TicketManagement({ onTicketClick, onCustomerClick }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(() => sessionStorage.getItem('ticketSearch') || '');
  const [selectedTicketDetails, setSelectedTicketDetails] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [page, setPage] = useState(() => parseInt(sessionStorage.getItem('ticketPage')) || 1);
  const rowsPerPage = 6;

  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [agentFilter, setAgentFilter] = useState('All');

  useEffect(() => {
    sessionStorage.setItem('ticketSearch', search);
  }, [search]);

  useEffect(() => {
    sessionStorage.setItem('ticketPage', page.toString());
  }, [page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleViewDetails = async (ticketNo) => {
    setDetailsModalOpen(true);
    setLoadingDetails(true);
    try {
      const cleanTicketNo = ticketNo.replace('#', '');
      const response = await fetch(`${import.meta.env.VITE_OMNICX_URL || import.meta.env.OMNICX_URL}/tickets/${cleanTicketNo}`);
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
        const response = await fetch(`${import.meta.env.VITE_OMNICX_URL || import.meta.env.OMNICX_URL}/tickets`);
        const data = await response.json();

        let ticketsArray = [];
        if (Array.isArray(data)) {
          ticketsArray = data;
        } else if (data && Array.isArray(data.tickets)) {
          ticketsArray = data.tickets;
        } else if (data && Array.isArray(data.data)) {
          ticketsArray = data.data;
        } else if (data && typeof data === 'object') {
          const possibleArray = Object.values(data).find(val => Array.isArray(val));
          if (possibleArray) {
            ticketsArray = possibleArray;
          } else {
            ticketsArray = [data];
          }
        }
        
        const transformedTickets = transformTicketData(ticketsArray);
        
        transformedTickets.sort((a, b) => {
          const numA = parseInt(a.id.replace(/\D/g, ''), 10) || 0;
          const numB = parseInt(b.id.replace(/\D/g, ''), 10) || 0;
          if (numA !== numB) return numA - numB;
          return a.id.localeCompare(b.id);
        });

        setTickets(transformedTickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filtered = tickets.filter((t) => {
    const term = search.toLowerCase();
    const matchesSearch = (
      t.id.toLowerCase().includes(term) ||
      t.customer.name.toLowerCase().includes(term) ||
      t.subject.toLowerCase().includes(term) ||
      t.agent.name.toLowerCase().includes(term) ||
      t.status.toLowerCase().includes(term) ||
      t.intent.label.toLowerCase().includes(term) ||
      t.customer.tier.toLowerCase().includes(term)
    );
    
    const matchesStatus = statusFilter === 'All' || t.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesAgent = agentFilter === 'All' || t.agent.name.toLowerCase() === agentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesAgent;
  });

  const totalPages = Math.ceil(filtered.length / rowsPerPage) || 1;
  const paginatedTickets = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 3,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '16px', md: '20px' }, color: 'text.primary' }}>
          Accelr8cx Ticket Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <OutlinedInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search tickets..."
            size="small"
            startAdornment={
              <InputAdornment position="start">
                <SearchRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              </InputAdornment>
            }
            sx={{
              width: { xs: '100%', sm: 240 },
              borderRadius: '8px',
              fontSize: '13px',
              bgcolor: 'background.default',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'divider' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isDark ? '#475569' : '#cbd5e1' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6', borderWidth: '1.5px' },
            }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => setFilterAnchorEl(e.currentTarget)}
            startIcon={<FilterListRoundedIcon fontSize="small" />}
            sx={{
              borderRadius: '8px',
              borderColor: 'divider',
              color: 'text.secondary',
              fontSize: '13px',
              fontWeight: 500,
              bgcolor: 'background.default',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f1f5f9', borderColor: isDark ? '#475569' : '#cbd5e1' },
              whiteSpace: 'nowrap',
            }}
          >
            Filter
          </Button>
          
          <Popover
            open={Boolean(filterAnchorEl)}
            anchorEl={filterAnchorEl}
            onClose={() => setFilterAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: { mt: 1, p: 2, width: 240, borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', bgcolor: 'background.paper' }
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>Filter Tickets</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: '13px' }}>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  sx={{ fontSize: '13px', borderRadius: '8px' }}
                >
                  <MenuItem value="All">All Statuses</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" fullWidth>
                <InputLabel sx={{ fontSize: '13px' }}>Agent</InputLabel>
                <Select
                  value={agentFilter}
                  label="Agent"
                  onChange={(e) => { setAgentFilter(e.target.value); setPage(1); }}
                  sx={{ fontSize: '13px', borderRadius: '8px' }}
                >
                  <MenuItem value="All">All Agents</MenuItem>
                  <MenuItem value="Chat Agent">Chat Agent</MenuItem>
                  <MenuItem value="Voice Agent">Voice Agent</MenuItem>
                  <MenuItem value="Email Agent">Email Agent</MenuItem>
                  <MenuItem value="Human Agent">Human Agent</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="text" 
                size="small" 
                onClick={() => { setStatusFilter('All'); setAgentFilter('All'); setPage(1); }}
                sx={{ textTransform: 'none', fontWeight: 600, mt: 1 }}
              >
                Clear Filters
              </Button>
            </Box>
          </Popover>
        </Box>
      </Box>

      {/* Table */}
      <Box sx={{ p: { xs: 2, md: 3 }, flexGrow: 1 }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', borderBottomColor: 'divider' }}>Ticket ID</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', borderBottomColor: 'divider' }}>Customer</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', borderBottomColor: 'divider' }}>Subject & Intent</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', borderBottomColor: 'divider' }}>Assigned Agent</TableCell>
                  <TableCell sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', borderBottomColor: 'divider' }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontSize: '11px', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', borderBottomColor: 'divider' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, borderBottomColor: 'divider' }}>
                      <CircularProgress size={24} sx={{ color: '#3b82f6' }} />
                    </TableCell>
                  </TableRow>
                ) : paginatedTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary', borderBottomColor: 'divider' }}>
                      No tickets match your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTickets.map((ticket) => {
                    const normalizedStatus = ticket.status.toLowerCase().replace(/\s+/g, '-');
                    const statusCfg = getStatusConfig(normalizedStatus, isDark);
                    const tierCfg = getTierConfig(ticket.customer.tierType, isDark);
                    const agentColor = getAgentColor(ticket.agent.icon, isDark);

                    return (
                      <TableRow key={ticket.id} sx={{ '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc' } }}>
                        {/* Ticket ID */}
                        <TableCell sx={{ borderBottomColor: 'divider' }}>
                          <Typography
                            onClick={() => onTicketClick && onTicketClick(ticket.customer, ticket.id)}
                            sx={{
                              color: isDark ? '#60a5fa' : '#3b82f6',
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
                        <TableCell sx={{ borderBottomColor: 'divider' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: isDark ? '#1e3a8a' : '#1d4ed8',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              {ticket.customer.initials}
                            </Avatar>
                            <Box>
                              <Typography 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onCustomerClick) onCustomerClick(ticket.customer);
                                }}
                                sx={{ 
                                  fontSize: '13px', 
                                  fontWeight: 600, 
                                  color: isDark ? '#60a5fa' : '#3b82f6', 
                                  cursor: 'pointer',
                                  '&:hover': { textDecoration: 'underline' }
                                }}
                              >
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
                        <TableCell sx={{ borderBottomColor: 'divider' }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                            {ticket.subject}
                          </Typography>
                          <Chip
                            label={ticket.intent.label}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: '11px',
                              fontWeight: 500,
                              bgcolor: ticket.intent.type === 'escalated' ? (isDark ? 'rgba(194,65,12,0.1)' : '#fff7ed') : (isDark ? 'rgba(3,105,161,0.1)' : '#f0f9ff'),
                              color: ticket.intent.type === 'escalated' ? (isDark ? '#fb923c' : '#c2410c') : (isDark ? '#38bdf8' : '#0369a1'),
                              border: `1px solid ${ticket.intent.type === 'escalated' ? (isDark ? 'rgba(194,65,12,0.3)' : '#fed7aa') : (isDark ? 'rgba(3,105,161,0.3)' : '#bae6fd')}`,
                              '& .MuiChip-label': { px: 1 },
                            }}
                            variant="outlined"
                          />
                        </TableCell>

                        {/* Assigned Agent */}
                        <TableCell sx={{ borderBottomColor: 'divider' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                color: agentColor,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {AGENT_ICONS[ticket.agent.icon] || <PersonRoundedIcon sx={{ fontSize: 16 }} />}
                            </Box>
                            <Typography sx={{ fontSize: '13px', color: agentColor }}>
                              {ticket.agent.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        {/* Status */}
                        <TableCell sx={{ borderBottomColor: 'divider' }}>
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
                        <TableCell align="right" sx={{ borderBottomColor: 'divider' }}>
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
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
              Showing {paginatedTickets.length} of {filtered.length} tickets
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
                shape="rounded"
                size="small"
                sx={{
                  '& .MuiPaginationItem-root': { fontSize: '12px', minWidth: 28, height: 28, borderRadius: '6px' },
                }}
              />
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
        PaperProps={{ sx: { borderRadius: '12px', bgcolor: 'background.paper' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '16px', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}>
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
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Ticket Number</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedTicketDetails.ticket_number || selectedTicketDetails.ticket_no || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Customer Name</Typography>
                <Typography 
                  variant="body2" 
                  onClick={() => {
                    const emailStr = selectedTicketDetails.customer_email || `customer${selectedTicketDetails.cust_id || ''}@example.com`;
                    const namePart = emailStr.split('@')[0];
                    const name = namePart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CU';
                    
                    setDetailsModalOpen(false);
                    if (onCustomerClick) {
                      onCustomerClick({
                        name: name,
                        initials: initials,
                        tier: 'Standard',
                        tierType: 'standard',
                        email: selectedTicketDetails.customer_email,
                        phone: selectedTicketDetails.customer_phone || null,
                        custId: selectedTicketDetails.cust_id
                      });
                    }
                  }}
                  sx={{ 
                    fontWeight: 700, 
                    color: isDark ? '#60a5fa' : '#3b82f6', 
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  {(() => {
                    const emailStr = selectedTicketDetails.customer_email || `customer${selectedTicketDetails.cust_id || ''}@example.com`;
                    const namePart = emailStr.split('@')[0];
                    return namePart.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  })()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedTicketDetails.ticket_status || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Customer Email</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedTicketDetails.customer_email || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Customer ID</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedTicketDetails.cust_id || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Communication Channel</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {selectedTicketDetails.communication_channel || 'N/A'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Created At</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
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
        <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button onClick={() => setDetailsModalOpen(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
