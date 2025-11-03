// src/pages/Home.tsx
import { useEffect, useState } from "react";
import api from "../api";
import LyricsModal from "../components/LyricsModal";
import PlaylistMenu from "../components/PlaylistMenu";

interface Track {
  id: string;
  title: string;
  artist: string;
  image: string;
  url: string;
  preview_url?: string | null;
}

interface Playlist {
  id: number;
  nome: string;
  descricao?: string;
}

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [library, setLibrary] = useState<string[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  // modal de letra
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsUrl, setLyricsUrl] = useState<string | null>(null);
  const [lyricsTitle, setLyricsTitle] = useState<string>("");

  // usuário logado
  const [userId, setUserId] = useState<number | null>(null);

  // pega user do token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    } catch {
      console.warn("Token inválido");
    }
  }, []);

  // pega top 10
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await api.get("/api/spotify/top10");
        setTracks(resp.data || []);
      } catch (err) {
        console.error("Erro ao buscar top 10:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // carrega likes / library / playlists
  useEffect(() => {
    if (!userId) return;

    const loadUserData = async () => {
      try {
        const [likesResp, libResp, playResp] = await Promise.all([
          api.get(`/api/likes/${userId}`),
          api.get(`/api/library/${userId}`),
          api.get(`/api/playlists/${userId}`),
        ]);

        setLiked(likesResp.data.map((m: any) => m.spotify_id));
        setLibrary(libResp.data.map((m: any) => m.spotify_id));
        setPlaylists(playResp.data);
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    };

    loadUserData();
  }, [userId]);

  // like
  async function toggleLike(track: Track) {
    if (!userId) return alert("Faça login primeiro.");
    const jaCurtiu = liked.includes(track.id);

    try {
      if (jaCurtiu) {
        await api.delete(`/api/likes/${track.id}/${userId}`);
        setLiked(liked.filter((id) => id !== track.id));
      } else {
        await api.post("/api/likes", {
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
      console.error("Erro ao atualizar like:", err);
    }
  }

  // biblioteca
  async function toggleLibrary(track: Track) {
    if (!userId) return alert("Faça login primeiro.");
    const jaTem = library.includes(track.id);

    try {
      if (jaTem) {
        await api.delete(`/api/library/${track.id}/${userId}`);
        setLibrary(library.filter((id) => id !== track.id));
      } else {
        await api.post("/api/library", {
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
  }

  // abrir letra
  function openLyrics(track: Track) {
    // aqui a gente só passa o título pro modal
    setLyricsTitle(`${track.title} – ${track.artist}`);
    // se vier do /api/search-lyrics dá pra passar a URL do Genius
    setLyricsUrl(null);
    setShowLyrics(true);
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* topo */}
      <header className="flex items-center justify-between px-8 py-5 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <h1 className="text-2xl font-bold tracking-tight">FindMySong</h1>
        <nav className="flex gap-4">
          <a href="/home" className="text-green-600 font-medium">
            Início
          </a>
          <a href="/search" className="text-gray-500 hover:text-green-600">
            Buscar
          </a>
          <a href="#" className="text-gray-500 hover:text-green-600">
            Sua biblioteca
          </a>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Sair
        </button>
      </header>

      {/* conteúdo */}
      <main className="flex-1 px-8 py-6">
        <h2 className="text-xl font-semibold mb-1">Top 10 da semana</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Baseado na playlist Top Brasil do Spotify.
        </p>

        {loading ? (
          <p className="text-gray-500">Carregando músicas...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="group bg-white border rounded-2xl p-3 shadow-sm hover:shadow-md transition flex flex-col gap-3 relative"
              >
                {/* 3 pontinhos */}
                <div className="absolute top-2 right-2">
                  <PlaylistMenu
                    track={track}
                    playlists={playlists}
                    userId={userId}
                  />
                </div>

                <img
                  src={track.image}
                  alt={track.title}
                  className="rounded-xl w-full aspect-square object-cover"
                />
                <div>
                  <h3 className="font-semibold text-sm line-clamp-1">
                    {track.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {track.artist}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto gap-2">
                  {/* like */}
                  <button
                    onClick={() => toggleLike(track)}
                    className={`text-lg ${
                      liked.includes(track.id)
                        ? "text-red-500"
                        : "text-gray-400 hover:text-red-400"
                    }`}
                    title="Curtir"
                  >
                    ♥
                  </button>

                  {/* ouvir prévia */}
                  {track.preview_url ? (
                    <audio
                      controls
                      src={track.preview_url}
                      className="h-8 w-24"
                    />
                  ) : (
                    <button
                      onClick={() => openLyrics(track)}
                      className="text-xs text-gray-500 hover:text-green-500"
                    >
                      ver letra
                    </button>
                  )}

                  {/* spotify */}
                  <a
                    href={track.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                  >
                    Spotify
                  </a>

                  {/* add biblioteca */}
                  <button
                    onClick={() => toggleLibrary(track)}
                    className={`text-lg ${
                      library.includes(track.id)
                        ? "text-green-500"
                        : "text-gray-400 hover:text-green-400"
                    }`}
                    title="Adicionar à biblioteca"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* modal de letra */}
      {showLyrics && (
        <LyricsModal
          title={lyricsTitle}
          url={lyricsUrl}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </div>
  );
}

