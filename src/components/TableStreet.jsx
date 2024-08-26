import { useState, useEffect, useMemo } from 'react';
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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { visuallyHidden } from '@mui/utils';
import ModalCreate from './ModalCreate';
import LinearProgress from '@mui/material/LinearProgress';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button'; 
import Box from '@mui/material/Box'; 
import { useSnackbar } from '../context/SnackbarContext';

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
  { id: 'name', numeric: false, disablePadding: true, label: 'Calle' },
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
              maxWidth: '100px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              [`@media (max-width: 600px)`]: {
                maxWidth: '50px',
              },
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

const EnhancedTableToolbar = ({ onFilterClick, onCreateClick, searchText, onSearchChange }) => (
  <Toolbar
    sx={{
      pl: { sm: 2 },
      pr: { xs: 1, sm: 1 },
    }}
  >
    <TextField
      variant="outlined"
      size="small"
      placeholder="Buscar"
      value={searchText}
      onChange={onSearchChange}
      sx={{ mr: 2 }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />

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
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const { errorSnackbar } = useSnackbar();

  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      let url = `${API_URL}/streets`;

      if (filters.street_id) {
        url = `${API_URL}/streets/${filters.street_id}`;
      } else if (filters.city_id) {
        url += `?city_id=${filters.city_id}`;
      } else if (filters.province_id) {
        url += `?province_id=${filters.province_id}`;
      } else if (filters.region_id) {
        url += `?region_id=${filters.region_id}`;
      }

      const response = await axios.get(url);
      const streets = Array.isArray(response.data) ? response.data : [response.data];

      setAllData(streets);
      setFilteredData(streets);
    } catch (error) {
      console.error('Error fetching data:', error);
      errorSnackbar('Error en el servidor.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
  };

  const applyFilters = (newFilters) => {
    fetchData(newFilters);
  };

  const addNewStreet = (newStreet) => {
    const newData = [...filteredData, newStreet];
    setFilteredData(newData);
    handleCloseCreateModal();
  };

  const handleToggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  const fetchRegions = async () => {
    try {
      const response = await axios.get(`${API_URL}/regions`);
      setRegions(response.data);
    } catch (error) {
      console.error('Error fetching regions:', error);
      errorSnackbar('Error accediendo a regiones.');
    }
  };

  const fetchProvinces = async (regionId) => {
    try {
      const response = await axios.get(`${API_URL}/provinces`, {
        params: { region_id: regionId },
      });
      setProvinces(response.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      errorSnackbar('Error accediendo a provincias.');
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const response = await axios.get(`${API_URL}/cities`, {
        params: { province_id: provinceId },
      });
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      errorSnackbar('Error accediendo a ciudades.');
    }
  };

  const fetchStreets = async (cityId, streetId = null) => {
    try {
      let url = `${API_URL}/streets`;

      if (streetId) {
        url = `${API_URL}/streets/${streetId}`;
      } else if (cityId) {
        url += `?city_id=${cityId}`;
      }

      const response = await axios.get(url);
      const fetchedStreets = streetId ? [response.data] : response.data;
      setStreets(fetchedStreets);
    } catch (error) {
      console.error('Error fetching calles:', error);
      errorSnackbar('Error accediendo a calles.');
    }
  };

  const handleRegionChange = (event) => {
    const regionId = event.target.value;
    setSelectedRegion(regionId);
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedStreet('');
    setProvinces([]);
    setCities([]);
    setStreets([]);
    fetchProvinces(regionId);
  };

  const handleProvinceChange = (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    setSelectedCity('');
    setSelectedStreet('');
    setCities([]);
    setStreets([]);
    fetchCities(provinceId);
  };

  const handleCityChange = (event) => {
    const cityId = event.target.value;
    setSelectedCity(cityId);
    setSelectedStreet('');
    setStreets([]);
    fetchStreets(cityId);
  };

  const handleStreetChange = (event) => {
    const streetId = event.target.value;
    setSelectedStreet(streetId);
    fetchStreets(null, streetId);
  };

  const handleApplyFilters = () => {
    setPage(0); 
    applyFilters({
      region_id: selectedRegion,
      province_id: selectedProvince,
      city_id: selectedCity,
      street_id: selectedStreet,
    });
  };

  const handleResetFilters = () => {
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedStreet('');
    applyFilters({
      region_id: '',
      province_id: '',
      city_id: '',
      street_id: '',
    });
  };

  useEffect(() => {
    fetchRegions();
    fetchData();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filtered = allData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.region.toLowerCase().includes(searchText.toLowerCase()) ||
          item.province.toLowerCase().includes(searchText.toLowerCase()) ||
          item.city.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(allData);
    }
  }, [searchText, allData]);

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
      <Paper
        sx={{
          width: '100%',
          maxWidth: '1400px',
          mb: 2,
          mx: 'auto',
          [`@media (max-width: 900px)`]: {
            width: '100%',
            maxWidth: '100%',
          },
        }}
      >
        <EnhancedTableToolbar
          onFilterClick={handleToggleFilters}
          onCreateClick={handleOpenCreateModal}
          searchText={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
        />
<Collapse in={filtersOpen}>
  <Box sx={{ p: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
    <FormControl sx={{ width: '15%', minWidth: '100px' }}>
      <InputLabel sx={{ minHeight: '30px', fontSize: '0.875rem' }}>Región</InputLabel>
      <Select
        value={selectedRegion}
        onChange={handleRegionChange}
        label="Región"
        sx={{ minHeight: '20px', fontSize: '0.875rem'}}
      >
        {regions.map((region) => (
          <MenuItem key={region.id} value={region.id}>
            {region.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl sx={{ width: '15%', minWidth: '100px' }} disabled={!selectedRegion}>
      <InputLabel sx={{ minHeight: '30px', fontSize: '0.875rem' }}>Provincia</InputLabel>
      <Select
        value={selectedProvince}
        onChange={handleProvinceChange}
        label="Provincia"
        sx={{ minHeight: '30px', fontSize: '0.875rem' }}
      >
        {provinces.map((province) => (
          <MenuItem key={province.id} value={province.id}>
            {province.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl sx={{ width: '15%', minWidth: '100px' }} disabled={!selectedProvince}>
      <InputLabel sx={{ minHeight: '30px', fontSize: '0.875rem' }}>Ciudad</InputLabel>
      <Select
        value={selectedCity}
        onChange={handleCityChange}
        label="Ciudad"
        sx={{ minHeight: '30px', fontSize: '0.875rem' }}
      >
        {cities.map((city) => (
          <MenuItem key={city.id} value={city.id}>
            {city.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <FormControl sx={{ width: '15%', minWidth: '100px' }} disabled={!selectedCity}>
      <InputLabel sx={{ minHeight: '30px', fontSize: '0.875rem' }}>Calle</InputLabel>
      <Select
        value={selectedStreet}
        onChange={handleStreetChange}
        label="Calle"
        sx={{ minHeight: '30px', fontSize: '0.875rem' }}
      >
        {streets.map((street) => (
          <MenuItem key={street.id} value={street.id}>
            {street.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Button variant="contained" color="primary" onClick={handleApplyFilters}>
        Aplicar
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
        Reiniciar
      </Button>
    </Box>
  </Box>
</Collapse>

        {loading ? (
          <LinearProgress />
        ) : (
          <>
            <TableContainer>
              <Table sx={{ Width: 750 }} aria-labelledby="tableTitle">
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
                          maxWidth: '100px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          [`@media (max-width: 600px)`]: {
                            maxWidth: '50px',
                          },
                        }}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: '100px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          [`@media (max-width: 600px)`]: {
                            maxWidth: '50px',
                          },
                        }}
                      >
                        {row.region}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: '100px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          [`@media (max-width: 600px)`]: {
                            maxWidth: '50px',
                          },
                        }}
                      >
                        {row.province}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          maxWidth: '100px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          [`@media (max-width: 600px)`]: {
                            maxWidth: '50px',
                          },
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
          </>
        )}
      </Paper>

      <ModalCreate
        open={createModalOpen}
        handleClose={handleCloseCreateModal}
        addNewStreet={addNewStreet}
      />
    </>
  );
};

export default TableStreet;
