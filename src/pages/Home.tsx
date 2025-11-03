import { useEffect, useState } from "react";
import axios from "axios";

interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [library, setLibrary] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 👤 ID do usuário logado (vem do token)
  const [userId, setUserId] = useState<number | null>(null);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "https://findmysong-backend.onrender.com";

  // ====================================
  // 🔹 Decodifica token JWT para pegar ID
  // ====================================
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

  // ====================================
  // 🔹 Busca Top 10 do Spotify
  // ====================================
  useEffect(() => {
    const fetchTop10 = async () => {
      try {
        setLoading(true);
        const resp = await axios.get(`${API_URL}/api/spotify/top10`);
        setTracks(resp.data);
      } catch (err) {
        console.error("Erro ao buscar Top 10:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop10();
  }, []);

  // ====================================
  // 🔹 Busca curtidas e biblioteca do usuário
  // ====================================
  useEffect(() => {
    if (!userId) return;
    const loadUserData = async () => {
      try {
        const likesResp = await axios.get(`${API_URL}/api/likes/${userId}`);
        const libResp = await axios.get(`${API_URL}/api/library/${userId}`);

        setLiked(likesResp.data.map((m: any) => m.spotify_id));
        setLibrary(libResp.data.map((m: any) => m.spotify_id));
      } catch (err) {
        console.error("Erro ao carregar curtidas/biblioteca:", err);
      }
    };
    loadUserData();
  }, [userId]);

  // ====================================
  // ❤️ Curtir / Descurtir
  // ====================================
  const toggleLike = async (track: Track) => {
    if (!userId) return alert("Faça login primeiro!");
    const isLiked = liked.includes(track.id);

    try {
      if (isLiked) {
        await axios.delete(`${API_URL}/api/likes/${track.id}/${userId}`);
        setLiked(liked.filter((id) => id !== track.id));
      } else {
        await axios.post(`${API_URL}/api/likes`, {
          usuario_id: userId,
          spotify_id: track.id,
          titulo: track.title,
          artista: track.artist,
          imagem: track.image,
          url: track.url,
        });
        setLiked([...liked, track.id]);
      }
    } catch (err) {
      console.error("Erro ao atualizar curtida:", err);
    }
  };

  // ====================================
  // ➕ Adicionar / Remover da biblioteca
  // ====================================
  const toggleLibrary = async (track: Track) => {
    if (!userId) return alert("Faça login primeiro!");
    const inLibrary = library.includes(track.id);

    try {
      if (inLibrary) {
        await axios.delete(`${API_URL}/api/library/${track.id}/${userId}`);
        setLibrary(library.filter((id) => id !== track.id));
      } else {
        await axios.post(`${API_URL}/api/library`, {
          usuario_id: userId,
          spotify_id: track.id,
          titulo: track.title,
          artista: track.artist,
          imagem: track.image,
          url: track.url,
        });
        setLibrary([...library, track.id]);
      }
    } catch (err) {
      console.error("Erro ao atualizar biblioteca:", err);
    }
  };

  // ====================================
  // 🎨 Renderização
  // ====================================
  return (
    <div className="p-8 text-white bg-[#0a0a0a] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Top 10 do Spotify 🎵</h1>

      {loading ? (
        <p className="text-gray-400">Carregando músicas...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-[#1a1a1a] rounded-2xl p-4 shadow-lg hover:bg-[#222] transition-all"
            >
              <img
                src={track.image}
                alt={track.title}
                className="rounded-xl mb-3"
              />
              <h2 className="font-semibold text-sm">{track.title}</h2>
              <p className="text-xs text-gray-400">{track.artist}</p>

              <div className="flex justify-between mt-3">
                {/* Botão Like */}
                <button
                  onClick={() => toggleLike(track)}
                  className={`text-lg ${
                    liked.includes(track.id)
                      ? "text-red-500"
                      : "text-gray-400 hover:text-red-400"
                  }`}
                  title="Curtir"
                >
                  ❤️
                </button>

                {/* Botão Adicionar à Biblioteca */}
                <button
                  onClick={() => toggleLibrary(track)}
                  className={`text-lg ${
                    library.includes(track.id)
                      ? "text-green-400"
                      : "text-gray-400 hover:text-green-400"
                  }`}
                  title="Adicionar à biblioteca"
                >
                  ➕
                </button>

                {/* Abrir no Spotify */}
                <a
                  href={track.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 text-lg"
                  title="Ouvir no Spotify"
                >
                  🔗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
