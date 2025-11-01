import { useState } from "react";
import axios from "axios";

export default function Search() {
  // estados principais
  const [query, setQuery] = useState("");
  const [musicas, setMusicas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // base do backend (Render)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // função que busca músicas
  async function buscarMusicas(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setMusicas([]);

    try {
      const res = await axios.get(`${apiBaseUrl}/api/search-lyrics?q=${encodeURIComponent(query)}`);
      setMusicas(res.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar músicas. Tente novamente mais tarde.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-green-400">FindMySong</h1>
      <p className="text-gray-300 mb-8 text-center">
        Busque músicas por nome, artista ou trecho da letra
      </p>

      {/* campo de busca */}
      <form onSubmit={buscarMusicas} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite o nome ou trecho da música..."
          className="flex-1 p-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-500"
          tabIndex={1}
        />
        <button
          type="submit"
          disabled={carregando || !query}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold transition disabled:opacity-50"
        >
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {erro && <p className="text-red-400 mt-4">{erro}</p>}

      {/* lista de resultados */}
      <div className="mt-10 w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!carregando && musicas.length === 0 && !erro && (
          <p className="text-gray-400 col-span-full text-center">
            Nenhum resultado encontrado.
          </p>
        )}

        {musicas.map((m, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:scale-[1.02] transition-transform"
          >
            {/* capa do álbum */}
            {m.image && (
              <img
                src={m.image}
                alt={m.title}
                className="w-full h-56 object-cover"
              />
            )}

            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-bold text-white truncate">{m.title}</h2>
              <p className="text-gray-400 text-sm">{m.artist}</p>

              {/* preview da música */}
              {m.preview_url && (
                <audio controls src={m.preview_url} className="w-full mt-2" />
              )}

              {/* links */}
              <div className="flex flex-wrap gap-2 mt-3">
                {m.spotify_url && (
                  <a
                    href={m.spotify_url}
                    target="_blank"
                    className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-white text-sm"
                  >
                    Spotify
                  </a>
                )}

                {m.genius_url && (
                  <a
                    href={m.genius_url}
                    target="_blank"
                    className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white text-sm"
                  >
                    Letra (Genius)
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
