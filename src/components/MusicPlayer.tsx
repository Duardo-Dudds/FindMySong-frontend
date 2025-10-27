import React from "react";
import { Play, Volume2 } from "lucide-react";

const MusicPlayer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t flex items-center justify-between px-8 shadow-md">
      <div className="flex items-center gap-3">
        <img src="/images/blindinglights.jpg" alt="Blinding Lights" className="w-14 h-14 rounded-md" />
        <div>
          <h3 className="font-medium">Blinding Lights</h3>
          <p className="text-sm text-gray-500">The Weeknd</p>
        </div>
      </div>

      <button
        onClick={() => window.open("https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b", "_blank")}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium"
      >
        <Play size={18} /> Listen on Spotify
      </button>

      <div className="flex items-center gap-2 text-gray-500">
        <Volume2 size={18} />
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="w-16 h-2 bg-green-600"></div>
        </div>
      </div>
    </footer>
  );
};

export default MusicPlayer;
