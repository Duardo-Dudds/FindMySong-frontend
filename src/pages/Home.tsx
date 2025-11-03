// src/pages/Home.tsx
import { useState } from "react";
import axios from "axios";
import { Play } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [musicas, setMusicas] = useState<any[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  async function buscarMusicas() {
    if (!query.trim()) return;
    setCarregando(true);

    try {
      // VOLTOU PRO SPOTIFY
      const res = await axios.get(`${apiBaseUrl}/api/spotify/search`, {
        params: { q: query },
      });

      // no backend você tá mandando direto os items, mas pra garantir:
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.tracks?.items || [];

      setMusicas(data);
    } catch (err) {
      console.error("Erro ao buscar músicas:", err);
      alert("Erro ao buscar músicas.");
    } finally {
      setCarregando(false);
    }
  }

  function toggleLike(id: string) {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      {/* sidebar fixa */}
      <Sidebar />

      {/* conteúdo principal */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* título */}
        <h2 className="text-2xl font-semibold mb-8">Explore músicas 🎵</h2>

        {/* barra de busca */}
        <div className="mb-10 flex items-center">
          <input
            type="text"
            placeholder="Digite uma palavra da letra ou nome da música..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={buscarMusicas}
            className="ml-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Buscar
          </button>
        </div>

        {/* resultados */}
        {carregando ? (
          <p className="text-gray-500">Carregando músicas...</p>
        ) : musicas.length === 0 ? (
          <p className="text-gray-400">
            Faça uma busca para ver os resultados.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {musicas.map((m: any) => (
              <div
                key={m.id}
                className="group bg-white p-3 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={m.album?.images?.[0]?.url}
                    alt={m.name}
                    className="rounded-lg w-full h-44 object-cover mb-3 group-hover:opacity-90"
                  />
                  {/* botão de play no hover */}
                  <button
                    onClick={() => {
                      if (m.preview_url) {
                        const audio = new Audio(m.preview_url);
                        audio.play();
                      } else if (m.external_urls?.spotify) {
                        window.open(m.external_urls.spotify, "_blank");
                      }
                    }}
                    className="absolute bottom-3 right-3 bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Play size={18} />
                  </button>
                </div>

                <h4 className="font-medium truncate">{m.name}</h4>
                <p className="text-sm text-gray-600 truncate">
                  {m.artists?.[0]?.name}
                </p>

                <div className="flex justify-between items-center mt-3">
                  {/* like */}
                  <button
                    onClick={() => toggleLike(m.id)}
                    className={`text-lg transition ${
                      liked.includes(m.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                    title="Curtir"
                  >
                    ♥
                  </button>

                  {/* abrir no spotify */}
                  {m.external_urls?.spotify && (
                    <a
                      href={m.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-green-600 hover:underline"
                    >
                      Spotify
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
