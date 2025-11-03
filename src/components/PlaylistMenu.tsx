// src/components/PlaylistMenu.tsx
import { useState } from "react";
import api from "../api";

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

interface Props {
  track: Track;
  playlists: Playlist[];
  userId: number | null;
}

export default function PlaylistMenu({ track, playlists, userId }: Props) {
  const [open, setOpen] = useState(false);
  const [criando, setCriando] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  async function addToPlaylist(playlistId: number) {
    if (!userId) return alert("Faça login primeiro.");
    try {
      await api.post(`/api/playlists/${playlistId}/musicas`, {
        spotify_id: track.id,
        titulo: track.title,
        artista: track.artist,
        imagem: track.image,
        url: track.url,
      });
      setOpen(false);
    } catch (err) {
      console.error("Erro ao adicionar na playlist:", err);
    }
  }

  async function criarPlaylist() {
    if (!userId) return alert("Faça login primeiro.");
    if (!novoNome.trim()) return;
    try {
      const r = await api.post("/api/playlists", {
        usuario_id: userId,
        nome: novoNome.trim(),
      });
      setNovoNome("");
      setCriando(false);
      // não dá pra atualizar a lista daqui porque ela tá no Home,
      // então só fecha
      setOpen(false);
      console.log("playlist criada", r.data);
    } catch (err) {
      console.error("Erro ao criar playlist:", err);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 hover:text-gray-700"
        title="Opções"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-md w-44 z-20 p-2">
          <p className="text-xs text-gray-500 mb-2">Adicionar à playlist</p>

          {playlists.length === 0 && (
            <p className="text-xs text-gray-400 mb-2">Nenhuma playlist</p>
          )}

          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => addToPlaylist(pl.id)}
              className="w-full text-left text-sm px-2 py-1 rounded hover:bg-gray-100"
            >
              {pl.nome}
            </button>
          ))}

          {!criando ? (
            <button
              onClick={() => setCriando(true)}
              className="w-full text-left text-sm px-2 py-1 rounded bg-green-50 text-green-700 mt-2"
            >
              + Nova playlist
            </button>
          ) : (
            <div className="mt-2 flex flex-col gap-2">
              <input
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Nome da playlist"
                className="border rounded px-2 py-1 text-sm"
              />
              <button
                onClick={criarPlaylist}
                className="bg-green-500 text-white rounded px-2 py-1 text-sm"
              >
                Criar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
