import { useState, useEffect } from 'react';
import Collapse from '@mui/material/Collapse';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = import.meta.env.VITE_API_URL;

const AdvancedFilter = ({ filtersOpen, applyFilters }) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [streets, setStreets] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const { errorSnackbar } = useSnackbar();

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
  }, []);

  return (
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
  );
};

export default AdvancedFilter;
