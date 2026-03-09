import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';

export default function BillingManagement({ service }) {
  const [billingRecords, setBillingRecords] = useState([]);
  const [serviceDefinitions, setServiceDefinitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    short_description: '',
    description: '',
    consumer: '',
    priority: '3',
    service_definition: ''
  });

  useEffect(() => {
    loadData();
  }, [service]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [billingData, servicesData] = await Promise.all([
        service.getBillingRecords(),
        service.getServiceDefinitions('billing')
      ]);
      
      setBillingRecords(billingData.result || []);
      setServiceDefinitions(servicesData.result || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      setLoading(true);
      await service.createBillingTask(formData);
      
      // Reset form and close dialog
      setFormData({
        short_description: '',
        description: '',
        consumer: '',
        priority: '3',
        service_definition: ''
      });
      setCreateDialogOpen(false);
      
      // Reload data
      await loadData();
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFormChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case '1': return 'error';
      case '2': return 'warning';
      case '3': return 'info';
      case '4': return 'success';
      default: return 'default';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case '1': return 'Critical';
      case '2': return 'High';
      case '3': return 'Moderate';
      case '4': return 'Low';
      default: return 'Unknown';
    }
  };

  if (loading && billingRecords.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Billing $[AMP] Payment Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadData}
            disabled={loading}
            sx={{ mr: 2 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
          >
            New Billing Task
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Task Number</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Consumer</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billingRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No billing tasks found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              billingRecords.map((record) => (
                <TableRow key={record.sys_id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {record.number}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {record.short_description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {record.consumer}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPriorityLabel(record.priority)}
                      size="small"
                      color={getPriorityColor(record.priority)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.state}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {record.sys_created_on}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Task Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Billing Task</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                value={formData.short_description}
                onChange={handleFormChange('short_description')}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={handleFormChange('description')}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Consumer"
                value={formData.consumer}
                onChange={handleFormChange('consumer')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={handleFormChange('priority')}
                  label="Priority"
                >
                  <MenuItem value="1">Critical</MenuItem>
                  <MenuItem value="2">High</MenuItem>
                  <MenuItem value="3">Moderate</MenuItem>
                  <MenuItem value="4">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Service Definition</InputLabel>
                <Select
                  value={formData.service_definition}
                  onChange={handleFormChange('service_definition')}
                  label="Service Definition"
                >
                  {serviceDefinitions.map((service) => (
                    <MenuItem key={service.sys_id} value={service.sys_id}>
                      {service.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateTask}
            variant="contained"
            disabled={!formData.short_description.trim()}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}