import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
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
import ModalFilter from './ModalFilter';
import ModalCreate from './ModalCreate';

const API_URL = import.meta.env.VITE_API_URL;

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
            sx={{
              pl: 2,
              width: '200px', 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
            }}
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
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({
    region: '',
    province: '',
    city: '',
    street: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionsResponse, provincesResponse, citiesResponse, streetsResponse] = await Promise.all([
          axios.get(`${API_URL}/regions`),
          axios.get(`${API_URL}/provinces`),
          axios.get(`${API_URL}/cities`),
          axios.get(`${API_URL}/streets`),
        ]);

        const regions = regionsResponse.data;
        const provinces = provincesResponse.data;
        const cities = citiesResponse.data;
        const streets = streetsResponse.data.map(street => {
          const city = cities.find(c => c.id === street.city_id);
          const province = provinces.find(p => p.id === city.province_id);
          const region = regions.find(r => r.id === province.region_id);

          return {
            ...street,
            street: street.name,
            city_id: city.id,
            city: city.name,
            province_id: province.id,
            province: province.name,
            region_id: region.id,
            region: region.name,
          };
        });

        console.log('Fetched Streets:', streets); 

        setAllData(streets);
        setFilteredData(streets); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
    console.log('Applying Filters:', newFilters); 
    setFilters(newFilters);

    const filtered = allData.filter((item) => {
      return (
        (!newFilters.region || item.region_id === parseInt(newFilters.region)) &&
        (!newFilters.province || item.province_id === parseInt(newFilters.province)) &&
        (!newFilters.city || item.city_id === parseInt(newFilters.city)) &&
        (!newFilters.street || item.id === parseInt(newFilters.street)) 
      );
    });

    console.log('Filtered Data:', filtered); 

    setFilteredData(filtered);
  };

  const addNewStreet = (newStreet) => {
    console.log('Adding New Street:', newStreet); 
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
                    sx={{ 
                      pl: 2, 
                      width: '200px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                    }} 
                  >
                    {row.street}
                  </TableCell>
                  <TableCell 
                    align="left"
                    sx={{
                      width: '200px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {row.region}
                  </TableCell>
                  <TableCell 
                    align="left"
                    sx={{ 
                      width: '200px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {row.province}
                  </TableCell>
                  <TableCell 
                    align="left"
                    sx={{ 
                      width: '200px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis' 
                    }}
                  >
                    {row.city}
                  </TableCell>
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
