import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // notre instance Axios
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/auth/login', {
        phone_number,
        password,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));


        const role = res.data.user.role;
        if (role === 'patient') navigate('/dashboard/patient');
        else if (role === 'medecin') navigate('/dashboard/medecin');
        else if (role === 'agent') navigate('/dashboard/agent');
        else navigate('/');
      } else {
        setError("Identifiants incorrects");
      }
    } catch (err) {
      console.error("Erreur lors de la connexion:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur s’est produite.");
      }
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md bg-gray-200 border border-gray-300 shadow-2xl rounded-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Connexion</h2>

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Numéro de téléphone
              </label>
              <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex : 77 123 45 67"
                  required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="********"
                    required
                />
                <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              </div>
            </div>

            {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Se connecter
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Pas encore de compte ?{' '}
            <a href="/inscription" className="text-blue-600 hover:underline">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
  );
}
