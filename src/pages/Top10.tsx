// src/pages/Top10.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Top10() {
  const [tracks, setTracks] = useState<any[]>([]);
  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/spotify/top10`);
        setTracks(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar top 10:", err);
      }
    };
    load();
  }, []);

  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          Top 10 da Semana 🎧
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {tracks.map((t: any) => (
            <div
              key={t.id}
              className="bg-white border rounded-xl shadow-sm p-3 flex flex-col gap-3"
            >
              <img
                src={t.image}
                alt={t.title}
                className="rounded-md w-full h-36 object-cover"
              />
              <div>
                <h3 className="font-medium truncate">{t.title}</h3>
                <p className="text-sm text-gray-500 truncate">{t.artist}</p>
              </div>
              {t.url && (
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-green-600 hover:underline"
                >
                  Spotify
                </a>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
