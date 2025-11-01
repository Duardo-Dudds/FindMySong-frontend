import { useState } from "react";
import axios from "axios";

export default function Search() {
  // Estados principais
  const [query, setQuery] = useState(""); // termo de busca digitado
  const [musicas, setMusicas] = useState<any[]>([]); // resultados vindos do backend
  const [carregando, setCarregando] = useState(false); // controla o "Buscando..."
  const [erro, setErro] = useState(""); // armazena mensagem de erro se houver

  // URL base do backend (Render)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  // Função principal de busca
  async function buscarMusicas(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    setMusicas([]);

    try {
      // Faz requisição pro backend
      const res = await axios.get(
        `${apiBaseUrl}/api/search-lyrics?q=${encodeURIComponent(query)}`
      );
      setMusicas(res.data || []);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar músicas.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-6 text-green-400">FindMySong</h1>
      <p className="text-gray-300 mb-8">Busque uma música pelo trecho da letra</p>

      {/* Formulário de busca */}
      <form
        onSubmit={buscarMusicas}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite um trecho ou palavra..."
          className="flex-1 p-3 rounded text-black"
        />
        <button
          type="submit"
          disabled={carregando || !query}
          className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded font-semibold transition disabled:opacity-50"
        >
          {carregando ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {/* Mostra erro, se houver */}
      {erro && <p className="text-red-400 mt-4">{erro}</p>}

      {/* Resultados */}
      <div className="mt-10 w-full max-w-6xl grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Nenhum resultado */}
        {musicas.length === 0 && !carregando && !erro && (
          <p className="text-gray-400 text-center col-span-full">
            Nenhum resultado encontrado.
          </p>
        )}

        {/* Renderiza resultados */}
        {musicas.map((m, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-transform flex flex-col items-center text-center"
          >
            {/* Imagem do álbum */}
            {m.image && (
              <img
                src={m.image}
                alt={m.title}
                className="w-48 h-48 rounded-xl object-cover mb-4 shadow-md"
              />
            )}

            {/* Nome e artista */}
            <h2 className="text-lg font-bold text-white">{m.title}</h2>
            <p className="text-gray-400 mb-3">{m.artist}</p>

            {/* Preview + links */}
            <div className="flex flex-wrap justify-center gap-3">
              {m.preview_url && (
                <audio controls src={m.preview_url} className="w-44 h-8" />
              )}

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
