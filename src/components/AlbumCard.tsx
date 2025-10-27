import React from "react";

interface AlbumCardProps {
  title: string;
  artist: string;
  year: string;
  cover: string;
  songs: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ title, artist, year, cover, songs }) => {
  return (
    <div className="cursor-pointer hover:scale-105 transition-transform">
      <img src={cover} alt={title} className="rounded-xl shadow-lg mb-3 w-full h-48 object-cover" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{artist}</p>
      <p className="text-xs text-gray-400">{year} • {songs}</p>
    </div>
  );
};

export default AlbumCard;
