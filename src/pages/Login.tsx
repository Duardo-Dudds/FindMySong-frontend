import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Simulação de login básico
    if (email && senha) {
      localStorage.setItem("token", "logado");
      navigate("/home");
    } else {
      alert("Preencha e-mail e senha para continuar!");
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
          className="w-full p-2 mb-6 text-black rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Digite sua senha"
        />

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
