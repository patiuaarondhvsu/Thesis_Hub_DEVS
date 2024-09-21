import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import Footer from './Footer'; 
import Header from './Header';

const RegisterForm = ({ onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  // State for handling error messages
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('http:localhost:5000/signup', {
                name,
                email,
                password,
                dateOfBirth
            });

            if (response.data.status === 'FAILED') {
                setErrorMessage(response.data.message);
            } else {
                // Redirect to login page or a verification page
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage('An error occurred during registration. Please try again.');
            console.error('Registration failed', error);
        }
    };

    return (
        <div className="App">
            <Header />

            <div className="main-content">
                <div className="login-form">
                    <h2>Register</h2>

                    {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="name" 
                                placeholder="Name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="password" 
                                placeholder="Confirm Password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="date" 
                                placeholder="Date of Birth" 
                                value={dateOfBirth} 
                                onChange={(e) => setDateOfBirth(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit">Register</button>
                    </form>
                    <p>
                        Already have an account? 
                        <span onClick={onSwitchToLogin} className="switch-link">Login</span>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default RegisterForm;
