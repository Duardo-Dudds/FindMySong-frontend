import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: { images?: { url: string }[] };
  preview_url?: string | null;
}

// Contexto função
interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
}

// Contexto
const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

// Provedor App
export const MusicPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Efeito para lidar com a troca de música
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (currentTrack && currentTrack.preview_url) {
      audioRef.current.src = currentTrack.preview_url;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  // Função para começar a tocar uma música (chamada pelo botão Play)
  const playTrack = (track: Track) => {
    // Se for a mesma música, apenas pausa/continua
    if (currentTrack?.id === track.id) {
      togglePlayPause();
    } else {
      // Se for música nova, toca
      setCurrentTrack(track);
    }
  };

  // Função para o botão de Play/Pause do player principal
  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <MusicPlayerContext.Provider
      value={{ currentTrack, isPlaying, playTrack, togglePlayPause }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};

// Hook customizado para usar o player em qualquer componente
export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
};