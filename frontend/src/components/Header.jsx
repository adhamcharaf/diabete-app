import {Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import logo from '../assets/logo.png';

export default function Header() {
    const {user} = useAuth();

    const renderLeftLinks = () => {
        if (!user) {
            return (
                <>
                    <Link to="/" className="text-white hover:underline">Accueil</Link>
                </>
            );
        }

        switch (user.role) {
            case 'patient':
                return (
                    <>
                        <Link to="/dashboard/patient" className="text-white hover:underline">
                            Tableau de bord
                        </Link>
                        <Link to="/" className="text-white hover:underline">Accueil</Link>
                    </>
                );
            case 'medecin':
                return (
                    <>
                        <Link to="/dashboard/medecin" className="text-white hover:underline">
                            Espace médecin
                        </Link>
                        <Link to="/" className="text-white hover:underline">Accueil</Link>
                    </>
                );
            case 'agent':
                return (
                    <>
                        <Link to="/dashboard/agent" className="text-white hover:underline">
                            Espace agent
                        </Link>
                        <Link to="/" className="text-white hover:underline">Accueil</Link>
                    </>
                );
            default:
                return <Link to="/" className="text-white hover:underline">Accueil</Link>;
        }
    };

    const renderRightLinks = () => {
        if (!user) {
            return (
                <>
                    <LoginButton/>
                    <RegisterButton/>
                </>
            );
        } else {
            return <LogoutButton/>;
        }
    };

    return (
        <header className="bg-blue-700 shadow-md p-4 flex justify-between items-center">
            <Link to="/">
                <img src={logo} alt="Logo Diabète App" className="h-10 w-auto"/>
            </Link>

            <div className="flex justify-between items-center w-full ml-6">
                {/* Liens à gauche */}
                <nav className="flex gap-4">{renderLeftLinks()}</nav>

                {/* Actions à droite */}
                <div className="flex gap-4">{renderRightLinks()}</div>
            </div>
        </header>
    );
}
