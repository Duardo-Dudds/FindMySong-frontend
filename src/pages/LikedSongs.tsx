import { useEffect, useState } from "react";
import axios from "axios";

interface Track {
  spotify_id: string;
  titulo: string;
  artista: string;
  imagem: string;
  url: string;
}

export default function LikedSongs() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://findmysong-backend.onrender.com";

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    } catch {
      console.warn("Token inválido.");
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchLiked = async () => {
      try {
        const resp = await axios.get(`${API_URL}/api/likes/${userId}`);
        setTracks(resp.data);
      } catch (err) {
        console.error("Erro ao carregar curtidas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, [userId]);

  const removeLike = async (spotify_id: string) => {
    if (!userId) return;
    try {
      await axios.delete(`${API_URL}/api/likes/${spotify_id}/${userId}`);
      setTracks(tracks.filter((t) => t.spotify_id !== spotify_id));
    } catch (err) {
      console.error("Erro ao remover curtida:", err);
    }
  };

  return (
    <div className="p-8 bg-[#0a0a0a] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-red-400">Músicas Curtidas ❤️</h1>

      {loading ? (
        <p className="text-gray-400">Carregando suas músicas curtidas...</p>
      ) : tracks.length === 0 ? (
        <p className="text-gray-500">Nenhuma música curtida ainda 😢</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <div
              key={track.spotify_id}
              className="bg-[#1a1a1a] rounded-2xl p-4 hover:bg-[#222] transition-all shadow-lg"
            >
              <img
                src={track.imagem}
                alt={track.titulo}
                className="rounded-xl mb-3"
              />
              <h2 className="font-semibold text-sm">{track.titulo}</h2>
              <p className="text-xs text-gray-400">{track.artista}</p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => removeLike(track.spotify_id)}
                  className="text-sm text-red-400 hover:text-red-500"
                >
                  Remover ❤️
                </button>
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-500"
                >
                  Ouvir 🔗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
