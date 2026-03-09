import React, { useState, useMemo } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  Policy as PolicyIcon,
  Payment as BillingIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

import Dashboard from './components/Dashboard.jsx';
import PolicyServicing from './components/PolicyServicing.jsx';
import BillingManagement from './components/BillingManagement.jsx';
import { InsuranceService } from './services/InsuranceService.js';
import './app.css';

// Material-UI theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`portal-tabpanel-${index}`}
      aria-labelledby={`portal-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const insuranceService = useMemo(() => new InsuranceService(), []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <AppBar position="static" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FSO Insurance Portal
            </Typography>
            <Typography variant="subtitle1" sx={{ mr: 2 }}>
              Smart Studio Workspace
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ mt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={currentTab} 
              onChange={handleTabChange}
              aria-label="Insurance Portal Tabs"
            >
              <Tab 
                icon={<DashboardIcon />} 
                label="Dashboard" 
                id="portal-tab-0"
                aria-controls="portal-tabpanel-0"
              />
              <Tab 
                icon={<PolicyIcon />} 
                label="Policy Servicing" 
                id="portal-tab-1"
                aria-controls="portal-tabpanel-1"
              />
              <Tab 
                icon={<BillingIcon />} 
                label="Billing $[AMP] Payment" 
                id="portal-tab-2"
                aria-controls="portal-tabpanel-2"
              />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Dashboard service={insuranceService} />
          </TabPanel>
          
          <TabPanel value={currentTab} index={1}>
            <PolicyServicing service={insuranceService} />
          </TabPanel>
          
          <TabPanel value={currentTab} index={2}>
            <BillingManagement service={insuranceService} />
          </TabPanel>
        </Container>
      </div>
    </ThemeProvider>
  );
}