import { useState } from "react";
import axios from "axios";

interface Musica {
  title: string;
  artist: string;
  image?: string;
  spotify_url?: string;
  genius_url?: string;
  preview_url?: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  async function buscarMusicas(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setCarregando(true);
    setErro("");
    setMusicas([]);

    try {
      const res = await axios.get(
        `${apiBaseUrl}/api/search-lyrics?q=${encodeURIComponent(query)}`
      );
      setMusicas(res.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar músicas. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-400">🔎 Buscar Músicas</h1>
      <p className="text-gray-400 mb-8 text-center max-w-lg">
        Digite uma palavra, trecho da letra ou nome do artista para encontrar músicas.
      </p>

      <form
        onSubmit={buscarMusicas}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: love, saudade, Justin Bieber..."
          className="flex-1 p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={carregando || !query}
          className="bg-blue-500 hover:bg-blue-600 px-5 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {erro && <p className="text-red-400 mt-6">{erro}</p>}

      {/* Resultados */}
      <div className="mt-10 w-full max-w-5xl grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {musicas.length === 0 && !carregando && !erro && (
          <p className="text-gray-400 text-center col-span-full">
            Nenhum resultado encontrado.
          </p>
        )}

        {musicas.map((m, i) => (
          <div
            key={i}
            className="bg-[#1a1a1a] rounded-2xl p-4 shadow-lg hover:bg-[#222] transition-all flex flex-col items-center text-center"
          >
            {m.image ? (
              <img
                src={m.image}
                alt={m.title}
                className="w-40 h-40 rounded-lg object-cover mb-3"
              />
            ) : (
              <div className="w-40 h-40 bg-gray-700 rounded-lg mb-3 flex items-center justify-center text-gray-400">
                🎵
              </div>
            )}
            <h2 className="text-base font-semibold">{m.title}</h2>
            <p className="text-sm text-gray-400 mb-3">{m.artist}</p>

            <div className="flex gap-2 flex-wrap justify-center">
              {m.preview_url && (
                <audio
                  controls
                  src={m.preview_url}
                  className="w-36 h-8 mb-2 rounded-md"
                />
              )}

              {m.spotify_url && (
                <a
                  href={m.spotify_url}
                  target="_blank"
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm font-medium text-white"
                >
                  Spotify
                </a>
              )}

              {m.genius_url && (
                <a
                  href={m.genius_url}
                  target="_blank"
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm font-medium text-white"
                >
                  Letra
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
