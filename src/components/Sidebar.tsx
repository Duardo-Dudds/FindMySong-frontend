// src/components/Sidebar.tsx
import React, { useState, useEffect } from "react";
import {
  Home,
  Music2,
  Library,
  PlusSquare,
  Heart,
  LogOut,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- CORREÇÃO DO BUG 2 ---
  // Lê o estado 'isCollapsed' do localStorage ao carregar.
  // O padrão é 'false' (expandido) se não houver nada salvo.
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  // --- FIM DA CORREÇÃO ---

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // --- CORREÇÃO DO BUG 2 ---
  // Salva a preferência no localStorage toda vez que 'isCollapsed' mudar.
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);
  // --- FIM DA CORREÇÃO ---

  let userEmail = "";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userEmail = payload.email || "";
    }
  } catch {
    userEmail = "";
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleLinkClick = () => {
    setIsMobileOpen(false);
  };

  // Função para classe do link ativo (corrigida)
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 p-2 rounded-lg transition-all duration-200 group sidebar-link
      ${isActive ? "sidebar-link-active font-medium" : "hover:bg-black/10"}
      ${isCollapsed ? "justify-center" : "justify-start"}
    `;
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-full shadow-md text-gray-700 hover:text-green-600"
      >
        <Menu size={24} />
      </button>

      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Tag <aside> corrigida:
        1. Adicionada a classe "sidebar" para seus temas.
        2. Removido "bg-white", "border-r", "border-gray-200" para não brigar com os temas.
      */}
      <aside
        className={`
          sidebar fixed md:static top-0 left-0 h-full z-50
          transition-all duration-300 ease-in-out flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
        `}
      >
        <div
          className={`flex items-center p-4 h-16 border-b border-white/10 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <h1 className="text-xl font-bold sidebar-logo">FindMySong</h1>
          )}

          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden"
          >
            <X size={24} />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-md hover:bg-black/10 transition"
          >
            {isCollapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </div>

        {/* Navegação */}
        <nav className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto custom-scrollbar">
          <Link
            to="/home"
            onClick={handleLinkClick}
            className={getLinkClass("/home")}
          >
            <Home size={22} className="shrink-0" />
            {!isCollapsed && <span>Home</span>}
          </Link>

          <Link
            to="/top10"
            onClick={handleLinkClick}
            className={getLinkClass("/top10")}
          >
            <Music2 size={22} className="shrink-0" />
            {!isCollapsed && <span>Top 10 da Semana</span>}
          </Link>

          <Link
            to="/library"
            onClick={handleLinkClick}
            className={getLinkClass("/library")}
          >
            <Library size={22} className="shrink-0" />
            {!isCollapsed && <span>Sua Biblioteca</span>}
          </Link>

          <Link
            to="/likedsongs"
            onClick={handleLinkClick}
            className={getLinkClass("/likedsongs")}
          >
            <Heart size={22} className="shrink-0" />
            {!isCollapsed && <span>Músicas Curtidas</span>}
          </Link>

          <Link
            to="/createplaylist"
            onClick={handleLinkClick}
            className={getLinkClass("/createplaylist")}
          >
            <PlusSquare size={22} className="shrink-0" />
            {!isCollapsed && <span>Criar Playlist</span>}
          </Link>

          {userEmail === "eduardopgmg@gmail.com" && (
            <>
              <div className="my-2 border-t border-white/10"></div>
              <Link
                to="/admin"
                onClick={handleLinkClick}
                className={getLinkClass("/admin")}
              >
                <Settings size={22} className="shrink-0" />
                {!isCollapsed && <span>Admin</span>}
              </Link>
            </>
          )}
        </nav>

        {/* Rodapé */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full p-2 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors
              ${isCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <LogOut size={20} className="shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </button>

          {!isCollapsed && (
            <p className="mt-4 text-[10px] text-gray-400 text-center">
              © 2025 FindMySong <br /> PUC Minas
            </p>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;