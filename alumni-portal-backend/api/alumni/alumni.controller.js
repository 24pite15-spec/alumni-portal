const AlumniService = require('../../service/AlumniService');

module.exports = {
  list: async (req, res) => {
    try {
      const { year, role, location, name } = req.query;
      const filters = {};
      if (year) filters.year = year;
      if (role) filters.role = role;
      if (location) filters.location = location;
      if (name) filters.name = name;

      const alumni = await AlumniService.getAll(filters);
      return res.status(200).json({ success: true, data: alumni });
    } catch (error) {
      console.error('Error fetching alumni list:', error);
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, message: 'User ID required' });
      }
      const user = await AlumniService.getById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Alumni not found' });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching alumni by id:', error);
      return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
  },
};
