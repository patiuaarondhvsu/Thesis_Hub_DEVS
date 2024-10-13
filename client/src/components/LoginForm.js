import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthForm.css';
import Header from './Header';
import Footer from './Footer';

const LoginForm = ({ onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Attempting to login with:', { email, password });

        try {
            const response = await axios.post(`http://localhost:5000/login`, {
                email,
                password
            }, {
                withCredentials: true
            });

            console.log('Login response:', response.data);

            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                login(response.data.user.role);
                if (response.data.user.role === 'admin') {
                    navigate('/theses');
                } else {
                    navigate('/main');
                }
            } else {
                setErrorMessage(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred during login. Please try again.');
        }
    };

    return (
        <div className="App">
            <Header />
            <main className="main-content">
                {/* Left panel with welcome message */}
                <div className="welcome-section">
                    <h1>Welcome to Thesis Hub, Code Hearted Fox!</h1>
                    <p>Explore, and discover academic research with ease. Thesis HUB connects students, educators, and researchers, making it simple to access and share valuable theses and dissertations across various disciplines.</p>
                </div>
                
                {/* Right panel with login form */}
                <div className="login-form">
                    <h2>Login</h2>
                    <p>Enter your account to continue with Thesis HUB</p>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <form onSubmit={handleSubmit}>
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

                        <button type="submit">Login</button>
                    </form>
                    <p>
                        Don't have an account?{' '}
                        <span onClick={onSwitchToRegister} className="switch-link">Register</span>
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LoginForm;
