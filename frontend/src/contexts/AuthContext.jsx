import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // 👈 On garde loading pour la sécurité des routes
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setUser(null); // 👈 Gère proprement l’absence de token
                return setLoading(false);
            }

            try {
                const res = await api.get('/auth/me', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data.user);
            } catch (err) {
                console.error("Erreur AuthContext:", err);
                localStorage.removeItem('token');
                setUser(null); // 👈 Reset user proprement si erreur
            }
            setLoading(false); // 👈 Mise à jour importante ici
        };

        checkToken();
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/connexion');
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
