import { Link } from 'react-router-dom';

export default function RegisterButton() {
    return (
        <Link
            to="/inscription"
            className="bg-emerald-500 text-white font-semibold px-4 py-2 rounded hover:bg-white hover:text-emerald-600 border border-emerald-500 transition"

        >
            S’inscrire
        </Link>
    );
}
