const express = require('express');
const router = express.Router();
const { addCity, getAllCities, getCityById, getCitiesByState, updateCity, deleteCity } = require('../controllers/city.controller');

router.post('/', addCity);
router.get('/', getAllCities);
router.get('/:id', getCityById);
router.put('/:id', updateCity);
router.delete('/:id', deleteCity);
router.get('/state/:state', getCitiesByState);

module.exports = router;