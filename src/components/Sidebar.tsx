import React from "react";
import { Home, Search, Library, PlusSquare, Heart } from "lucide-react";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col p-4">
      <h1 className="text-2xl font-semibold mb-8">FindMySong</h1>

      <nav className="flex flex-col gap-4">
        <a href="/home" className="flex items-center gap-3 text-black font-medium hover:text-green-600">
          <Home size={20} /> Home
        </a>
        <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
          <Search size={20} /> Search
        </a>
        <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
          <Library size={20} /> Your Library
        </a>
      </nav>

      <div className="mt-8 flex flex-col gap-4">
        <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
          <PlusSquare size={20} /> Create Playlist
        </a>
        <a href="#" className="flex items-center gap-3 text-gray-600 hover:text-green-600">
          <Heart size={20} /> Liked Songs
        </a>
      </div>

      <div className="mt-auto pt-8 text-sm text-gray-500">
        <p className="mb-2">Liked Songs — 127</p>
        <p>Chill Vibes — 38</p>
      </div>
    </aside>
  );
};

export default Sidebar;
