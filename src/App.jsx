import { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Box,
  IconButton,
  useMediaQuery,
  Drawer,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import theme from './theme';
import Sidebar from './components/Sidebar';
import TicketManagement from './components/TicketManagement';
import CustomerJourney from './components/CustomerJourney';
import Customer360 from './components/Customer360';
import AgenticOperations from './components/AgenticOperations';
import ChannelPerformance from './components/ChannelPerformance';
import AgentOrchestration from './components/AgentOrchestration';

const PAGE_LABELS = {
  agentic: 'Agentic Operations',
  journey: 'Customer Journey',
  performance: 'Channel Performance',
  tickets: 'Accelr8cx Tickets',
  customer360: 'Customer 360',
  orchestration: 'Agent Orchestration',
  orchestration_health: 'Agent Orchestration',
};

function PlaceholderPage({ label }) {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 1,
        color: '#94a3b8',
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#cbd5e1' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '14px' }}>This page is under construction.</Typography>
    </Box>
  );
}

export default function App() {
  const [activeNav, setActiveNavState] = useState('tickets');

  const setActiveNav = (nav) => {
    window.history.pushState({ activeNav: nav }, '', window.location.pathname);
    setActiveNavState(nav);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.activeNav) {
        setActiveNavState(event.state.activeNav);
      } else {
        setActiveNavState('tickets');
      }
    };
    
    window.history.replaceState({ activeNav: 'tickets' }, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTicketClick = (customer, ticketId) => {
    setSelectedCustomer({ ...customer, activeTicketId: ticketId });
    setActiveNav('journey');
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    setActiveNav('customer360');
  };

  const renderContent = () => {
    if (activeNav === 'agentic') return <AgenticOperations />;
    if (activeNav === 'performance') return <ChannelPerformance />;
    if (activeNav === 'tickets') return <TicketManagement onTicketClick={handleTicketClick} onCustomerClick={handleCustomerClick} />;
    if (activeNav === 'journey') return <CustomerJourney selectedCustomer={selectedCustomer} />;
    if (activeNav === 'customer360') return <Customer360 selectedCustomer={selectedCustomer} />;
    if (activeNav === 'orchestration') return <AgentOrchestration />;
    return <PlaceholderPage label={PAGE_LABELS[activeNav]} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f1f5f9', width: '100%', overflow: 'hidden' }}>
        {/* Mobile Drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: 260, bgcolor: 'transparent', border: 'none' } }}
          >
            <Sidebar
              activeNav={activeNav}
              onNavChange={(id) => { setActiveNav(id); setMobileOpen(false); }}
              collapsed={false}
            />
          </Drawer>
        ) : (
          <Sidebar
            activeNav={activeNav}
            onNavChange={setActiveNav}
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        )}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Mobile top bar */}
          {isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1.5,
                bgcolor: '#0d1117',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <IconButton onClick={() => setMobileOpen(true)} sx={{ color: '#fff' }}>
                <MenuRoundedIcon />
              </IconButton>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>
                OmniCX AI
              </Typography>
            </Box>
          )}

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 0, display: 'flex', flexDirection: 'column' }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
