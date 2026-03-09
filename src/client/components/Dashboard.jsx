import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  Policy as PolicyIcon,
  Payment as BillingIcon,
  TrendingUp as TrendingIcon,
  Assignment as TaskIcon
} from '@mui/icons-material';

export default function Dashboard({ service }) {
  const [stats, setStats] = useState({
    policies: { total: 0, recent: [] },
    billing: { total: 0, recent: [] },
    loading: true,
    error: null
  });

  useEffect(() => {
    loadDashboardData();
  }, [service]);

  const loadDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));
      
      const [policiesData, billingData] = await Promise.all([
        service.getPolicies({}, 10, 0),
        service.getBillingRecords({}, 10, 0)
      ]);

      setStats({
        policies: {
          total: policiesData.result.length,
          recent: policiesData.result.slice(0, 5)
        },
        billing: {
          total: billingData.result.length,
          recent: billingData.result.slice(0, 5)
        },
        loading: false,
        error: null
      });
    } catch (error) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const RecentItemsCard = ({ title, items, icon, emptyMessage }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {emptyMessage}
          </Typography>
        ) : (
          <Box>
            {items.map((item, index) => (
              <Box 
                key={item.sys_id} 
                sx={{ 
                  py: 1, 
                  borderBottom: index < items.length - 1 ? 1 : 0, 
                  borderColor: 'divider' 
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {item.number}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {item.short_description}
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip 
                    label={item.state} 
                    size="small" 
                    variant="outlined"
                    color={item.state_value === '1' ? 'info' : 'default'}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (stats.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (stats.error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load dashboard data: {stats.error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      
      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PolicyIcon />}
            title="Policy Tasks"
            value={stats.policies.total}
            color="primary"
            subtitle="Active policy administration tasks"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<BillingIcon />}
            title="Billing Tasks"
            value={stats.billing.total}
            color="secondary"
            subtitle="Active billing and payment tasks"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TaskIcon />}
            title="Total Tasks"
            value={stats.policies.total + stats.billing.total}
            color="success"
            subtitle="All active tasks"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingIcon />}
            title="Completion Rate"
            value="85%"
            color="warning"
            subtitle="Average task completion rate"
          />
        </Grid>

        {/* Recent Items */}
        <Grid item xs={12} md={6}>
          <RecentItemsCard
            title="Recent Policy Tasks"
            items={stats.policies.recent}
            icon={<PolicyIcon color="primary" />}
            emptyMessage="No recent policy tasks found"
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <RecentItemsCard
            title="Recent Billing Tasks"
            items={stats.billing.recent}
            icon={<BillingIcon color="secondary" />}
            emptyMessage="No recent billing tasks found"
          />
        </Grid>
      </Grid>
    </Box>
  );
}