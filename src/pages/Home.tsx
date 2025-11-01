import { useState } from "react";
import { Play } from "lucide-react";
import api from "../api";

const Home = () => {
  const [query, setQuery] = useState("");
  const [musicas, setMusicas] = useState([]);

  // 🎵 Buscar músicas via backend
  async function buscarMusicas() {
    if (!query.trim()) return;
    try {
      // Agora usamos o backend Render — ele já cuida do token
      const response = await api.get("/api/spotify/search", {
        params: { q: query },
      });

      setMusicas(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar músicas:", error);
      alert("Erro ao buscar músicas no servidor.");
    }
  }

  // 💿 Albuns fixos (padrão na tela)
  const albunsFixos = [
    {
      id: 1,
      title: "After Hours",
      artist: "The Weeknd",
      year: "2020",
      songs: "14 songs",
      image: "/albums/afterhours.jpg",
      link: "https://open.spotify.com/album/4yP0hdKOZPNshQKyRv6AL9",
    },
    {
      id: 2,
      title: "SOUR",
      artist: "Olivia Rodrigo",
      year: "2021",
      songs: "11 songs",
      image: "/albums/sour.jpg",
      link: "https://open.spotify.com/album/6s84u2TUpR3wdUv4NgKA2j",
    },
    {
      id: 3,
      title: "Future Nostalgia",
      artist: "Dua Lipa",
      year: "2020",
      songs: "11 songs",
      image: "/albums/futurenostalgia.jpg",
      link: "https://open.spotify.com/album/5lKlFlReHOLShQKyRv6AL9",
    },
    {
      id: 4,
      title: "Midnights",
      artist: "Taylor Swift",
      year: "2022",
      songs: "13 songs",
      image: "/albums/midnights.jpg",
      link: "https://open.spotify.com/album/151w1FgRZfnKZA9FEcg9Z3",
    },
  ];

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-4">FindMySong</h1>

        <nav className="flex flex-col gap-3 flex-grow">
          {["Home", "Search", "Your Library", "Create Playlist", "Liked Songs"].map((item) => (
            <button
              key={item}
              className="text-left px-3 py-2 hover:bg-gray-200 rounded-md transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* 🚪 Botão de sair */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition"
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Explore músicas 🎵</h2>
        </div>

        {/* Campo de busca */}
        <div className="mb-10 flex items-center">
          <input
            type="text"
            placeholder="Digite uma palavra da letra ou nome da música..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={buscarMusicas}
            className="ml-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow"
          >
            Buscar
          </button>
        </div>

        {/* Albuns fixos */}
        <h3 className="text-lg font-semibold mb-4">Recomendações</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {albunsFixos.map((album) => (
            <div
              key={album.id}
              className="group bg-white p-3 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
              onClick={() => window.open(album.link, "_blank")}
            >
              <div className="relative">
                <img
                  src={album.image}
                  alt={album.title}
                  className="rounded-lg w-full h-44 object-cover mb-3 group-hover:opacity-90"
                />
                <button className="absolute bottom-3 right-3 bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <Play size={18} />
                </button>
              </div>
              <h4 className="font-medium">{album.title}</h4>
              <p className="text-sm text-gray-600">{album.artist}</p>
              <p className="text-xs text-gray-500">
                {album.year} • {album.songs}
              </p>
            </div>
          ))}
        </div>

        {/* Resultados Spotify */}
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {musicas.map((m: any) => (
            <div
              key={m.id}
              className="group bg-white p-3 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer"
              onClick={() => window.open(m.external_urls.spotify, "_blank")}
            >
              <div className="relative">
                <img
                  src={m.album.images[0]?.url}
                  alt={m.name}
                  className="rounded-lg w-full h-44 object-cover mb-3 group-hover:opacity-90"
                />
                <button className="absolute bottom-3 right-3 bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition">
                  <Play size={18} />
                </button>
              </div>
              <h4 className="font-medium truncate">{m.name}</h4>
              <p className="text-sm text-gray-600">{m.artists[0]?.name}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
