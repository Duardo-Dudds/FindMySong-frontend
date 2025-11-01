// src/api.ts
import axios from "axios";

// Define o endereço base do backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
});

export default api;
