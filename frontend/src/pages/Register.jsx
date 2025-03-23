import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePhoneNumber = (number) => {
    const pattern = /^(7[05678])\s?\d{3}\s?\d{2}\s?\d{2}$/;
    return pattern.test(number.replace(/\s/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhoneNumber(formData.phone_number)) {
      setPhoneError('Numéro de téléphone invalide (ex: 77 123 45 67)');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Les mots de passe ne correspondent pas.');
      setPhoneError('');
      return;
    }

    setError('');
    setPhoneError('');

    try {
      const {confirm_password, ...dataToSend} = formData;
      console.log("Tentative d'inscription avec :", dataToSend);

      const res = await api.post('/auth/register', dataToSend);

      console.log("Réponse backend :", res);

      if (res.data.success) {
        navigate('/connexion');
      } else {
        setError(res.data.message || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      console.error("Erreur catch:", err);
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
          <h2 className="text-2xl font-bold text-center text-gray-800">Créer un compte</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex : Moustapha Ndiaye"
                  required
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Numéro de téléphone
              </label>
              <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex : 77 123 45 67"
                  required
              />
              {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
              />
              <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            </div>

            <div className="relative">
              <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirm_password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
              />
              <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowConfirm(!showConfirm)}
              >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            </div>

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Rôle
              </label>
              <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
              >
                <option value="">Sélectionnez un rôle</option>
                <option value="patient">Patient</option>
                <option value="medecin">Médecin</option>
                <option value="agent">Agent de santé</option>
              </select>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Créer un compte
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Déjà inscrit ?{" "}
            <a href="/connexion" className="text-blue-600 hover:underline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
  );
}
