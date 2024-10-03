import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import Footer from './Footer'; 
import Header from './Header';
import 'font-awesome/css/font-awesome.min.css';

const RegisterForm = ({ onSwitchToLogin }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [studentNo, setStudentNo] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // New state for success message
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            setSuccessMessage(''); // Clear success message
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/signup', {
                firstName,
                lastName,
                email,
                password,
                studentNo
            });

            if (response.data.status === 'FAILED') {
                setErrorMessage(response.data.message);
                setSuccessMessage(''); // Clear success message
            } else {
                setSuccessMessage('Registration successful! Please verify your email.'); // Set success message
                setErrorMessage(''); // Clear error message
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
            }
        } catch (error) {
            setErrorMessage('An error occurred during registration. Please try again.');
            setSuccessMessage(''); // Clear success message
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
                    {successMessage && <p className="success-message">{successMessage}</p>} {/* Render success message */}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="First Name" 
                                value={firstName} 
                                onChange={(e) => setFirstName(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group">
                            <input 
                                type="text" 
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
                            <div className="password-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
                                    <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                            </div>
                        </div>
                        <div className="input-group">
                            <div className="password-container">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="toggle-password">
                                    <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </span>
                            </div>
                        </div>
                        <div className="input-group">
                            <input 
                                type="text" 
                                placeholder="Student No" 
                                value={studentNo} 
                                onChange={(e) => setStudentNo(e.target.value)} 
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
