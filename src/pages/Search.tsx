import { useState } from "react";
import api from "../api";

export default function SearchLyrics() {
  const [query, setQuery] = useState("");
  const [musicas, setMusicas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function buscarMusicas(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setCarregando(true);
    setErro("");
    setMusicas([]);

    try {
      const res = await api.get(`/api/search-lyrics`, { params: { q: query } });
      setMusicas(res.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar músicas.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-green-400 drop-shadow-md">
        🎵 FindMySong
      </h1>
      <p className="text-gray-400 mb-8 text-center">
        Busque uma música pelo trecho da letra
      </p>

      {/* Campo de busca */}
      <form
        onSubmit={buscarMusicas}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite um trecho ou palavra..."
          className="flex-1 p-3 rounded-lg text-black outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          disabled={carregando || !query}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
        >
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {erro && <p className="text-red-400 mt-4">{erro}</p>}

      {/* Resultados */}
      <div className="mt-10 w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {musicas.length === 0 && !carregando && !erro && (
          <p className="text-gray-500 text-center col-span-full">
            Nenhum resultado encontrado.
          </p>
        )}

        {musicas.map((m, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl p-5 shadow-lg hover:shadow-green-800/40 transition duration-300 flex flex-col items-center text-center hover:scale-105"
          >
            {m.image && (
              <img
                src={m.image}
                alt={m.title}
                className="w-40 h-40 rounded-xl object-cover mb-4 border border-gray-700 shadow-inner"
              />
            )}

            <h2 className="text-base font-bold text-white truncate w-full">
              {m.title}
            </h2>
            <p className="text-gray-400 text-sm mb-3 truncate w-full">
              {m.artist}
            </p>

            <div className="flex gap-2 justify-center flex-wrap">
              {m.preview_url && (
                <audio
                  controls
                  src={m.preview_url}
                  className="h-8 w-40 mb-2 rounded-md"
                />
              )}

              {m.spotify_url && (
                <a
                  href={m.spotify_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white text-xs font-semibold transition"
                >
                  Spotify
                </a>
              )}

              {m.genius_url && (
                <a
                  href={m.genius_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md text-black text-xs font-semibold transition"
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
