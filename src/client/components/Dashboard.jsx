import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import {
    Assignment as TaskIcon,
    Payment as BillingIcon,
    Policy as PolicyIcon,
    TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { display, value } from '../utils/fields.js';

const PRIORITY = {
    '1': { label: 'Critical', color: 'error' },
    '2': { label: 'High',     color: 'warning' },
    '3': { label: 'Moderate', color: 'info' },
    '4': { label: 'Low',      color: 'success' },
};

function KpiCard({ icon, label, count, accentColor, onClick }) {
    const content = (
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2.5 }}>
            <Box sx={{
                width: 52, height: 52, borderRadius: 2, flexShrink: 0,
                bgcolor: `${accentColor}.light`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {React.cloneElement(icon, { sx: { color: `${accentColor}.dark`, fontSize: 28 } })}
            </Box>
            <Box>
                <Typography variant="h4" fontWeight={700} lineHeight={1}>{count}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.5}>{label}</Typography>
            </Box>
        </CardContent>
    );

    return (
        <Card sx={{ borderLeft: 4, borderColor: `${accentColor}.main`, height: '100%' }}>
            {onClick
                ? <CardActionArea onClick={onClick} sx={{ height: '100%' }}>{content}</CardActionArea>
                : content
            }
        </Card>
    );
}

export default function Dashboard({ service, onNavigate }) {
    const [policies, setPolicies] = useState([]);
    const [billing,  setBilling]  = useState([]);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);

    useEffect(() => { loadData(); }, [service]);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [polRes, billRes] = await Promise.all([
                service.getPolicies({}, 20, 0),
                service.getBillingRecords({}, 20, 0),
            ]);
            setPolicies(polRes.result ?? []);
            setBilling(billRes.result ?? []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Failed to load dashboard: {error}</Alert>;
    }

    // Combine and sort most recent first
    const recent = [
        ...policies.slice(0, 5).map((r) => ({ ...r, _type: 'Policy' })),
        ...billing.slice(0, 5).map((r) =>  ({ ...r, _type: 'Billing' })),
    ].sort((a, b) =>
        String(b.sys_created_on ?? '').localeCompare(String(a.sys_created_on ?? ''))
    );

    return (
        <Box>
            <Typography variant="h5" mb={3}>Dashboard</Typography>

            {/* KPI Cards */}
            <Grid container spacing={2.5} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        icon={<PolicyIcon />} label="Policy Tasks"
                        count={policies.length} accentColor="primary"
                        onClick={() => onNavigate?.('policy')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        icon={<BillingIcon />} label="Billing Tasks"
                        count={billing.length} accentColor="secondary"
                        onClick={() => onNavigate?.('billing')}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        icon={<TaskIcon />} label="Total Tasks"
                        count={policies.length + billing.length} accentColor="success"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <KpiCard
                        icon={<TrendingIcon />} label="Completion Rate"
                        count="85%" accentColor="warning"
                    />
                </Grid>
            </Grid>

            {/* Recent Activity */}
            <Typography variant="h6" mb={1.5}>Recent Activity</Typography>
            <Paper variant="outlined">
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Task #</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Priority</TableCell>
                                <TableCell>State</TableCell>
                                <TableCell>Created</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {recent.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No recent activity
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                recent.map((row, idx) => {
                                    const v      = value(row.priority);
                                    const priCfg = PRIORITY[v] ?? { label: v || '—', color: 'default' };
                                    return (
                                        <TableRow key={row.sys_id ?? idx} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {display(row.number)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row._type} size="small" variant="outlined"
                                                    color={row._type === 'Policy' ? 'primary' : 'secondary'}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {display(row.short_description)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={priCfg.label} size="small" color={priCfg.color} />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={display(row.state) || '—'}
                                                    size="small" variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="caption" color="text.secondary">
                                                    {display(row.sys_created_on)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Quick navigation */}
            <Box mt={3} display="flex" gap={1.5}>
                <Button variant="outlined" size="small" startIcon={<PolicyIcon />}
                    onClick={() => onNavigate?.('policy')}>
                    View Policy Tasks
                </Button>
                <Button variant="outlined" size="small" startIcon={<BillingIcon />}
                    onClick={() => onNavigate?.('billing')}>
                    View Billing Tasks
                </Button>
            </Box>
        </Box>
    );
}
