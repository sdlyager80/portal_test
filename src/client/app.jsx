import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';

import Dashboard        from './components/Dashboard.jsx';
import PolicyServicing  from './components/PolicyServicing.jsx';
import BillingManagement from './components/BillingManagement.jsx';
import { InsuranceService } from './services/InsuranceService.js';

const theme = createTheme({
  palette: {
    primary:    { main: '#1B1F3A' },
    secondary:  { main: '#00AEEF' },
    background: { default: '#f4f5f7' },
  },
});

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const service = useMemo(() => new InsuranceService(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Smart Studio Workspace — FSO Insurance Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {currentView === 'dashboard' && (
          <Dashboard service={service} onNavigate={setCurrentView} />
        )}
        {currentView === 'policy' && (
          <PolicyServicing service={service} />
        )}
        {currentView === 'billing' && (
          <BillingManagement service={service} />
        )}
      </Box>
    </ThemeProvider>
  );
}
