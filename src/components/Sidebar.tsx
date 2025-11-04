// src/components/Sidebar.tsx
import React from "react";
import {
  Home,
  Music2,
  Library,
  PlusSquare,
  Heart,
  LogOut,
} from "lucide-react";

const Sidebar: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col p-4">
      <h1 className="text-2xl font-semibold mb-8 text-black">FindMySong</h1>

      <nav className="flex flex-col gap-4 text-gray-700">
        <a
          href="/home"
          className="flex items-center gap-3 font-medium hover:text-green-600"
        >
          <Home size={20} /> Home
        </a>
        <a
          href="/top10"
          className="flex items-center gap-3 font-medium hover:text-green-600"
        >
          <Music2 size={20} /> Top 10 da Semana
        </a>
        <a
          href="/library"
          className="flex items-center gap-3 font-medium hover:text-green-600"
        >
          <Library size={20} /> Your Library
        </a>
        <a
          href="/likedsongs"
          className="flex items-center gap-3 font-medium hover:text-green-600"
        >
          <Heart size={20} /> Liked Songs
        </a>
      </nav>

      <div className="mt-8 flex flex-col gap-4 text-gray-700">
        <a
          href="#"
          className="flex items-center gap-3 hover:text-green-600"
        >
          <PlusSquare size={20} /> Create Playlist
        </a>
      </div>

      <div className="mt-auto pt-8 text-sm text-gray-500">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 hover:text-red-500"
        >
          <LogOut size={18} /> Sair
        </button>
        <p className="mt-6 text-[11px] text-gray-400">
          © 2025 FindMySong <br />
          PUC Minas - Barreiro
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

