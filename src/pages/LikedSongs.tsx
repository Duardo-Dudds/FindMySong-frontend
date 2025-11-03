// src/pages/LikedSongs.tsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function LikedSongs() {
  const [songs, setSongs] = useState<any[]>([]);
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  useEffect(() => {
    const likedIds = JSON.parse(localStorage.getItem("likedSongs") || "[]") as string[];
    if (likedIds.length === 0) {
      setSongs([]);
      return;
    }

    // vamos só buscar no spotify um por um (simples por enquanto)
    const load = async () => {
      const arr: any[] = [];
      for (const id of likedIds) {
        try {
          const res = await axios.get(`${API_BASE}/api/spotify/search`, {
            params: { q: id },
          });
          const item = Array.isArray(res.data)
            ? res.data[0]
            : res.data.tracks?.items?.[0];
          if (item) arr.push(item);
        } catch {}
      }
      setSongs(arr);
    };

    load();
  }, []);

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-semibold mb-6">Músicas curtidas ❤️</h2>

        {songs.length === 0 ? (
          <p className="text-gray-400">Você ainda não curtiu nenhuma música.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {songs.map((m: any) => (
              <div key={m.id} className="bg-white border rounded-xl p-3 shadow-sm">
                <img
                  src={m.album?.images?.[0]?.url}
                  alt={m.name}
                  className="rounded-md w-full h-36 object-cover mb-2"
                />
                <h3 className="font-medium truncate">{m.name}</h3>
                <p className="text-sm text-gray-500 truncate">
                  {m.artists?.[0]?.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
