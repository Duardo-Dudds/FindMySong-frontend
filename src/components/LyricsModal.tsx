
// src/components/LyricsModal.tsx
import { useEffect, useState } from "react";
import api from "../api";

interface Props {
  title: string;
  url: string | null;
  onClose: () => void;
}

export default function LyricsModal({ title, url, onClose }: Props) {
  const [conteudo, setConteudo] = useState<string>("");

  useEffect(() => {
    // se não tiver URL do Genius, só mostra o título
    if (!url) {
      setConteudo("Letra não disponível automaticamente. Abra no Spotify / Genius.");
      return;
    }

    const load = async () => {
      try {
        const r = await api.get("/api/lyrics/html", {
          params: { url },
        });
        if (r.data?.html) {
          setConteudo("Letra carregada do site (HTML bruto).");
        } else {
          setConteudo("Não foi possível puxar a letra. Abra no site.");
        }
      } catch {
        setConteudo("Não foi possível puxar a letra. Abra no site.");
      }
    };

    load();
  }, [url]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-sm"
          >
            fechar
          </button>
        </div>

        {url && (
          <p className="text-xs mb-3">
            Fonte original:{" "}
            <a
              href={url}
              target="_blank"
              className="text-blue-500 underline"
            >
              abrir letra
            </a>
          </p>
        )}

        <p className="text-sm text-gray-700 whitespace-pre-wrap">{conteudo}</p>
      </div>
    </div>
  );
}
