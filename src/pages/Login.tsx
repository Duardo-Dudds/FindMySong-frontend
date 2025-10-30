import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    try {
      // pega do .env
      const apiBase =
        import.meta.env.VITE_API_BASE_URL ||
        "http://localhost:3000";

      const resp = await axios.post(
        `${apiBase}/api/usuarios/login`,
        { email, senha },
        {
          // importante pro vercel/render
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // se chegou aqui é porque o backend devolveu 200
      const token = resp.data?.token;
      if (!token) {
        setErro("Resposta inválida do servidor.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/home");
    } catch (err: any) {
      // aqui a gente mostra o erro real do backend
      const msg =
        err.response?.data?.message ||
        "Não foi possível fazer login.";
      setErro(msg);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Entrar no FindMySong
        </h2>

        <label htmlFor="email" className="block mb-2">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          tabIndex={1}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Digite seu e-mail"
        />

        <label htmlFor="senha" className="block mb-2">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          tabIndex={2}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-2 mb-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Digite sua senha"
        />

        {erro && (
          <p className="mb-3 text-red-300 text-sm">{erro}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded transition"
        >
          Entrar
        </button>

        <p className="mt-4 text-center text-sm">
          Ainda não tem conta?{" "}
          <a
            href="/register"
            className="text-green-400 hover:text-green-500 underline"
          >
            Cadastrar
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
