import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Search from "./pages/Search"; // <== nome corrigido e unificado

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<Login />} />

        {/* Cadastro */}
        <Route path="/register" element={<Register />} />

        {/* Página principal (usuário logado) */}
        <Route path="/home" element={<Home />} />

        {/* Página de busca de letras */}
        <Route path="/search" element={<Search />} />

        {/* Rota coringa (caso não encontre) */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
