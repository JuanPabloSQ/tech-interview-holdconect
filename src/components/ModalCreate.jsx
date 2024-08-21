import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import data from '../example'; 

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

const getRegions = (data) => [...new Set(data.map(item => item.region))];

const getProvinces = (data, region) => {
  return [...new Set(data.filter(item => item.region === region).map(item => item.province))];
};

const getCities = (data, province) => {
  return [...new Set(data.filter(item => item.province === province).map(item => item.city))];
};

const ModalCreate = ({ open, handleClose, addNewStreet }) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [newStreet, setNewStreet] = useState('');

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

  const handleAddNewStreet = () => {
    if (selectedRegion && selectedProvince && selectedCity && newStreet) {
      addNewStreet({
        id: data.length + 1, 
        street: newStreet,
        region: selectedRegion,
        province: selectedProvince,
        city: selectedCity,
      });
      handleClose();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  const handleResetFields = () => {
    setSelectedRegion('');
    setSelectedProvince('');
    setSelectedCity('');
    setNewStreet('');
  };

  const regions = getRegions(data);
  const provinces = selectedRegion ? getProvinces(data, selectedRegion) : [];
  const cities = selectedProvince ? getCities(data, selectedProvince) : [];

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
            {regions.map((region, index) => (
              <MenuItem key={index} value={region}>
                {region}
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
            {provinces.map((province, index) => (
              <MenuItem key={index} value={province}>
                {province}
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
            {cities.map((city, index) => (
              <MenuItem key={index} value={city}>
                {city}
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
            Agregar Calle
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
