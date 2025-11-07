import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL || "https://findmysong-backend.onrender.com";

  // Evita erro de token
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token && token !== "undefined") {
        navigate("/home");
      }
    } catch {
      localStorage.removeItem("token");
    }
  }, [navigate]);

  // Cadastro com tratamento de erro completo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !email || !senha) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/usuarios/register`, {
        nome,
        email,
        senha,
      });

      setMensagem(res.data.message || "Usuário cadastrado com sucesso!");
      // redireciona pra login após 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error("Erro ao cadastrar:", err);
      setMensagem(err.response?.data?.message || "Erro ao cadastrar usuário.");
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
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="p-2 rounded text-black"
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
