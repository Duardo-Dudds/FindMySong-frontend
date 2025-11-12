import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import ProfileAvatar from "@/components/ProfileAvatar";
import { Play } from "lucide-react";
import FeedbackForm from "@/components/FeedbackForm";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

// Interface da Track
interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
  external_urls?: { spotify?: string };
  preview_url?: string | null;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [buscaConcluida, setBuscaConcluida] = useState(false);

  const { playTrack } = useMusicPlayer();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined") {
      window.location.href = "/login";
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    } catch (err) {
      console.error("Token inválido:", err);
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!userId) return;
    axios
      .get(`${API_BASE}/api/likes/${userId}`)
      .then((res) => setLiked(res.data.map((m: any) => m.spotify_id)))
      .catch(() => console.log("Erro ao carregar curtidas"));
  }, [userId]);

  async function buscar() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/spotify/search`, {
        params: { q: query, market: "BR" },
      });
      const data: Track[] = Array.isArray(res.data)
        ? res.data
        : res.data.tracks?.items || [];
      setResults(data);
      setBuscaConcluida(true);
    } catch (err) {
      console.error("Erro ao buscar músicas:", err);
      alert("Erro ao buscar músicas.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleLike(track: Track) {
    if (!userId) {
      alert("Faça login para curtir músicas.");
      return;
    }
    const jaCurtiu = liked.includes(track.id);
    try {
      if (jaCurtiu) {
        await axios.delete(`${API_BASE}/api/likes/${track.id}/${userId}`);
        setLiked(liked.filter((id) => id !== track.id));
      } else {
        await axios.post(`${API_BASE}/api/likes`, {
          usuario_id: userId,
          spotify_id: track.id,
          titulo: track.name,
          artista: track.artists?.[0]?.name,
          imagem: track.album?.images?.[0]?.url,
          url: track.external_urls?.spotify,
        });
        setLiked([...liked, track.id]);
      }
    } catch (err) {
      console.error("Erro ao atualizar curtida:", err);
    }
  }

  // Renderização da página
  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            Explore músicas 🎵
          </h2>
          <ProfileAvatar />
        </div>

        <div className="mb-8 flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por música, artista ou letra..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setBuscaConcluida(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && buscar()}
            className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={buscar}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Buscar
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Buscando músicas...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-400">
            Digite algo acima para pesquisar no Spotify.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((m) => (
              <div
                key={m.id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col gap-3"
              >
                <div className="relative group">
                  <img
                    src={m.album?.images?.[0]?.url}
                    alt={m.name}
                    className="rounded-md w-full h-36 object-cover"
                  />

                  <button
                    onClick={() => {
                      if (m.preview_url) {
                        playTrack(m);
                      } else {
                        window.open(m.external_urls?.spotify, "_blank");
                        alert("Essa música não tem preview disponível.");
                      }
                    }}
                    className="absolute inset-0 flex items-center justify-center w-12 h-12 m-auto
                               bg-green-500 text-white rounded-full
                               opacity-0 group-hover:opacity-100 
                               hover:scale-110 transition-all"
                  >
                    <Play size={20} />
                  </button>
                </div>

                <div>
                  <h3 className="font-medium truncate">{m.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {m.artists?.[0]?.name}
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleLike(m)}
                    className={`heart-icon ${
                      liked.includes(m.id) ? "active" : ""
                    }`}
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
        )}

        {buscaConcluida && results.length > 0 && (
          <FeedbackForm query={query} />
        )}
      </main>
    </div>
  );
}