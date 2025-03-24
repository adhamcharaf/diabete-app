export default function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-md bg-red-100 border border-red-300 shadow-2xl rounded-lg p-6 space-y-6">
                <h2 className="text-2xl font-bold text-center text-red-700">Accès non autorisé</h2>
                <p className="text-center text-gray-700">
                    Vous n’avez pas les droits pour accéder à cette page.
                </p>
                <div className="text-center">
                    <a
                        href="/connexion"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition"
                    >
                        Retour à la connexion
                    </a>
                </div>
            </div>
        </div>
    );
}
