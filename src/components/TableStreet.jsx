import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import data from '../example';
import ModalFilter from './ModalFilter';
import ModalCreate from './ModalCreate';

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

const headCells = [
  { id: 'street', numeric: false, disablePadding: true, label: 'Calle' },
  { id: 'region', numeric: false, disablePadding: false, label: 'Región' },
  { id: 'province', numeric: false, disablePadding: false, label: 'Provincia' },
  { id: 'city', numeric: false, disablePadding: false, label: 'Ciudad' },
];

const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={headCell.id === 'street' ? { pl: 2 } : {}} 
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span style={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const EnhancedTableToolbar = ({ onFilterClick, onCreateClick }) => (
  <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
    }}
  >
    <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
      Dirección
    </Typography>
    <Tooltip title="Filtrar lista">
      <IconButton onClick={onFilterClick}>
        <FilterListIcon />
      </IconButton>
    </Tooltip>
    <Tooltip title="Agregar nueva calle">
      <IconButton onClick={onCreateClick}>
        <AddIcon />
      </IconButton>
    </Tooltip>
  </Toolbar>
);

const TableStreet = () => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('street');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  const [filters, setFilters] = useState({
    region: '',
    province: '',
    city: '',
    street: '',
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenFilterModal = () => {
    setFilterModalOpen(true);
  };

  const handleCloseFilterModal = () => {
    setFilterModalOpen(false);
  };

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    const filtered = data.filter((item) => {
      return (
        (!newFilters.region || item.region === newFilters.region) &&
        (!newFilters.province || item.province === newFilters.province) &&
        (!newFilters.city || item.city === newFilters.city) &&
        (!newFilters.street || item.street === newFilters.street)
      );
    });
    setFilteredData(filtered);
  };

  const addNewStreet = (newStreet) => {
    const newData = [...filteredData, newStreet];
    setFilteredData(newData);
    handleCloseCreateModal();
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredData.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(filteredData, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredData]
  );

  return (
    <>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar 
          onFilterClick={handleOpenFilterModal} 
          onCreateClick={handleOpenCreateModal} 
        />
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredData.length}
            />
            <TableBody>
              {visibleRows.map((row) => (
                <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: 'pointer' }}>
                  <TableCell 
                    component="th" 
                    scope="row" 
                    padding="none"
                    sx={{ pl: 2 }} 
                  >
                    {row.street}
                  </TableCell>
                  <TableCell align="left">{row.region}</TableCell>
                  <TableCell align="left">{row.province}</TableCell>
                  <TableCell align="left">{row.city}</TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ModalFilter 
        open={filterModalOpen} 
        handleClose={handleCloseFilterModal} 
        applyFilters={applyFilters} 
      />

      <ModalCreate 
        open={createModalOpen} 
        handleClose={handleCloseCreateModal} 
        addNewStreet={addNewStreet} 
      />
    </>
  );
};

export default TableStreet;
