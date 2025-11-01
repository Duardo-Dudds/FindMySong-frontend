import React from "react";
import { Home, Search, Library, PlusSquare, Heart, LogOut } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-[#0a0a0a] border-r border-gray-800 flex flex-col p-6 text-white">
      <h1 className="text-2xl font-bold mb-10 text-blue-400">FindMySong</h1>

      <nav className="flex flex-col gap-5">
        <a
          href="/home"
          className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-colors"
        >
          <Home size={20} /> Home
        </a>

        <a
          href="/search"
          className="flex items-center gap-3 text-gray-300 hover:text-purple-400 transition-colors"
        >
          <Search size={20} /> Search
        </a>

        <a
          href="/library"
          className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors"
        >
          <Library size={20} /> Your Library
        </a>

        <a
          href="/liked"
          className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition-colors"
        >
          <Heart size={20} /> Liked Songs
        </a>

        <a
          href="#"
          className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition-colors"
        >
          <PlusSquare size={20} /> Create Playlist
        </a>
      </nav>

      {/* Rodapé */}
      <div className="mt-auto pt-10 border-t border-gray-800">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="flex items-center gap-3 text-gray-400 hover:text-red-500 transition"
        >
          <LogOut size={20} /> Sair
        </button>

        <div className="mt-6 text-xs text-gray-600">
          <p className="mb-1">© 2025 FindMySong</p>
          <p>PUC Minas – Barreiro</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
