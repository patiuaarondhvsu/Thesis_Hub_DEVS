const { Router } = require('express');
const router = Router();
const userCollection = require('../src/userdb'); 

// Endpoint to get all users
router.get('/api/users', async (req, res) => {
  try {
    const users = await userCollection.find(); 
    res.json(users); // Corrected from 'theses' to 'users'
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
