import { useAuth } from '../contexts/AuthContext';

export default function LogoutButton() {
    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
            Se déconnecter
        </button>
    );
}