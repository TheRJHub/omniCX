import { useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Tooltip,
  useTheme,
  IconButton,
} from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../Context/AuthContext';
import { useThemeMode } from '../Context/ThemeContext';
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';

const NAV_ITEMS = [
  { id: 'agentic', label: 'Agentic Operations', icon: <GridViewRoundedIcon fontSize="small" /> },
  { id: 'journey', label: 'Customer Journey', icon: <RouteRoundedIcon fontSize="small" /> },
  { id: 'performance', label: 'Channel Performance', icon: <BarChartRoundedIcon fontSize="small" /> },
  { id: 'tickets', label: 'Accelr8cx Tickets', icon: <ConfirmationNumberRoundedIcon fontSize="small" /> },
  { id: 'customer360', label: 'Customer 360', icon: <PeopleOutlineRoundedIcon fontSize="small" /> },
  { id: 'orchestration', label: 'Agent Orchestration', icon: <AccountTreeRoundedIcon fontSize="small" /> },
];

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED = 64;

export default function Sidebar({ activeNav, onNavChange, collapsed, onToggleCollapse }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useThemeMode();

  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (collapsed) {
      if (onToggleCollapse) onToggleCollapse();
    } else {
      sessionStorage.removeItem('ticketPage');
      sessionStorage.removeItem('ticketSearch');
      onNavChange('tickets');
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        width,
        minWidth: width,
        flexShrink: 0,
        bgcolor: '#0d1117',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
      }}
    >
      {/* Header with Logo and Toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 1.5,
          px: collapsed ? 1.5 : 2.5,
          py: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            cursor: 'pointer',
            '&:hover': collapsed ? { '& .logo-box': { bgcolor: '#2563eb' } } : {},
          }}
          onClick={handleLogoClick}
        >
          <Box
            className="logo-box"
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background-color 0.2s',
            }}
          >
            <ShowChartRoundedIcon sx={{ color: '#fff', fontSize: 18 }} />
          </Box>
          {!collapsed && (
            <Typography
              variant="subtitle1"
              sx={{
                color: '#fff',
                fontWeight: 700,
                fontSize: '19px',
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
              }}
            >
              OmniCX AI
            </Typography>
          )}
        </Box>

        {!collapsed && (
          <IconButton
            size="small"
            onClick={onToggleCollapse}
            sx={{
              color: '#94a3b8',
              bgcolor: 'rgba(255,255,255,0.04)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' },
              width: 24,
              height: 24,
            }}
          >
            <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>

      {/* Nav Items */}
      <List sx={{ px: collapsed ? 1 : 1.5, py: 1.5, flexGrow: 1 }} disablePadding>
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.id;
          const btn = (
            <ListItemButton
              key={item.id}
              onClick={() => onNavChange(item.id)}
              sx={{
                borderRadius: '8px',
                mb: 0.5,
                px: collapsed ? 1.5 : 1.5,
                py: 1,
                minHeight: 40,
                bgcolor: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                '&:hover': {
                  bgcolor: isActive
                    ? 'rgba(59,130,246,0.2)'
                    : 'rgba(255,255,255,0.05)',
                },
                position: 'relative',
                '&::before': isActive
                  ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    height: '60%',
                    width: '3px',
                    borderRadius: '0 3px 3px 0',
                    bgcolor: '#3b82f6',
                  }
                  : {},
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? '#3b82f6' : '#94a3b8',
                  minWidth: collapsed ? 0 : 36,
                  mr: collapsed ? 0 : 0,
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '14.5px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#fff' : '#f8fafc',
                    whiteSpace: 'nowrap',
                  }}
                />
              )}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip key={item.id} title={item.label} placement="right">
              {btn}
            </Tooltip>
          ) : (
            btn
          );
        })}
      </List>

      {/* Theme Toggle */}
      <List sx={{ px: collapsed ? 1 : 1.5, pb: 0 }} disablePadding>
        {collapsed ? (
          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"} placement="right">
            <ListItemButton
              onClick={toggleTheme}
              sx={{
                borderRadius: '8px',
                px: 1.5,
                py: 1,
                mb: 0.5,
                minHeight: 40,
                justifyContent: 'center',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ color: '#94a3b8', minWidth: 0 }}>
                {isDarkMode ? <LightModeRounded fontSize="small" /> : <DarkModeRounded fontSize="small" />}
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              borderRadius: '8px',
              px: 1.5,
              py: 1,
              mb: 0.5,
              minHeight: 40,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            <ListItemIcon sx={{ color: '#94a3b8', minWidth: 36 }}>
              {isDarkMode ? <LightModeRounded fontSize="small" /> : <DarkModeRounded fontSize="small" />}
            </ListItemIcon>
            <ListItemText
              primary={isDarkMode ? "Light Mode" : "Dark Mode"}
              primaryTypographyProps={{ fontSize: '14.5px', color: '#f8fafc' }}
            />
          </ListItemButton>
        )}
      </List>

      {/* Logout */}
      <List sx={{ px: collapsed ? 1 : 1.5, pb: 1 }} disablePadding>
        {collapsed ? (
          <Tooltip title="Logout" placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '8px',
                px: 1.5,
                py: 1,
                minHeight: 40,
                justifyContent: 'center',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
              }}
            >
              <ListItemIcon sx={{ color: '#6b7280', minWidth: 0 }}>
                <LogoutRoundedIcon fontSize="small" />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: '8px',
              px: 1.5,
              py: 1,
              minHeight: 40,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
            }}
          >
            <ListItemIcon sx={{ color: '#6b7280', minWidth: 36 }}>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ fontSize: '14.5px', color: '#f8fafc' }}
            />
          </ListItemButton>
        )}
      </List>

      {/* User Profile */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: collapsed ? 1.5 : 2,
          py: 2,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        {collapsed ? (
          <Tooltip title={`${user?.name || 'User'} · ${user?.role || 'Role'}`} placement="right">
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#1d4ed8',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
                cursor: 'pointer',
              }}
            >
              {user?.avatar || 'U'}
            </Avatar>
          </Tooltip>
        ) : (
          <>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: '#1d4ed8',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user?.avatar || 'U'}
            </Avatar>
            <Box sx={{ overflow: "hidden" }}>
              <Typography sx={{ color: '#fff', fontSize: '13px', fontWeight: 600, lineHeight: 1.3 }} noWrap>
                {user?.name || 'Jane Doe'}
              </Typography>
              <Typography sx={{ color: '#6b7280', fontSize: '11px' }} noWrap>
                {user?.role || 'CX Manager'}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
