import { useState } from "react";
import axios from "axios";

interface FeedbackFormProps {
  query: string;
}

export default function FeedbackForm({ query }: FeedbackFormProps) {
  const [nota, setNota] = useState<number | null>(null);
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

      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setNota(n)}
            className={`px-3 py-1 rounded-full border transition ${
              nota === n
                ? "bg-green-600 text-white"
                : "bg-white border-gray-300 hover:bg-green-100"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

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
