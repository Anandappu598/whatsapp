import React, { useContext, useState, useEffect } from 'react';
import '../../styles/auth/auth.css';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { forgotPassword, resetPassword, getApiErrorMessage } from '../../api';

const PasswordReset = () => {
    const { email, otp, setOtp, newPassword, setNewPassword, confirmNewPassword, setConfirmNewPassword, isLoading, setIsLoading, error, setError, handleBackToLogin } = useContext(AuthContext);
    const { showSuccess, showError } = useContext(ToastContext);
    const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [step, setStep] = useState('otp'); // otp or password

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtpArray = [...otpArray];
        newOtpArray[index] = value;
        setOtpArray(newOtpArray);

        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }

        setOtp(newOtpArray.join(''));
    };

    const handleOtpBackspace = (index, e) => {
        if (e.key === 'Backspace' && !otpArray[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setError('');

        const fullOtp = otpArray.join('');
        if (fullOtp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        // Backend logic will verify OTP here
        console.log('Verifying OTP:', fullOtp);
        setStep('password');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (!newPassword.trim() || !confirmNewPassword.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({ email, otp, new_password: newPassword });
            showSuccess('Password reset successful. Please login.');
            handleBackToLogin();
        } catch (err) {
            const message = getApiErrorMessage(err, 'Password reset failed');
            setError(message);
            showError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setTimeLeft(60);
        setCanResend(false);
        setOtpArray(['', '', '', '', '', '']);
        setOtp('');

        setIsLoading(true);
        try {
            await forgotPassword({ email });
            showSuccess('OTP resent successfully.');
        } catch (err) {
            const message = getApiErrorMessage(err, 'Failed to resend OTP');
            setError(message);
            showError(message);
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
                    <h1 className="auth-title">Reset Password</h1>
                    <p className="auth-subtitle">Secure your account</p>
                </div>

                {step === 'otp' ? (
                    /* OTP Verification Form */
                    <form className="auth-form" onSubmit={handleVerifyOtp}>
                        <h2 className="form-heading">Verify OTP</h2>
                        <p className="form-subheading">We sent a 6-digit code to<br /><strong>{email}</strong></p>

                        {error && <div className="alert alert-error">{error}</div>}

                        <div className="otp-input-group">
                            {otpArray.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    maxLength="1"
                                    className="otp-input"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpBackspace(index, e)}
                                    disabled={isLoading}
                                    placeholder="0"
                                />
                            ))}
                        </div>

                        <button type="submit" className="auth-btn-primary" disabled={isLoading || otpArray.join('').length !== 6}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Verifying...
                                </>
                            ) : (
                                'Verify OTP'
                            )}
                        </button>

                        <div className="otp-timer">
                            {canResend ? (
                                <button type="button" className="text-link" onClick={handleResendOtp} disabled={isLoading}>
                                    Resend OTP
                                </button>
                            ) : (
                                <span className="timer-text">Resend OTP in {timeLeft}s</span>
                            )}
                        </div>

                        <button type="button" className="auth-btn-secondary" onClick={handleBackToLogin} disabled={isLoading}>
                            Back to Sign In
                        </button>
                    </form>
                ) : (
                    /* New Password Form */
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <h2 className="form-heading">Create New Password</h2>
                        <p className="form-subheading">Enter a new secure password</p>

                        {error && <div className="alert alert-error">{error}</div>}

                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={isLoading}
                                >
                                    {showNewPassword ? (
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
                            <span className="form-hint">At least 8 characters</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Confirm new password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? (
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
                        </div>

                        <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Resetting...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>

                        <button type="button" className="auth-btn-secondary" onClick={handleBackToLogin} disabled={isLoading}>
                            Back to Sign In
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PasswordReset;
