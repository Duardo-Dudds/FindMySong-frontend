import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar.tsx"; // Corrigido

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [nome, setNome] = useState("");
  const [avatar, setAvatar] = useState("");
  const [mensagem, setMensagem] = useState("");

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      axios
        .get(`${API_BASE}/api/usuarios/profile/${payload.id}`)
        .then((res) => {
          setUser(res.data);
          setNome(res.data.nome);
          setAvatar(res.data.avatar_url || "");
        })
        .catch(() => setMensagem("❌ Erro ao carregar perfil."));
    } catch {
      setMensagem("❌ Erro de autenticação. Faça login novamente.");
    }
  }, []);

  async function salvarPerfil() {
    if (!user) return;
    try {
      await axios.post(`${API_BASE}/api/usuarios/profile/${user.id}`, {
        nome,
        avatar_url: avatar,
      });
      setMensagem("✅ Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao salvar perfil.");
    }
  }

  return (
    
    <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-10 overflow-y-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Meu Perfil 👤</h1>
          {avatar && (
            <img
              src={avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full border shadow"
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md border max-w-md flex flex-col gap-4">
          <label className="font-medium text-sm">Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <label className="font-medium text-sm">URL da Imagem de Perfil</label>
          <input
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="border p-2 rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="https://..."
          />

          {avatar && (
            <img
              src={avatar}
              alt="Preview"
              className="w-24 h-24 rounded-full border mt-2 shadow-sm"
            />
          )}

          <button
            onClick={salvarPerfil}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition"
          >
            Salvar alterações
          </button>

          {mensagem && <p className="text-sm mt-2">{mensagem}</p>}
        </div>
      </main>
    </div>
  );
}