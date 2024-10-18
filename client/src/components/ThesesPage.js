import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ThesesPage.css';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import UploadForm from './UploadForm';
import EditForm from './EditForm'; // Import your EditForm component

const ThesesPage = () => {
    const [theses, setTheses] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [thesisToDelete, setThesisToDelete] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isEditFormModalOpen, setIsEditFormModalOpen] = useState(false);
    const [selectedThesis, setSelectedThesis] = useState(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [resultsPerPage] = useState(5);

    useEffect(() => {
        axios.get('http://localhost:5000/api/theses')
            .then(response => {
                const activeTheses = response.data.filter(thesis => !thesis.deleted);
                setTheses(activeTheses);
            })
            .catch(err => {
                setError(err.message);
            });
    }, []);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const addThesis = () => {
        openFormModal();
    };

    const editThesis = (thesis) => {
        setSelectedThesis(thesis);
        setIsEditFormModalOpen(true);
    };

    const openModal = (id) => {
        setIsModalOpen(true);
        setThesisToDelete(id);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setThesisToDelete(null);
    };

    const confirmDelete = () => {
        axios.delete(`http://localhost:5000/api/thesis/${thesisToDelete}`)
            .then(() => {
                setTheses(theses.filter((thesis) => thesis._id !== thesisToDelete));
                closeModal();
            })
            .catch(err => {
                setError(err.message);
                closeModal();
            });
    };

    const openFormModal = () => {
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
    };

    const closeEditFormModal = () => {
        setIsEditFormModalOpen(false);
        setSelectedThesis(null);
    };

    const filteredTheses = theses.filter(
        (thesis) =>
            thesis.titlename.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thesis.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            thesis.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastThesis = currentPage * resultsPerPage;
    const indexOfFirstThesis = indexOfLastThesis - resultsPerPage;
    const currentTheses = filteredTheses.slice(indexOfFirstThesis, indexOfLastThesis);
    
    const totalPages = Math.ceil(filteredTheses.length / resultsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className="App">
        <Header />
        <div className="container">
        <div className="admin-page">
          <Sidebar isVisible={sidebarVisible} />
          <div className={`logs-content ${sidebarVisible ? 'sidebar-open' : ''}`}>
            <h1 className="greeting">Good day Aaron!</h1> {/* Greeting */}
            <div className="table-container"> {/* Container box around the table */}
              <div className="top-bar">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="search-bar-users"
                />
              </div>
                            <button onClick={addThesis} className="upload-button">
                                <span className="plus-icon">+</span> Upload
                            </button>
                        </div>
                        {error && <p>Error: {error}</p>}
                        <table className="theses-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Program</th> {/* Moved Program column here */}
                                    <th>Overview</th>
                                    <th>Author</th>
                                    <th>File</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTheses.map((thesis) => (
                                    <tr key={thesis._id}>
                                        <td>{thesis.titlename}</td>
                                        <td>{thesis.category}</td>
                                        <td>{thesis.program}</td> {/* Added Program field */}
                                        <td>{thesis.overview}</td>
                                        <td>{thesis.author}</td>
                                        <td>{thesis.filename}</td>
                                        <td>
                                            <button onClick={() => editThesis(thesis)} className="edit-button">Edit</button>
                                            <button onClick={() => openModal(thesis._id)} className="delete-button">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {/* Form Modal */}
                    {isFormModalOpen && (
                        <UploadForm onClose={closeFormModal} />
                    )}

                    {/* Edit Form Modal */}
                    {isEditFormModalOpen && selectedThesis && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Edit Thesis</h2>
                                <EditForm
                                    thesis={selectedThesis}
                                    onClose={closeEditFormModal}
                                    onUpdate={(updatedThesis) => {
                                        setTheses(theses.map(thesis =>
                                            thesis._id === updatedThesis._id ? updatedThesis : thesis
                                        ));
                                        closeEditFormModal();
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {isModalOpen && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Confirm Deletion</h2>
                                <p>Are you sure you want to delete this thesis?</p>
                                <div className="modal-buttons">
                                    <button onClick={confirmDelete} className="confirm-button">Yes, Delete</button>
                                    <button onClick={closeModal} className="cancel-button">Cancel</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default ThesesPage;
