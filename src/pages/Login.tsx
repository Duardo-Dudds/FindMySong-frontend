import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/usuarios/login", {
        email,
        senha,
      });
      localStorage.setItem("token", res.data.token);
      setMensagem("Login realizado com sucesso!");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err: any) {
      setMensagem(err.response?.data?.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Entrar no FindMySong</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 w-80">
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
        <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold">
          Entrar
        </button>
      </form>
      {mensagem && <p className="mt-4 text-green-400">{mensagem}</p>}
      <p className="mt-4">
        Ainda não tem conta?{" "}
        <a href="/register" className="text-blue-400 hover:underline">
          Cadastrar
        </a>
      </p>
    </div>
  );
}
