/**
 * FSO Insurance Portal — Smart Studio Workspace
 *
 * ServiceNow SDK constraints observed here:
 *   • No CSS modules; only a minimal app.css reset + MUI sx props
 *   • No React Router; navigation is state-driven
 *   • window.g_ck is the ServiceNow CSRF token (used by InsuranceService)
 *   • No Vite / webpack — built by now-sdk
 */
import React, { useState, useMemo } from 'react';
import './App.css';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ThemeProvider,
    Toolbar,
    Tooltip,
    Typography,
    createTheme,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Menu as MenuIcon,
    Payment as PaymentIcon,
    Policy as PolicyIcon,
} from '@mui/icons-material';

import Dashboard        from './components/Dashboard.jsx';
import PolicyServicing  from './components/PolicyServicing.jsx';
import BillingManagement from './components/BillingManagement.jsx';
import { InsuranceService } from './services/InsuranceService.js';

// ── Theme ──────────────────────────────────────────────────────────────────────
const theme = createTheme({
    palette: {
        primary:    { main: '#1B1F3A', contrastText: '#ffffff' },
        secondary:  { main: '#00AEEF', contrastText: '#ffffff' },
        background: { default: '#f4f5f7', paper: '#ffffff' },
    },
    shape: { borderRadius: 8 },
    typography: {
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    components: {
        MuiAppBar: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: { borderBottom: '1px solid rgba(255,255,255,0.15)' },
            },
        },
        MuiCard:  { defaultProps: { elevation: 0 }, styleOverrides: { root: { border: '1px solid #e0e0e0' } } },
        MuiPaper: { defaultProps: { elevation: 0 } },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        backgroundColor: '#fafafa',
                        borderBottom: '2px solid #e0e0e0',
                    },
                },
            },
        },
    },
});

// ── Navigation config ──────────────────────────────────────────────────────────
const NAV = [
    { id: 'dashboard', label: 'Dashboard',       icon: <DashboardIcon /> },
    { id: 'policy',    label: 'Policy Servicing', icon: <PolicyIcon /> },
    { id: 'billing',   label: 'Billing & Payment', icon: <PaymentIcon /> },
];

const DRAWER_OPEN     = 240;
const DRAWER_CLOSED   = 64;

// ── App ────────────────────────────────────────────────────────────────────────
export default function App() {
    const [view,  setView]  = useState('dashboard');
    const [open,  setOpen]  = useState(true);
    const service           = useMemo(() => new InsuranceService(), []);
    const drawerWidth       = open ? DRAWER_OPEN : DRAWER_CLOSED;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />

            <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

                {/* ── AppBar ── */}
                <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={() => setOpen((v) => !v)}
                            sx={{ mr: 2 }}
                            aria-label="toggle navigation"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{ flexGrow: 1, letterSpacing: 0.3 }}>
                            Smart Studio Workspace
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.75 }}>
                            FSO Insurance Portal
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* ── Left drawer ── */}
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            overflowX: 'hidden',
                            mt: '64px',
                            borderRight: '1px solid #e0e0e0',
                            transition: (t) =>
                                t.transitions.create('width', {
                                    easing:   t.transitions.easing.sharp,
                                    duration: open
                                        ? t.transitions.duration.enteringScreen
                                        : t.transitions.duration.leavingScreen,
                                }),
                        },
                    }}
                >
                    <List sx={{ pt: 1 }} disablePadding>
                        {NAV.map((item) => (
                            <Tooltip key={item.id} title={open ? '' : item.label} placement="right">
                                <ListItemButton
                                    selected={view === item.id}
                                    onClick={() => setView(item.id)}
                                    sx={{
                                        mx: 1, my: 0.5, borderRadius: 1.5,
                                        minHeight: 44, px: 1.5,
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main',
                                            color: 'primary.contrastText',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                            '& .MuiListItemIcon-root': { color: 'inherit' },
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    {open && (
                                        <ListItemText
                                            primary={item.label}
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                        ))}
                    </List>
                </Drawer>

                {/* ── Main content ── */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        mt: '64px',
                        p: 3,
                        overflow: 'auto',
                    }}
                >
                    {view === 'dashboard' && (
                        <Dashboard service={service} onNavigate={setView} />
                    )}
                    {view === 'policy' && (
                        <PolicyServicing service={service} />
                    )}
                    {view === 'billing' && (
                        <BillingManagement service={service} />
                    )}
                </Box>

            </Box>
        </ThemeProvider>
    );
}
