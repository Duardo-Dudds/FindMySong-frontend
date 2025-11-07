// src/components/ProfileAvatar.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfileAvatar() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL || "https://findmysong-backend.onrender.com"}/api/usuarios/profile/${payload.id}`)
        .then((res) => {
          setAvatar(res.data.avatar_url);
        })
        .catch(() => setAvatar(null));
    } catch {
      setAvatar(null);
    }
  }, []);

  return (
    <div
      onClick={() => navigate("/profile")}
      title="Editar perfil"
      className="cursor-pointer hover:opacity-80 transition-all"
    >
      <img
        src={
          avatar ||
          "https://cdn-icons-png.flaticon.com/512/149/149071.png" // imagem padrão
        }
        alt="Avatar"
        className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
      />
    </div>
  );
}
