import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import './ProfileModal.css';

const ProfileModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [profileIcon, setProfileIcon] = useState('path/to/default/icon.png');

  // State for password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterPassword, setReEnterPassword] = useState('');

  // Fetch user data when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/profile', { withCredentials: true });
          const user = response.data;
          setName(user.name || '');
          // Optionally set profileIcon if you have URL or path to profile icon
          setProfileIcon(user.profileIcon || 'path/to/default/icon.png');
        } catch (error) {
          console.error("Error fetching user data:", error);
          alert("Failed to load user data. Please try again.");
        }
      };

      fetchUserData();
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if new passwords match
    if (newPassword !== reEnterPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      // Prepare the data to send
      const data = {
        name,
        currentPassword,
        newPassword
      };

      // Send data to the server
      await axios.post('http://localhost:5000/profile/edit', data, {
        withCredentials: true, // Include cookies in the request if needed
      });

      // Clear password fields after submission
      setCurrentPassword('');
      setNewPassword('');
      setReEnterPassword('');
      onClose(); // Close the modal after saving
      alert("Password Changed Succesfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Please enter correct password");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content2">
        <h2>Edit My Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <p id="name">{name}</p> {/* Display name as non-editable text */}
          </div>
          <div className="form-group">
            <label htmlFor="current-password">Current Password:</label>
            <input
              type="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-password">New Password:</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="re-enter-password">Re-enter New Password:</label>
            <input
              type="password"
              id="re-enter-password"
              value={reEnterPassword}
              onChange={(e) => setReEnterPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="save-button">Save Changes</button>
          <button type="button" className="close-button" onClick={onClose}>Close</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
