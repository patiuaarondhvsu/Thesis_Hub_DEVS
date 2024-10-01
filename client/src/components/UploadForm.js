import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onClose }) => {
  const [titlename, settitlename] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [author, setAuthor] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');


  //to accept only pdf
    const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the file is a PDF
    if (file && file.type !== 'application/pdf') {
      setMessage('Please upload a valid PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('titlename', titlename);
    formData.append('category', category);
    formData.append('year', year);
    formData.append('author', author);
    formData.append('thesisPDF', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Upload Thesis</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="title"
            value={titlename}
            onChange={(e) => settitlename(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="form-input"
            required
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="form-input"
            accept="application/pdf"
            required
          />
          <button type="submit" className="save-button">Upload</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default UploadForm;
