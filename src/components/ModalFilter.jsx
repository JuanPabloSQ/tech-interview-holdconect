import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = import.meta.env.VITE_API_URL;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '400px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  [`@media (max-width: 600px)`]: {
    width: '95%',
    p: 2,
  },
};

const ModalFilter = ({ open, handleClose, applyFilters }) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const { errorSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/regions`);
        setRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
        errorSnackbar('Error.');
      }
    };

    fetchRegions();
  }, []);

  const fetchProvinces = async (regionId) => {
    try {
      const response = await axios.get(`${API_URL}/provinces`);
      const filteredProvinces = response.data.filter(province => province.region_id === regionId);
      setProvinces(filteredProvinces);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      errorSnackbar('Error.');
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const response = await axios.get(`${API_URL}/cities`);
      const filteredCities = response.data.filter(city => city.province_id === provinceId);
      setCities(filteredCities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      errorSnackbar('Error.');
    }
  };

  const fetchStreets = async (cityId) => {
    try {
      const response = await axios.get(`${API_URL}/streets`);
      const filteredStreets = response.data.filter(street => street.city_id === cityId);
      setStreets(filteredStreets);
    } catch (error) {
      console.error('Error fetching streets:', error);
      errorSnackbar('Error.');
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
    setSelectedStreet(event.target.value);
  };

  const handleApplyFilters = () => {
    applyFilters({
      region: selectedRegion,
      province: selectedProvince,
      city: selectedCity,
      street: selectedStreet,
    });
    handleClose();
  };

  const handleResetFilters = () => {
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedStreet('');
    applyFilters({
      region: '',
      province: '',
      city: '',
      street: '',
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
          Filtrar por ubicación
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Región</InputLabel>
          <Select
            value={selectedRegion}
            onChange={handleRegionChange}
            label="Región"
          >
            {regions.map((region) => (
              <MenuItem key={region.id} value={region.id}>
                {region.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedRegion}>
          <InputLabel>Provincia</InputLabel>
          <Select
            value={selectedProvince}
            onChange={handleProvinceChange}
            label="Provincia"
          >
            {provinces.map((province) => (
              <MenuItem key={province.id} value={province.id}>
                {province.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedProvince}>
          <InputLabel>Ciudad</InputLabel>
          <Select
            value={selectedCity}
            onChange={handleCityChange}
            label="Ciudad"
          >
            {cities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2 }} disabled={!selectedCity}>
          <InputLabel>Calle</InputLabel>
          <Select
            value={selectedStreet}
            onChange={handleStreetChange}
            label="Calle"
          >
            {streets.map((street) => (
              <MenuItem key={street.id} value={street.id}>
                {street.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handleApplyFilters}>
            Aplicar
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResetFilters}>
            Reiniciar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalFilter;
