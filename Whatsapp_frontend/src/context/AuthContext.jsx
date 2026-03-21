import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authStep, setAuthStep] = useState('login'); // login, signup, signup-verify, forgot-password, password-reset
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSignupNavigate = () => {
        setAuthStep('signup');
        setError('');
    };

    const handleForgotPasswordNavigate = () => {
        setAuthStep('forgot-password');
        setError('');
    };

    const handleBackToLogin = () => {
        setAuthStep('login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
    };

    const value = {
        authStep,
        setAuthStep,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        otp,
        setOtp,
        newPassword,
        setNewPassword,
        confirmNewPassword,
        setConfirmNewPassword,
        isLoading,
        setIsLoading,
        error,
        setError,
        handleSignupNavigate,
        handleForgotPasswordNavigate,
        handleBackToLogin,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
