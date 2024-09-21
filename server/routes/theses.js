const { Router } = require('express');
const router = Router();
const ThesisCollection = require('../src/thesisdb'); 

// Endpoint to get all theses
router.get('/api/theses', async (req, res) => {
  try {
    const theses = await ThesisCollection.find({ deleted: { $ne: true } }); // Filter out deleted theses
    res.json(theses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;