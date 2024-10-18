import React, { useState } from 'react';
import axios from 'axios';

const EditForm = ({ thesis, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({ ...thesis });
    const [file, setFile] = useState(null); // State for the new file

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Set the selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedThesis = new FormData(); // Using FormData for file uploads

        // Append the existing thesis data to FormData
        updatedThesis.append('titlename', formData.titlename);
        updatedThesis.append('category', formData.category);
        updatedThesis.append('program', formData.program);
        updatedThesis.append('overview', formData.overview);
        updatedThesis.append('author', formData.author);

        // Append the new file if it exists
        if (file) {
            updatedThesis.append('file', file);
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/thesis/${thesis._id}`, updatedThesis, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUpdate(response.data); // Pass the updated thesis back to ThesesPage
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating thesis:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title</label>
                <input
                    type="text"
                    name="titlename"
                    value={formData.titlename}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Category</label>
                <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Program</label>
                <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Overview</label>
                <input
                    name="overview"
                    value={formData.overview}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Author</label>
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Upload New File</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                />
            </div>
            <div className="modal-buttons">
                <button type="submit" className="confirm-button">Save</button>
                <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
            </div>
        </form>
    );
};

export default EditForm;
