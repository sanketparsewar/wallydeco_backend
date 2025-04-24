const City = require('../models/city');

exports.addCity = async (req, res) => {
    try {
      let { cityName, state } = req.body;
  
      if (!cityName || !state) {
        return res.status(400).json({ message: 'City Name and state are required' });
      }
  
      // Format city cityName: Capitalize first letter
      cityName=cityName.trim();
      cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();
      // Format state: All uppercase
      state = state.trim();
      state = state.toUpperCase();
  
      const existingCity = await City.findOne({ cityName });
      if (existingCity) {
        return res.status(400).json({ message: 'City already exists' });
      }
  
      const city = new City({ cityName, state });
      const savedCity = await city.save();
      res.status(201).json(savedCity);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };
  
// Get all cities
exports.getAllCities = async (req, res) => {
    try {
        const cities = await City.find().sort({ cityName: 1 });
        res.status(200).json({cities});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
// Get a city by ID
exports.getCityById = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json(city);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
// Update a city
exports.updateCity = async (req, res) => {
    try {
        const city = await City.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json(city);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
}
// Delete a city
exports.deleteCity = async (req, res) => {
    try {
        const city = await City.findByIdAndDelete(req.params.id);
        if (!city) return res.status(404).json({ message: 'City not found' });
        res.status(200).json({ message: 'City deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get cities by state
exports.getCitiesByState = async (req, res) => {
    try {
        const cities = await City.find({ state: req.params.state });
        if (!cities || cities.length === 0) return res.status(404).json({ message: 'No cities found for this state' });
        res.status(200).json(cities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}