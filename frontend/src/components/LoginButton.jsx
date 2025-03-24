import { Link } from 'react-router-dom';

export default function LoginButton() {
    return (
        <Link
            to="/connexion"
            className="border border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white font-semibold px-4 py-2 rounded transition"

        >
            Se connecter
        </Link>
    );
}
2