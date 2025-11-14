// src/pages/CreatePlaylist.tsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

interface PlaylistForm {
  nome: string;
  descricao: string;
}

export default function CreatePlaylist() {
  const [userId, setUserId] = useState<number | null>(null);
  const [form, setForm] = useState<PlaylistForm>({
    nome: "",
    descricao: "",
  });
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  // pega o id do usuário logado do token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserId(payload.id);
    } catch {
      console.warn("Token inválido");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setMensagem("Você precisa estar logado para criar playlists.");
      return;
    }
    if (!form.nome.trim()) {
      setMensagem("Digite um nome para a playlist.");
      return;
    }

    try {
      setCarregando(true);
      setMensagem("");

      // por enquanto só fazemos um POST de exemplo
      // quando o backend tiver a rota /api/playlists, é só ligar aqui
      console.log("Criar playlist ->", {
        usuario_id: userId,
        ...form,
      });

      // simulando sucesso
      setMensagem("Playlist criada (simulado). Integração com o backend vem em seguida.");
      setForm({ nome: "", descricao: "" });
    } catch (err) {
      console.error("Erro ao criar playlist:", err);
      setMensagem("Erro ao criar playlist.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex h-screen bg-white text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-2">Create Playlist</h2>
        <p className="text-gray-500 mb-8 text-sm">
          Crie uma playlist personalizada para organizar suas músicas favoritas.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-lg bg-white border rounded-2xl shadow-sm p-6 flex flex-col gap-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              Nome da playlist
            </label>
            <input
              type="text"
              value={form.nome}
              onChange={(e) =>
                setForm((f) => ({ ...f, nome: e.target.value }))
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ex: Músicas para estudar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Descrição (opcional)
            </label>
            <textarea
              value={form.descricao}
              onChange={(e) =>
                setForm((f) => ({ ...f, descricao: e.target.value }))
              }
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              rows={3}
              placeholder="Ex: Só as favoritas para focar no trabalho..."
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
          >
            {carregando ? "Criando..." : "Criar playlist"}
          </button>

          {mensagem && (
            <p className="text-sm text-gray-600 mt-2">{mensagem}</p>
          )}
        </form>
      </main>
    </div>
  );
}
