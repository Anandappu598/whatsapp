import React, { useContext, useState, useEffect } from 'react';
import '../../styles/auth/auth.css';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import { signup, verifySignupOtp, getApiErrorMessage } from '../../api';

const SignUpVerify = () => {
    const { email, password, otp, setOtp, isLoading, setIsLoading, error, setError, setAuthStep, handleBackToLogin } = useContext(AuthContext);
    const { showSuccess, showError } = useContext(ToastContext);
    const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

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

        // Auto-focus next input
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

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');

        const fullOtp = otpArray.join('');
        if (fullOtp.length !== 6) {
            setError('Please enter a valid 6-digit OTP');
            return;
        }

        setIsLoading(true);
        try {
            await verifySignupOtp({ email, otp: fullOtp });
            showSuccess('Signup verified. Please login.');
            handleBackToLogin();
        } catch (err) {
            const message = getApiErrorMessage(err, 'OTP verification failed');
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

        if (!password) {
            const message = 'Password is missing. Please sign up again.';
            setError(message);
            showError(message);
            setAuthStep('signup');
            return;
        }

        setIsLoading(true);
        try {
            await signup({ email, password });
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
                    <h1 className="auth-title">Verify Email</h1>
                    <p className="auth-subtitle">Complete your registration</p>
                </div>

                {/* OTP Form */}
                <form className="auth-form" onSubmit={handleVerifyOtp}>
                    <h2 className="form-heading">Enter OTP</h2>
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
            </div>
        </div>
    );
};

export default SignUpVerify;
