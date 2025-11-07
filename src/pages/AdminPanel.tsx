// src/pages/AdminPanel.tsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("interface");
  const [config, setConfig] = useState<any>({});
  const [message, setMessage] = useState("");
  const [previewTheme, setPreviewTheme] = useState<string>("");

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

  async function carregarConfiguracoes() {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/config`);
      setConfig(res.data || {});
      setPreviewTheme(res.data.theme || "light");
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
      setMessage("⚠️ Erro ao carregar configurações.");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setConfig({ ...config, [e.target.name]: e.target.value });
  }

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

        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            "interface",
            "eventos",
            "feriados",
            "temas",
            "backend",
            "frontend",
          ].map((tab) => (
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
          {/* Interface */}
          {activeTab === "interface" && (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Configurações da Interface
              </h2>

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
              </select>
            </>
          )}

          {/* Eventos */}
          {activeTab === "eventos" && (
            <>
              <h2 className="text-lg font-semibold mb-2">Eventos</h2>
              <input
                name="evento_feriado"
                value={config.evento_feriado || ""}
                onChange={handleChange}
                placeholder="Nome do evento"
                className="border p-2 rounded-lg"
              />
              <input
                name="data_evento"
                type="date"
                value={config.data_evento || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg"
              />
            </>
          )}

          {/* NOVA ABA: TEMAS / HOLIDAYS */}
          {activeTab === "temas" && (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Temas Sazonais / Holidays
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Escolha o tema visual do site (somente administradores podem
                alterar).
              </p>

              <select
                name="theme"
                value={config.theme || "light"}
                onChange={(e) => {
                  handleChange(e);
                  setPreviewTheme(e.target.value);
                }}
                className="border p-2 rounded-lg"
              >
                <option value="light">Nenhum (padrão)</option>
                <option value="halloween">Halloween 🎃</option>
                <option value="natal">Natal 🎄</option>
              </select>

              <p className="text-xs text-gray-500 mt-2">
                O tema selecionado será aplicado ao público após salvar.
              </p>

              {/* Miniaturas de prévia */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                <div
                  onClick={() => {
                    setConfig({ ...config, theme: "halloween" });
                    setPreviewTheme("halloween");
                  }}
                  className={`cursor-pointer border-2 rounded-lg p-3 text-center transition ${
                    previewTheme === "halloween"
                      ? "border-orange-500 scale-105"
                      : "border-gray-200 hover:scale-105"
                  }`}
                >
                  <div className="w-full h-20 bg-[#2b0d0d] rounded mb-2 flex items-center justify-center text-orange-400 text-xl">
                    🎃
                  </div>
                  <p className="text-sm font-medium text-orange-700">
                    Tema Halloween
                  </p>
                </div>

                <div
                  onClick={() => {
                    setConfig({ ...config, theme: "natal" });
                    setPreviewTheme("natal");
                  }}
                  className={`cursor-pointer border-2 rounded-lg p-3 text-center transition ${
                    previewTheme === "natal"
                      ? "border-green-600 scale-105"
                      : "border-gray-200 hover:scale-105"
                  }`}
                >
                  <div className="w-full h-20 bg-[#e6f3f3] rounded mb-2 flex items-center justify-center text-green-700 text-xl">
                    🎄
                  </div>
                  <p className="text-sm font-medium text-green-700">
                    Tema de Natal
                  </p>
                </div>

                <div
                  onClick={() => {
                    setConfig({ ...config, theme: "light" });
                    setPreviewTheme("light");
                  }}
                  className={`cursor-pointer border-2 rounded-lg p-3 text-center transition ${
                    previewTheme === "light"
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:scale-105"
                  }`}
                >
                  <div className="w-full h-20 bg-white rounded mb-2 flex items-center justify-center text-gray-700 text-xl">
                    ☀️
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    Padrão (Claro)
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Backend */}
          {activeTab === "backend" && (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Configurações de Backend
              </h2>
              <textarea
                name="config_backend"
                value={config.config_backend || ""}
                onChange={handleChange}
                className="border p-2 rounded-lg h-32"
              />
            </>
          )}

          {/* Frontend */}
          {activeTab === "frontend" && (
            <>
              <h2 className="text-lg font-semibold mb-2">
                Configurações de Frontend
              </h2>
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
