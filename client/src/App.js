import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import UsersPage from './components/UsersPage';
import ThesesPage from './components/ThesesPage';  
import LogsPage from './components/LogsPage';
import ProfileModal from './components/ProfileModal'; 
import MainPage from './components/MainPage';
import LoginForm from './components/LoginForm';
import UploadForm from './components/UploadForm';
import EditForm from './components/EditForm';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<AuthPage />} /> {/* Assuming register is on AuthPage */}
            
            {/* Protected Routes */}
            <Route path="/users" element={<ProtectedRoute element={UsersPage} />} />
            <Route path="/theses" element={<ProtectedRoute element={ThesesPage} />} /> 
            <Route path="/logs" element={<ProtectedRoute element={LogsPage} />} />
            <Route path="/upload" element={<ProtectedRoute element={UploadForm} />} />
            <Route path="/edit" element={<ProtectedRoute element={EditForm} />} />
            <Route path="/profile" element={<ProtectedRoute element={ProfileModal} />} />
            <Route path="/main" element={<ProtectedRoute element={MainPage} />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
