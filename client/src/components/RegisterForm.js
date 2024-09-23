import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import Footer from './Footer'; 
import Header from './Header';

const RegisterForm = ({ onSwitchToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/signup', {
                firstName,
                lastName,
                email,
                password,
                dateOfBirth
            });

            if (response.data.status === 'FAILED') {
                setErrorMessage(response.data.message);
            } else {
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

                    {errorMessage && <p className="error-message">{errorMessage}</p>}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="firstname" 
                                placeholder="First Name" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="lastname" 
                                placeholder="Last Name" 
                                value={lastName} 
                                onChange={(e) => setLastName(e.target.value)} 
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
