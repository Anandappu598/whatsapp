import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Login from './Login';
import SignUp from './SignUp';
import SignUpVerify from './SignUpVerify';
import ForgotPassword from './ForgotPassword';
import PasswordReset from './PasswordReset';

const AuthContainer = () => {
    const { authStep } = useContext(AuthContext);

    return (
        <>
            {authStep === 'login' && <Login />}
            {authStep === 'signup' && <SignUp />}
            {authStep === 'signup-verify' && <SignUpVerify />}
            {authStep === 'forgot-password' && <ForgotPassword />}
            {authStep === 'password-reset-verify' && <PasswordReset />}
        </>
    );
};

export default AuthContainer;
