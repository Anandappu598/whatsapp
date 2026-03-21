import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'error', duration = 3000) => {
        const id = Date.now();
        const newToast = { id, message, type };
        
        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showError = useCallback((message, duration = 3000) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const showSuccess = useCallback((message, duration = 3000) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, showError, showSuccess }}>
            {children}
        </ToastContext.Provider>
    );
};
