import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css'; // Ensure you have appropriate styles for this page
import Date from './Date';
import ProfileModal from './ProfileModal';
import ChatbotModal from './ChatbotModal'; 
import Footer from './Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faSearch, faUserCircle, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';


                                                                                            {/* Library Modal 
const MyLibraryModal = ({ isOpen, onClose, libraryItems, onDelete, notification }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>My Library</h2>
        {libraryItems.length === 0 ? (
          <p>No items in your library.</p>
        ) : (
          <div className="library-list">
            {libraryItems.map((item, index) => (
              <div key={index} className="library-item">
                <div className="library-item-details">
                  <p className="result-title">{item.title}</p>
                  <p className="result-authors">{item.authors}</p>
                  <p className="result-date">{item.date}</p>
                </div>
                <button className="delete-button" onClick={() => onDelete(index)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
*/}
const MainPage = () => {
  const [theses, setTheses] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isLibraryModalOpen, setLibraryModalOpen] = useState(false);
  const [isChatbotModalOpen, setChatbotModalOpen] = useState(false);
  const [libraryItems, setLibraryItems] = useState([]);
  const [notification, setNotification] = useState('');
  const [pdfSrc, setPdfSrc] = useState(''); // State for PDF source
  const [isPdfVisible, setPdfVisible] = useState(false); // State for PDF visibility

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(5);

  // logout handler
  const handleLogout = () => {
    axios.get('http:localhost:5000/logout', { withCredentials: true })
  .then(response => {
    // Redirect to login page or handle redirection in another way
    window.location.href = '/'; 
  })
  .catch(error => {
    console.error('Logout failed:', error);
    // Optionally, show an error message to the user
  });
  };

  useEffect(() => {
    axios.get('http:localhost:5000/api/theses')
        .then(response => {
            // Filter out deleted theses
            const activeTheses = response.data.filter(thesis => !thesis.deleted);
            setTheses(activeTheses);
        })
        .catch(err => {
            setError(err.message);
        });
  }, []);

  useEffect(() => {
    const results = theses.filter((thesis) => {
      return (
        thesis.titlename.toLowerCase().includes(query.toLowerCase()) ||
        thesis.author.toLowerCase().includes(query.toLowerCase()) ||
        thesis.year.toString().includes(query.toLowerCase())
      );
    });
    setFilteredResults(results);
     setCurrentPage(1); 
  }, [query, theses]);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult);

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const toggleProfile = () => setProfileOpen(!isProfileOpen);

  const openProfileModal = () => {
    setProfileModalOpen(true);
    setProfileOpen(false);
  };

  const closeProfileModal = () => setProfileModalOpen(false);

  const closeLibraryModal = () => setLibraryModalOpen(false);

  const openChatbotModal = () => setChatbotModalOpen(true);

  const closeChatbotModal = () => setChatbotModalOpen(false);

  const openDateModal = () => setDateModalOpen(true);

  const closeDateModal = () => setDateModalOpen(false);

  const applyDateSelection = () => {
    closeDateModal();
    handleSearch();
  };

  const handleAddToLibrary = (item) => {
    setLibraryItems([...libraryItems, item]);
    setNotification('Added to your library');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleDeleteFromLibrary = (index) => {
    const updatedLibraryItems = libraryItems.filter((_, i) => i !== index);
    setLibraryItems(updatedLibraryItems);
    setNotification('Removed from your library');
    setTimeout(() => setNotification(''), 3000);
  };

  const handleSearch = () => {
    // Search logic handled by the useEffect above
  };

  const showPDF = (pdf) => {
    const encodedPdf = encodeURIComponent(pdf);
    setPdfSrc(`http://localhost:5000/files/${encodedPdf}#toolbar=0`);
    setPdfVisible(true);
};

  const handleTitleClick = (result) => {
    const encodedPdf = encodeURIComponent(result.filename);
    setPdfSrc(`http:localhost:5000/files/${encodedPdf}#toolbar=0`); // Set PDF source with toolbar=0
    setPdfVisible(true); // Show the PDF iframe
  };

  return (
    <div className="App">
      <header className="header">
        <img src="/thesishublogowhite.jpg" alt="Logo" className="logo" />

        <div className="libchat-button">
          <button className="library-button" onClick={() => setLibraryModalOpen(true)}></button>
          <button className="chatbot-button" onClick={openChatbotModal}>Chatbot</button>
        </div>
       
        <div className="profile-dropdown-button">
    
            <button onClick={toggleProfile}> ☰ </button>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              {/* <button onClick={openProfileModal}>CHANGE PASSWORD</button> Change Password Button */}
              <button onClick={handleLogout}>LOGOUT</button>
            </div>
          )}
        </div>
      </header>
     
      {isPdfVisible && (
  <div className="pdf-overlay">
    <div className="pdf-iframe-container">
      <button className="pdf-close-button" onClick={() => setPdfVisible(false)}>Close PDF</button>
      <iframe
        src={pdfSrc}
        title="PDF Viewer"
        frameBorder="0"
        className="pdf-iframe"
      ></iframe>
      <div className="blank-overlay" /> {/* Blocking overlay */}
    </div>
  </div>
)}

      <div className="App-results">
        <div className="content">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="search-icon"
              onClick={handleSearch}
            />
            
                                    {  /* Date ICON 
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="date-icon"
              onClick={openDateModal}
            />                          */ }
          </div> 

          <div className="results">
            
            {filteredResults.length === 0 ? (
              <p>Loading...</p>
            ) : (
              currentResults.map((result, index) => (
                <div key={index} className="result-item">
                  <p
                    className="result-title"
                    onClick={() => handleTitleClick(result)}
                    style={{ cursor: 'pointer' }} // Ensure the title appears clickable
                  >
                    {result.titlename}
                  </p>
                  <p className="result-authors">{result.author}</p>
                  <p className="result-year">{result.year}</p>
                
                                              { /* STAR BUTTON 
                <button
                    className="star-button"
                    onClick={() => handleAddToLibrary(result)}
                  > 
                    <FontAwesomeIcon icon={faStar} />
                  </button>  */              }
                                             
                </div>
              ))
            )}
          </div>         
        </div>

                                             {/* DATE MODAL 
        <Date
          isOpen={isDateModalOpen}
          onClose={closeDateModal}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          onApply={applyDateSelection}
        />  
                                           */ }

        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={closeProfileModal}
        />

                                             { /* LIBRARY MODAL 
        <MyLibraryModal
          isOpen={isLibraryModalOpen}
          onClose={closeLibraryModal}
          libraryItems={libraryItems}
          onDelete={handleDeleteFromLibrary}
          notification={notification}
        />
                                            */ }

                                          
        <ChatbotModal
          isOpen={isChatbotModalOpen}
          onClose={closeChatbotModal}
        />

        {notification && (
          <div className="notification-container">
            <p className="notification-message">{notification}</p>
          </div>
        )}
        
      </div>
      <div className="pagination">
      {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={number === currentPage ? 'active' : ''}
                    >
                      {number}
                    </button>
                  ))}
          </div>
      <Footer />
    </div>
  );
};

export default MainPage;
