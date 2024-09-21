const { Router } = require('express');
const router = Router();
const ThesisCollection = require('../src/thesisdb'); 
const RCDCollection = require('../src/rcd');

// Handle edit request
router.put('/api/thesis/:id', async (req, res) => {
  try {
    const updatedThesis = await ThesisCollection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!updatedThesis) return res.status(404).json({ message: 'Thesis not found' });
    res.json(updatedThesis);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
