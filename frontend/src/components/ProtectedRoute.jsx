import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  // En cours de chargement → ne rien afficher pour éviter les redirections prématurées
  if (loading) {
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  }

  // Non connecté → redirection vers connexion
  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  // Connecté, mais pas le bon rôle → redirection vers accès refusé
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Tout est bon ✅
  return children;
}
