// src/pages/AdminPanel.tsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("interface");
  const [config, setConfig] = useState<any>({});
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
        alert("Acesso restrito a administradores.");
        window.location.href = "/home";
      } else {
        carregarConfiguracoes();
      }
    } catch {
      alert("Token inválido");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  }, []);

  // Carrega configurações atuais
  async function carregarConfiguracoes() {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/config`);
      setConfig(res.data || {});
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
      setMessage("⚠️ Erro ao carregar configurações.");
    }
  }

  // Atualiza campos do formulário
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setConfig({ ...config, [e.target.name]: e.target.value });
  }

  // Salva alterações no backend
  async function salvarConfiguracoes() {
    try {
      setMessage("Salvando...");
      await axios.post(`${API_BASE}/api/admin/config`, config);
      setMessage("✅ Configurações salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setMessage("❌ Erro ao salvar configurações.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <main className="flex-1 p-10">
        <h1 className="text-2xl font-semibold mb-6">
          Painel Administrativo ⚙️
        </h1>

        <div className="flex gap-3 mb-6">
          {["interface", "eventos", "feriados", "backend", "frontend"].map(
            (tab) => (
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
            )
          )}
        </div>

        <form className="bg-white p-6 rounded-2xl shadow-md border max-w-3xl flex flex-col gap-4">
          {/* ====== ABA INTERFACE ====== */}
          {activeTab === "interface" && (
            <>
              <label className="font-medium text-sm">Nome do site</label>
              <input
                name="site_name"
                value={config.site_name || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <label className="font-medium text-sm">Tema padrão</label>
              <select
                name="theme"
                value={config.theme || "light"}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              >
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
                <option value="halloween">🎃 Tema de Halloween</option>
                <option value="natal">🎄 Tema de Natal</option>
              </select>

              {config.theme === "halloween" && (
                <p className="text-orange-600 text-sm font-medium mt-2">
                  🎃 Tema de Halloween ativo! Aproveite as músicas sombrias!
                </p>
              )}
              {config.theme === "natal" && (
                <p className="text-green-600 text-sm font-medium mt-2">
                  🎄 Tema de Natal ativo! Curta as músicas festivas!
                </p>
              )}
            </>
          )}

          {/* ====== ABA EVENTOS ====== */}
          {activeTab === "eventos" && (
            <>
              <label className="font-medium text-sm">Evento / Feriado</label>
              <input
                name="evento_feriado"
                value={config.evento_feriado || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />

              <label className="font-medium text-sm">Data</label>
              <input
                name="data_evento"
                type="date"
                value={config.data_evento || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />
            </>
          )}

          {/* ====== ABA FERIADOS ====== */}
          {activeTab === "feriados" && (
            <>
              <label className="font-medium text-sm">Lista de feriados</label>
              <textarea
                name="feriados_lista"
                value={config.feriados_lista || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg h-32"
              />
            </>
          )}

          {/* ====== ABA BACKEND ====== */}
          {activeTab === "backend" && (
            <>
              <label className="font-medium text-sm">
                Configuração Backend
              </label>
              <textarea
                name="config_backend"
                value={config.config_backend || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg h-32"
              />
            </>
          )}

          {/* ====== ABA FRONTEND ====== */}
          {activeTab === "frontend" && (
            <>
              <label className="font-medium text-sm">
                Configuração Frontend
              </label>
              <textarea
                name="config_frontend"
                value={config.config_frontend || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg h-32"
              />
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
