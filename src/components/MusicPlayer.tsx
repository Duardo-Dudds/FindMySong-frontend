import { useMusicPlayer } from "@/contexts/MusicPlayerContext.tsx";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";

export default function MusicPlayer() {
  const { currentTrack, isPlaying, togglePlayPause } = useMusicPlayer();

  if (!currentTrack) {
    return null;
  }

  const trackName = currentTrack.name;
  const artistName = currentTrack.artists[0]?.name || "Artista Desconhecido";
  const imageUrl =
    currentTrack.album?.images?.[0]?.url ||
    "https://placehold.co/64x64/22c55e/white?text=🎵";

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 p-4 flex items-center justify-between shadow-lg z-50">
      {/* Infos da Música (Esquerda) */}
      <div className="flex items-center gap-3 w-1/4">
        <img
          src={imageUrl}
          alt={trackName}
          className="w-12 h-12 rounded-md"
        />
        <div>
          <h4 className="font-medium text-sm truncate">{trackName}</h4>
          <p className="text-xs text-gray-500 truncate">{artistName}</p>
        </div>
      </div>

      {/* Controles do Player (Centro) */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-gray-700">
          <SkipBack size={20} />
        </button>
        <button
          onClick={togglePlayPause}
          className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="text-gray-400 hover:text-gray-700">
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume (Direita) */}
      <div className="w-1/4"></div>
    </footer>
  );
}