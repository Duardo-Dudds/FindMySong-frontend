// src/components/Sidebar.tsx
import { Home, Library, Heart, PlusSquare, Music2 } from "lucide-react";

export default function Sidebar() {
  return (
    <aside
      className="w-64 h-screen border-r flex flex-col p-4 text-gray-800 bg-white"
      style={{ backgroundColor: "#ffffff" }} // força branco mesmo se tiver css velho
    >
      <h1 className="text-2xl font-semibold mb-8 text-black">FindMySong</h1>

      <nav className="flex flex-col gap-4">
        {/* Home = página com busca */}
        <a
          href="/home"
          className="flex items-center gap-3 text-black font-medium hover:text-green-600"
        >
          <Home size={20} /> Home
        </a>

        {/* Top 10 da Semana -> NOVO item que você pediu */}
        <a
          href="/top10"
          className="flex items-center gap-3 text-gray-700 hover:text-green-600"
        >
          <Music2 size={20} /> Top 10 da Semana
        </a>

        {/* Biblioteca */}
        <a
          href="/library"
          className="flex items-center gap-3 text-gray-600 hover:text-green-600"
        >
          <Library size={20} /> Your Library
        </a>

        {/* Curtidas */}
        <a
          href="/liked"
          className="flex items-center gap-3 text-gray-600 hover:text-green-600"
        >
          <Heart size={20} /> Liked Songs
        </a>
      </nav>

      <div className="mt-8 flex flex-col gap-4">
        <a
          href="/playlists"
          className="flex items-center gap-3 text-gray-600 hover:text-green-600"
        >
          <PlusSquare size={20} /> Create Playlist
        </a>
      </div>

      <div className="mt-auto pt-8 text-xs text-gray-400">
        <p>© 2025 FindMySong</p>
      </div>
    </aside>
  );
}
