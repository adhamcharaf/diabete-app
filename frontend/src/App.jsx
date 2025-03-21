import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-blue-800">✅ Tailwind est opérationnel !</h1>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
        Je suis prêt pour la suite 💼
      </button>
    </div>
  );
}

export default App;
