import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
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
import Sidebar from './Components/Sidebar';
import TicketManagement from './Components/TicketManagement';
import CustomerJourney from './Components/CustomerJourney';
import Customer360 from './Components/Customer360';
import AgenticOperations from './Components/AgenticOperations';
import ChannelPerformance from './Components/ChannelPerformance';
import AgentOrchestration from './Components/AgentOrchestration';
import Login from './Components/Login';
import { AuthProvider, useAuth } from './Context/AuthContext';

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

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active nav from location pathname
  const activeNav = location.pathname.split('/')[1] || 'tickets';

  const handleNavChange = (nav) => {
    navigate(`/${nav}`);
    if (isMobile) setMobileOpen(false);
  };

  return (
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
            onNavChange={handleNavChange}
            collapsed={false}
          />
        </Drawer>
      ) : (
        <Sidebar
          activeNav={activeNav}
          onNavChange={handleNavChange}
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
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleTicketClick = (customer, ticketId) => {
    setSelectedCustomer({ ...customer, activeTicketId: ticketId });
    navigate('/journey');
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    navigate('/customer360');
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/tickets" replace /> : <Login />}
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tickets" replace />} />
        <Route path="tickets" element={<TicketManagement onTicketClick={handleTicketClick} onCustomerClick={handleCustomerClick} />} />
        <Route path="agentic" element={<AgenticOperations />} />
        <Route path="performance" element={<ChannelPerformance />} />
        <Route path="journey" element={<CustomerJourney selectedCustomer={selectedCustomer} />} />
        <Route path="customer360" element={<Customer360 selectedCustomer={selectedCustomer} />} />
        <Route path="orchestration" element={<AgentOrchestration />} />
        <Route path="*" element={<PlaceholderPage label="Page Not Found" />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}
