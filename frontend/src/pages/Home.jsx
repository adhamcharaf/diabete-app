export default function Home() {
    return (
        <div
            className="min-h-screen w-screen bg-white text-gray-800 flex flex-col items-center justify-start px-4 md:px-8">
            <header className="p-6 text-center max-w-2xl w-full">
                <h1 className="text-3xl font-bold">Bienvenue sur SamaDiabète</h1>
                <p className="text-lg mt-2">
                    Votre allié pour mieux comprendre et gérer le diabète au quotidien.
                </p>
                <div className="mt-6 flex justify-center">
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-6 w-full max-w-2xl">
                <section className="bg-blue-100 p-4 rounded-lg shadow w-full">
                    <h2 className="text-xl font-semibold mb-2">🎥 Découvrir le diabète</h2>
                    <p>Accédez à des articles, vidéos et quiz pour mieux comprendre la maladie.</p>
                </section>

                <section className="bg-green-100 p-4 rounded-lg shadow w-full">
                    <h2 className="text-xl font-semibold mb-2">📍 Trouver un centre de santé</h2>
                    <p>Visualisez les hôpitaux, centres ou contacts utiles près de chez vous.</p>
                </section>

                <section className="bg-yellow-100 p-4 rounded-lg shadow w-full">
                    <h2 className="text-xl font-semibold mb-2">🧠 Lire des témoignages</h2>
                    <p>Découvrez les parcours inspirants de patients et médecins engagés.</p>
                </section>
            </main>

            <footer className="text-center p-4 mt-10 text-sm text-gray-500 max-w-2xl w-full">
                <p>🔐 Accès complet réservé aux utilisateurs connectés</p>
            </footer>
        </div>
    );
}
  