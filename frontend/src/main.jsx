import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider> {/* 🔐 Fournit l'accès global au contexte d'auth */}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>,
);
