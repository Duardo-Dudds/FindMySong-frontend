import { useState } from "react";
import axios from "axios";

export default function SearchLyrics() {
  const [query, setQuery] = useState("");
  const [musicas, setMusicas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setErro("");
      const res = await axios.get(`${apiBaseUrl}/api/search-lyrics?q=${encodeURIComponent(query)}`);
      setMusicas(res.data);
    } catch (err: any) {
      console.error("Erro ao buscar músicas:", err);
      setErro("Erro ao buscar músicas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">Buscar Música por Letra 🎶</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-6 w-full max-w-md">
        <input
          type="text"
          placeholder="Digite parte da letra ou nome..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-2 rounded text-black"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 rounded font-semibold"
        >
          Buscar
        </button>
      </form>

      {loading && <p>Carregando...</p>}
      {erro && <p className="text-red-400">{erro}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {musicas.map((m, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-lg shadow-md">
            {m.image && <img src={m.image} alt={m.title} className="rounded mb-3" />}
            <h2 className="text-xl font-semibold">{m.title}</h2>
            <p className="text-gray-400 mb-3">{m.artist}</p>

            {m.preview_url && (
              <audio controls src={m.preview_url} className="w-full mb-3" />
            )}

            <div className="flex gap-2">
              {m.spotify_url && (
                <a
                  href={m.spotify_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                >
                  Abrir no Spotify
                </a>
              )}
              {m.genius_url && (
                <a
                  href={m.genius_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-sm text-black font-semibold"
                >
                  Ver Letra
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
