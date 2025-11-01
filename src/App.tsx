import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Search from "./pages/Search";
import LikedSongs from "./pages/LikedSongs";
import Library from "./pages/Library";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial (Login) */}
        <Route path="/" element={<Login />} />

        {/* Cadastro */}
        <Route path="/register" element={<Register />} />

        {/* Página principal (usuário logado) */}
        <Route path="/home" element={<Home />} />

        {/* Página de busca de letras */}
        <Route path="/search" element={<Search />} />

        {/* Página de músicas curtidas */}
        <Route path="/liked" element={<LikedSongs />} />

        {/* Página da biblioteca do usuário */}
        <Route path="/library" element={<Library />} />

        {/* Rota coringa (caso não encontre) */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
