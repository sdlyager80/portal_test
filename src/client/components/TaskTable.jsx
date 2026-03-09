/**
 * TaskTable — shared reusable table for Policy and Billing views.
 *
 * Props:
 *   title            string
 *   rows             array of ServiceNow record objects
 *   columns          array of { field, headerName, valueGetter?, renderCell? }
 *   loading          boolean
 *   error            string | null
 *   onRefresh        () => void
 *   onCreateClick    () => void  (omit to hide Create button)
 *   createLabel      string
 *   searchPlaceholder string
 *   emptyMessage     string
 */
import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Clear as ClearIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

export default function TaskTable({
  title,
  rows = [],
  columns = [],
  loading = false,
  error = null,
  onRefresh,
  onCreateClick,
  createLabel = 'New Task',
  searchPlaceholder = 'Search…',
  emptyMessage = 'No records found',
}) {
  const [search, setSearch]           = useState('');
  const [page, setPage]               = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Client-side search across all column values
  const filtered = rows.filter((row) =>
    columns.some((col) => {
      const val = col.valueGetter ? col.valueGetter(row) : row[col.field];
      return String(val ?? '').toLowerCase().includes(search.toLowerCase());
    })
  );

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Typography variant="h5">{title}</Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Refresh">
            <span>
              <IconButton size="small" onClick={onRefresh} disabled={loading}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          {onCreateClick && (
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={onCreateClick}>
              {createLabel}
            </Button>
          )}
        </Box>
      </Box>

      {/* Search */}
      <TextField
        size="small"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(0); }}
        sx={{ mb: 2, width: 320 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton size="small" edge="end" onClick={() => { setSearch(''); setPage(0); }}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.field}>{col.headerName}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                    <CircularProgress size={32} />
                  </TableCell>
                </TableRow>
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                    <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((row, idx) => (
                  <TableRow key={row.sys_id ?? idx} hover>
                    {columns.map((col) => (
                      <TableCell key={col.field}>
                        {col.renderCell
                          ? col.renderCell(row)
                          : (
                            <Typography variant="body2">
                              {col.valueGetter ? col.valueGetter(row) : row[col.field]}
                            </Typography>
                          )
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}
