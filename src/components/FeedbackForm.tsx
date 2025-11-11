// src/components/FeedbackForm.tsx
import { useState } from "react";
import axios from "axios";
import { Star } from "lucide-react"; // 1. Importar o ícone de Estrela

interface FeedbackFormProps {
  query: string;
}

export default function FeedbackForm({ query }: FeedbackFormProps) {
  const [nota, setNota] = useState<number | null>(null);
  const [hoveredNota, setHoveredNota] = useState<number | null>(null); // 2. Estado para o hover
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  async function enviarFeedback() {
    if (!nota) {
      alert("Por favor, selecione uma nota antes de enviar.");
      return;
    }

    try {
      await axios.post(`${API_BASE}/api/feedback`, {
        query,
        nota,
        comentario,
        data_envio: new Date().toISOString(),
      });
      setEnviado(true);
    } catch (err) {
      console.error("Erro ao enviar feedback:", err);
      alert("Erro ao enviar o feedback.");
    }
  }

  if (enviado) {
    return (
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
        Obrigado pelo seu feedback! 💚
      </div>
    );
  }

  return (
    <div className="mt-10 p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">
        Avalie a precisão da busca
      </h3>

      {/* === 3. BLOCO DAS ESTRELAS MODIFICADO === */}
      <div
        className="flex gap-1 mb-4 feedback-stars"
        onMouseLeave={() => setHoveredNota(null)} // Limpa o hover ao sair
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            onClick={() => setNota(n)}
            onMouseEnter={() => setHoveredNota(n)} // Define o hover
            className={`cursor-pointer star-icon ${
              // Preenche se a nota (ou o hover) for maior ou igual ao número
              (hoveredNota || nota || 0) >= n ? "star-filled" : "star-empty"
            }`}
            size={28}
          />
        ))}
      </div>
      {/* === FIM DO BLOCO DAS ESTRELAS === */}

      <textarea
        placeholder="Deixe um comentário (opcional, até 500 caracteres)..."
        maxLength={500}
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        className="w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
        rows={3}
      />

      <div className="flex justify-end gap-3 mt-3">
        <button
          onClick={() => {
            setNota(null);
            setComentario("");
            setHoveredNota(null); // Limpa o hover no cancelar
          }}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={enviarFeedback}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}