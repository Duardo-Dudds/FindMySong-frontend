// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Top10 from "./pages/Top10";
import LikedSongs from "./pages/LikedSongs";
// se quiser manter a página de busca separada:
import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <Routes>
        {/* auth */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* páginas internas */}
        <Route path="/home" element={<Home />} />
        <Route path="/top10" element={<Top10 />} />
        <Route path="/liked" element={<LikedSongs />} />
        <Route path="/search" element={<Search />} />

        {/* fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
