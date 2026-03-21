import React, { useContext, useState } from 'react';
import '../../styles/auth/auth.css';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { login, getApiErrorMessage } from '../../api';

const Login = () => {
    const { email, setEmail, password, setPassword, setAuthStep, setIsLoading, isLoading, handleForgotPasswordNavigate, handleSignupNavigate } = useContext(AuthContext);
    const { showError, showSuccess } = useContext(ToastContext);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            showError('Please enter both email and password');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await login({ email, password });
            localStorage.setItem('authToken', response.access);
            localStorage.setItem('refreshToken', response.refresh);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userRole', response.role);
            localStorage.setItem('themeMode', response.theme_preference || 'auto');
            showSuccess('Login successful!');
            setAuthStep('dashboard');
        } catch (err) {
            showError(getApiErrorMessage(err, 'Login failed'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-wrapper">
                {/* Logo Section */}
                <div className="auth-logo-section">
                    <div className="auth-logo">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3 .97 4.29L2 22l5.71-.97C8.99 21.64 10.45 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"></path>
                        </svg>
                    </div>
                    <h1 className="auth-title">WhatsApp Manager</h1>
                    <p className="auth-subtitle">Connect, Message, Broadcast</p>
                </div>

                {/* Login Form */}
                <form className="auth-form" onSubmit={handleLogin}>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '6px' }}>
                            <button 
                                type="button" 
                                className="text-link" 
                                onClick={handleForgotPasswordNavigate} 
                                disabled={isLoading}
                                style={{ fontSize: '12px', fontWeight: '500' }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginRight: '4px' }}>Don't have an account?</span>
                        <button 
                            type="button" 
                            className="text-link" 
                            onClick={handleSignupNavigate} 
                            disabled={isLoading}
                            style={{ fontSize: '13px', fontWeight: '600' }}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
