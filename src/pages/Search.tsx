// src/pages/Search.tsx
import { useState } from "react";
import axios from "axios";
import { Play } from "lucide-react";
import Sidebar from "../components/Sidebar";
import ProfileAvatar from "../components/ProfileAvatar";

export default function Search() {
  const [query, setQuery] = useState("");
  const [musicas, setMusicas] = useState<any[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [nota, setNota] = useState<number | null>(null);
  const [comentario, setComentario] = useState("");
  const [feedbackEnviado, setFeedbackEnviado] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  async function buscarMusicas(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setCarregando(true);

    try {
      const res = await axios.get(`${apiBaseUrl}/api/spotify/search`, {
        params: { q: query },
      });
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.tracks?.items || [];
      setMusicas(data);
      setFeedbackEnviado(false);
    } catch (err) {
      console.error("Erro ao buscar músicas:", err);
    } finally {
      setCarregando(false);
    }
  }

  function toggleLike(id: string) {
    setLiked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function enviarFeedback() {
    if (!nota) {
      alert("Selecione uma nota de 1 a 5.");
      return;
    }
    try {
      await axios.post(`${apiBaseUrl}/api/feedback`, {
        query,
        nota,
        comentario,
      });
      setFeedbackEnviado(true);
      setNota(null);
      setComentario("");
    } catch (err) {
      console.error("Erro ao enviar feedback:", err);
      alert("Erro ao enviar feedback.");
    }
  }

  return (
    <div className="flex bg-white text-gray-800 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Buscar músicas 🔎</h2>

        <form onSubmit={buscarMusicas} className="mb-10 flex items-center">
          <input
            type="text"
            placeholder="Digite nome, artista ou palavra..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="ml-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Buscar
          </button>
        </form>

        {carregando ? (
          <p className="text-gray-500">Buscando...</p>
        ) : musicas.length === 0 ? (
          <p className="text-gray-400">Nenhuma música encontrada.</p>
        ) : (
          <>
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
                    <button
                      onClick={() => toggleLike(m.id)}
                      className={`heart-icon ${liked.includes(m.id) ? "active" : ""}`}
                      title="Curtir"
                    >
                      ♥
                    </button>
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

            {/* Bloco de feedback */}
            <div className="mt-10 bg-gray-50 border rounded-lg p-5 shadow-sm max-w-2xl">
              <h3 className="font-semibold text-lg mb-3">
                Avalie a precisão da busca 🎧
              </h3>
              {feedbackEnviado ? (
                <p className="text-green-600">Obrigado pelo feedback! 💚</p>
              ) : (
                <>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNota(n)}
                        className={`px-3 py-1 rounded-full border transition ${
                          nota === n
                            ? "bg-green-600 text-white"
                            : "bg-white border-gray-300 hover:bg-green-100"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="Deixe um comentário (opcional, até 500 caracteres)"
                    maxLength={500}
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={3}
                  />
                  <div className="flex justify-end gap-3 mt-3">
                    <button
                      onClick={() => {
                        setNota(null);
                        setComentario("");
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={enviarFeedback}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      Enviar
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
