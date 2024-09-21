const { Router } = require('express');
const router = Router();
const multer = require('multer');
const path = require('path');
const ThesisCollection = require('../src/thesisdb');
const RCDCollection = require('../src/rcd');

// Multer Configuration for Disk Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/files')); // Specify the directory to save files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Handle form submission with file upload
router.post('/api/upload', upload.single('thesisPDF'), async (req, res) => {
  try {
    const { titlename, category, year, author } = req.body;

    // Ensure all required fields are provided
    if (!titlename || !category || !year || !req.file) {
      return res.status(400).send('All fields are required.');
    }

    // Create a new Thesis document
    const newThesis = new ThesisCollection({
      titlename,
      category,
      year,
      author,
      filename: req.file.originalname, // Use the original file name
      filePath: path.join('files', req.file.originalname) // Store the relative file path
    });

    // Save Thesis document to MongoDB
    const savedThesis = await newThesis.save();

    // Create a Record Control Document (RCD) entry
    const newRCD = new RCDCollection({
      thesisId: savedThesis._id,
      uploadDate: new Date()
      // Populate with other required fields if necessary
    });

    // Save RCD document to MongoDB
    await newRCD.save();

    // Send a success response
    res.render('adminhome', { message: 'File uploaded, thesis data saved, and RCD entry created successfully!' });
  } catch (err) {
    // Handle error
    console.error('Error handling upload:', err);
    res.status(500).send('Error processing upload');
  }
});

module.exports = router;
