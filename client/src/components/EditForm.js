import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditForm = ({ onClose, existingData }) => {
  const [titlename, settitlename] = useState(existingData.titlename || '');
  const [category, setCategory] = useState(existingData.category || '');
  const [year, setYear] = useState(existingData.year || '');
  const [author, setAuthor] = useState(existingData.author || '');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Set the form fields with existing data when the component mounts or existingData changes
    settitlename(existingData.titlename || '');
    setCategory(existingData.category || '');
    setYear(existingData.year || '');
    setAuthor(existingData.author || '');
  }, [existingData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('titlename', titlename);
    formData.append('category', category);
    formData.append('year', year);
    formData.append('author', author);
    if (file) {
      formData.append('thesisPDF', file);
    }

    try {
      const response = await axios.put(`http:localhost:5000/api/edit/${existingData._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message || 'File updated successfully!');
    } catch (error) {
        console.error('Error updating file:', error.response ? error.response.data : error.message);
        setMessage('Error updating file');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Thesis</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
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
          />
          <button type="submit" className="save-button">Update</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default EditForm;
