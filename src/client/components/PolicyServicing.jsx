import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import TaskTable from './TaskTable.jsx';
import { display, value } from '../utils/fields.js';

// Priority config — single source of truth
const PRIORITY = {
  '1': { label: 'Critical', color: 'error' },
  '2': { label: 'High',     color: 'warning' },
  '3': { label: 'Moderate', color: 'info' },
  '4': { label: 'Low',      color: 'success' },
};

const COLUMNS = [
  { field: 'number',            headerName: 'Task #',       valueGetter: (r) => display(r.number) },
  { field: 'short_description', headerName: 'Description',  valueGetter: (r) => display(r.short_description) },
  { field: 'consumer',          headerName: 'Consumer',     valueGetter: (r) => display(r.consumer) },
  {
    field: 'priority',
    headerName: 'Priority',
    renderCell: (r) => {
      const v = value(r.priority);
      const cfg = PRIORITY[v] ?? { label: v || '—', color: 'default' };
      return <Chip label={cfg.label} size="small" color={cfg.color} />;
    },
  },
  {
    field: 'state',
    headerName: 'State',
    renderCell: (r) => <Chip label={display(r.state) || '—'} size="small" variant="outlined" />,
  },
  { field: 'assigned_to',    headerName: 'Assigned To', valueGetter: (r) => display(r.assigned_to) },
  { field: 'sys_created_on', headerName: 'Created',     valueGetter: (r) => display(r.sys_created_on) },
];

const POLICY_TASK_TYPES = [
  'Beneficiary Change',
  'Address Change',
  'Owner Change',
  'Returned Mail',
];

const EMPTY_FORM = {
  task_type: '',
  short_description: '',
  description: '',
  consumer: '',
  priority: '3',
  service_definition: '',
};

export default function PolicyServicing({ service }) {
  const [policies,           setPolicies]           = useState([]);
  const [serviceDefinitions, setServiceDefinitions] = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [error,              setError]              = useState(null);
  const [dialogOpen,         setDialogOpen]         = useState(false);
  const [formData,           setFormData]           = useState(EMPTY_FORM);
  const [submitting,         setSubmitting]         = useState(false);

  useEffect(() => { loadData(); }, [service]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [policiesRes, servicesRes] = await Promise.all([
        service.getPolicies(),
        service.getServiceDefinitions('policy'),
      ]);
      setPolicies(policiesRes.result ?? []);
      setServiceDefinitions(servicesRes.result ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await service.createPolicyTask(formData);
      setFormData(EMPTY_FORM);
      setDialogOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const setTaskType = (e) => {
    const type = e.target.value;
    setFormData((prev) => ({
      ...prev,
      task_type: type,
      short_description: type,
    }));
  };

  return (
    <Box>
      <TaskTable
        title="Policy Servicing"
        rows={policies}
        columns={COLUMNS}
        loading={loading}
        error={error}
        onRefresh={loadData}
        onCreateClick={() => setDialogOpen(true)}
        createLabel="New Servicing Request"
        searchPlaceholder="Search policy tasks…"
        emptyMessage="No policy servicing tasks found"
      />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Policy Servicing Request</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Task Type</InputLabel>
                <Select value={formData.task_type} onChange={setTaskType} label="Task Type">
                  {POLICY_TASK_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth required
                label="Short Description"
                value={formData.short_description}
                onChange={setField('short_description')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth multiline rows={3}
                label="Description"
                value={formData.description}
                onChange={setField('description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Consumer"
                value={formData.consumer}
                onChange={setField('consumer')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={formData.priority} onChange={setField('priority')} label="Priority">
                  {Object.entries(PRIORITY).map(([v, cfg]) => (
                    <MenuItem key={v} value={v}>{cfg.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Service Definition</InputLabel>
                <Select
                  value={formData.service_definition}
                  onChange={setField('service_definition')}
                  label="Service Definition"
                >
                  {serviceDefinitions.map((sd) => (
                    <MenuItem key={sd.sys_id} value={sd.sys_id}>{sd.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.task_type || !formData.short_description.trim() || submitting}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
