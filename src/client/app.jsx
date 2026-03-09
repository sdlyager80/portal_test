import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  CssBaseline,
  Grid,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from '@mui/material';

// Simple theme
const theme = createTheme({
  palette: {
    primary: { main: '#1B1F3A' },
    secondary: { main: '#00AEEF' },
    background: { default: '#f4f5f7' },
  },
});

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Smart Studio Workspace - FSO Insurance Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View your insurance dashboard and recent activity
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => setCurrentView('dashboard')}
                >
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Policy Servicing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage and service insurance policies
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => setCurrentView('policy')}
                >
                  Manage Policies
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Billing & Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Handle billing tasks and payment processing
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => setCurrentView('billing')}
                >
                  Billing Tasks
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Current View: {currentView}
          </Typography>
          
          {currentView === 'dashboard' && (
            <Box>
              <Typography variant="body1">
                Welcome to your insurance dashboard. Here you can view recent activity, 
                pending tasks, and quick access to common functions.
              </Typography>
            </Box>
          )}

          {currentView === 'policy' && (
            <Box>
              <Typography variant="body1">
                Policy servicing section. Manage insurance policies, renewals, 
                and policy-related tasks.
              </Typography>
            </Box>
          )}

          {currentView === 'billing' && (
            <Box>
              <Typography variant="body1">
                Billing and payment management. Process payments, handle billing inquiries, 
                and manage payment schedules.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}