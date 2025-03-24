import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPatient from './pages/DashboardPatient';
import DashboardMedecin from './pages/DashboardMedecin';
import DashboardAgent from './pages/DashboardAgent';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';
import Header from './components/Header';

function App() {
    return (
        <div>
            <Header /> {/* ✅ Le header sera affiché sur toutes les pages */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/connexion" element={<Login />} />
                <Route path="/inscription" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route
                    path="/dashboard/patient"
                    element={
                        <ProtectedRoute requiredRole="patient">
                            <DashboardPatient />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/medecin"
                    element={
                        <ProtectedRoute requiredRole="medecin">
                            <DashboardMedecin />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard/agent"
                    element={
                        <ProtectedRoute requiredRole="agent">
                            <DashboardAgent />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
