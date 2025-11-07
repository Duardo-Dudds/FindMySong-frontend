import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  // Protege contra erro no import.meta.env durante build
  const API_BASE =
    (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
    "https://findmysong-backend.onrender.com";

  // Evita tela branca se token estiver inválido
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        navigate("/home");
      }
    } catch (e) {
      console.error("Erro ao verificar token:", e);
      localStorage.removeItem("token");
    }
  }, [navigate]);

  // Submete cadastro com fallback de erro
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !email || !senha) {
      setMensagem("Preencha todos os campos antes de continuar.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/usuarios/register`, {
        nome,
        email,
        senha,
      });

      console.log("✅ Cadastro:", res.data);
      setMensagem(res.data.message || "Usuário cadastrado com sucesso!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      console.error("❌ Erro ao cadastrar:", err);
      const msg =
        err?.response?.data?.message || "Erro ao cadastrar. Tente novamente.";
      setMensagem(msg);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Criar Conta</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-2 rounded text-black"
          autoComplete="name"
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-black"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="p-2 rounded text-black"
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold"
        >
          Cadastrar
        </button>
      </form>

      {mensagem && <p className="mt-4 text-green-400">{mensagem}</p>}

      <p className="mt-4">
        Já tem conta?{" "}
        <a href="/login" className="text-blue-400 hover:underline">
          Fazer login
        </a>
      </p>
    </div>
  );
}
