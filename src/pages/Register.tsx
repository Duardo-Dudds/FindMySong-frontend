// src/pages/Register.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  // se já estiver logado, não faz sentido ficar no cadastro
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined") {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    try {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL ||
        "https://findmysong-backend.onrender.com";

      const res = await axios.post(`${apiBase}/api/usuarios/register`, {
        nome,
        email,
        senha,
      });

      setMensagem(res.data.message || "Usuário cadastrado com sucesso!");

      // depois de cadastrar, manda pro login
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err: any) {
      setMensagem(
        err.response?.data?.message || "Erro ao cadastrar usuário."
      );
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
          tabIndex={1}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded text-black"
          tabIndex={2}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="p-2 rounded text-black"
          tabIndex={3}
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
        <Link to="/login" className="text-blue-400 hover:underline">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
