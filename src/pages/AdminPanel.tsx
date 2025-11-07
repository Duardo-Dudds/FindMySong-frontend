// src/pages/AdminPanel.tsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("interface");
  const [config, setConfig] = useState<any>({
    site_name: "FindMySong",
    theme: "light",
    dark_mode: true,
    items_per_page: 20,
    language: "pt-BR",
    hero_banner: '{"enabled": true, "autoplay": true, "interval": 5000}',
  });
  const [message, setMessage] = useState("");

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  // Verifica token e se é admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      if (payload.email !== "eduardopgmg@gmail.com") {
        // e-mail cadastrado no banco
        alert("Acesso restrito a administradores.");
        window.location.href = "/home";
      }
    } catch {
      alert("Token inválido");
      window.location.href = "/login";
    }
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setConfig({ ...config, [e.target.name]: e.target.value });
  }

  async function salvarConfiguracoes() {
    try {
      setMessage("Salvando...");
      await axios.post(`${API_BASE}/api/admin/config`, config);
      setMessage("✅ Configurações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Erro ao salvar configurações.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-semibold mb-6">Painel Administrativo ⚙️</h1>

        <div className="flex gap-3 mb-6">
          {["interface", "eventos", "feriados", "backend", "frontend"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab
                  ? "bg-green-500 text-white"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form className="bg-white p-6 rounded-2xl shadow-md border max-w-3xl flex flex-col gap-4">
          {activeTab === "interface" && (
            <>
              <h2 className="text-lg font-semibold mb-2">Configurações da Interface</h2>

              <label className="font-medium text-sm">Nome do site</label>
              <input
                name="site_name"
                value={config.site_name}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <label className="font-medium text-sm">Tema padrão</label>
              <select
                name="theme"
                value={config.theme}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>

              <label className="font-medium text-sm">Itens por página</label>
              <input
                type="number"
                name="items_per_page"
                value={config.items_per_page}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <label className="font-medium text-sm">Idioma padrão</label>
              <select
                name="language"
                value={config.language}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              >
                <option value="pt-BR">Português (BR)</option>
                <option value="en">Inglês</option>
              </select>
            </>
          )}

          {activeTab === "backend" && (
            <>
              <h2 className="text-lg font-semibold mb-2">Configurações de Backend</h2>
              <textarea
                name="config_backend"
                placeholder="Parâmetros técnicos..."
                className="border p-2 rounded-lg h-40"
                onChange={handleChange}
              ></textarea>
            </>
          )}

          {activeTab === "frontend" && (
            <>
              <h2 className="text-lg font-semibold mb-2">Configurações de Frontend</h2>
              <textarea
                name="config_frontend"
                placeholder="Configurações de interface (ex: JSON)..."
                className="border p-2 rounded-lg h-40"
                onChange={handleChange}
              ></textarea>
            </>
          )}

          {activeTab === "eventos" && (
            <>
              <h2 className="text-lg font-semibold mb-2">Eventos</h2>
              <input
                name="evento_feriado"
                placeholder="Nome do evento"
                className="border p-2 rounded-lg"
                onChange={handleChange}
              />
              <input
                name="data_evento"
                type="date"
                className="border p-2 rounded-lg"
                onChange={handleChange}
              />
            </>
          )}

          {activeTab === "feriados" && (
            <>
              <h2 className="text-lg font-semibold mb-2">Feriados</h2>
              <textarea
                name="feriados_lista"
                placeholder="Lista de feriados (ex: 25/12 - Natal)"
                className="border p-2 rounded-lg h-32"
                onChange={handleChange}
              ></textarea>
            </>
          )}

          <button
            type="button"
            onClick={salvarConfiguracoes}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md mt-4"
          >
            Salvar alterações
          </button>

          {message && <p className="text-sm mt-3">{message}</p>}
        </form>
      </main>
    </div>
  );
}
