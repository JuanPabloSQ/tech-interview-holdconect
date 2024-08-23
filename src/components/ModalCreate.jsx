import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useSnackbar } from '../context/SnackbarContext';

const API_URL = import.meta.env.VITE_API_URL;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const ModalCreate = ({ open, handleClose, addNewStreet }) => {
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const { errorSnackbar, successSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get(`${API_URL}/regions`);
        setRegions(response.data);
      } catch (error) {
        console.error('Error fetching regions:', error);
      }
    };

    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchProvinces = async () => {
      if (selectedRegion) {
        try {
          console.log(`Fetching provinces for region_id=${selectedRegion}`);
          const response = await axios.get(`${API_URL}/provinces`);
          const filteredProvinces = response.data.filter(province => province.region_id === selectedRegion);
          console.log('Filtered Provinces:', filteredProvinces);
          setProvinces(filteredProvinces);
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      } else {
        setProvinces([]);
      }
    };

    fetchProvinces();
  }, [selectedRegion]);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedProvince) {
        try {
          console.log(`Fetching cities for province_id=${selectedProvince}`);
          const response = await axios.get(`${API_URL}/cities`);
          const filteredCities = response.data.filter(city => city.province_id === selectedProvince);
          console.log('Filtered Cities:', filteredCities);
          setCities(filteredCities);
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      } else {
        setCities([]);
      }
    };

    fetchCities();
  }, [selectedProvince]);

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setSelectedProvince('');
    setSelectedCity('');
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
    setSelectedCity('');
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const handleStreetChange = (event) => {
    setNewStreet(event.target.value);
  };

  const handleAddNewStreet = async () => {
    if (selectedCity && newStreet) {
      const newStreetData = {
        name: newStreet,
        city_id: selectedCity,
      };

      try {
        const response = await axios.post(`${API_URL}/streets`, newStreetData);
        addNewStreet({
          id: response.data.id,
          street: newStreet,
          region: regions.find(r => r.id === selectedRegion).name,
          province: provinces.find(p => p.id === selectedProvince).name,
          city: cities.find(c => c.id === selectedCity).name,
        });
        handleClose();
        successSnackbar('Calle creada con exito')
      } catch (error) {
        console.error('Error adding new street:', error);
        errorSnackbar('La evaluación no se pudo enviar, inténtelo nuevamente');
      }
    } else {
      errorSnackbar('Por favor, completa todos los campos.');
    }
  };

  const handleResetFields = () => {
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedCity('');
    setNewStreet('');
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
          Agregar Nueva Calle
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

        <TextField
          fullWidth
          sx={{ mt: 2 }}
          label="Calle"
          variant="outlined"
          value={newStreet}
          onChange={handleStreetChange}
        />

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handleAddNewStreet}>
            Agregar
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleResetFields}>
            Reiniciar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalCreate;
