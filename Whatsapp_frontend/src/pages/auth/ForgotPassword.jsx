import React, { useContext } from 'react';
import '../../styles/auth/auth.css';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { forgotPassword, getApiErrorMessage } from '../../api';

const ForgotPassword = () => {
    const { email, setEmail, isLoading, setIsLoading, setAuthStep, handleBackToLogin } = useContext(AuthContext);
    const { showError, showSuccess } = useContext(ToastContext);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            showError('Please enter your email address');
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        try {
            await forgotPassword({ email });
            showSuccess('Password reset OTP sent to your email.');
            setAuthStep('password-reset-verify');
        } catch (err) {
            showError(getApiErrorMessage(err, 'Failed to send reset OTP'));
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
                    <h1 className="auth-title">Forgot Password</h1>
                    <p className="auth-subtitle">Reset your password</p>
                </div>

                {/* Forgot Password Form */}
                <form className="auth-form" onSubmit={handleForgotPassword}>

                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <span className="form-hint">We'll send a verification code to this email</span>
                    </div>

                    <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Sending Code...
                            </>
                        ) : (
                            'Send Reset Code'
                        )}
                    </button>

                    <button type="button" className="auth-btn-secondary" onClick={handleBackToLogin} disabled={isLoading}>
                        Back to Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
