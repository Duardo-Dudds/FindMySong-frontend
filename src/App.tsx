import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Top10 from "./pages/Top10";
import Library from "./pages/Library";
import LikedSongs from "./pages/LikedSongs";
import Search from "./pages/Search";
import CreatePlaylist from "./pages/CreatePlaylist";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top10" element={<Top10 />} />
        <Route path="/library" element={<Library />} />
        <Route path="/likedsongs" element={<LikedSongs />} />
        <Route path="/search" element={<Search />} />
        <Route path="/createplaylist" element={<CreatePlaylist />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
