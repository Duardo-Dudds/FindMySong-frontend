// src/pages/AuthPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Importações de componentes do shadcn
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Importações de ícones
import { Music2, Mail, Lock, User } from "lucide-react"; // Apple removido
import { toast } from "sonner";

export function AuthPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [apiMessage, setApiMessage] = useState("");

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    "https://findmysong-backend.onrender.com";

  // --- LÓGICA do Register.tsx ---
  const [signUpForm, setSignUpForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setApiMessage("");

    if (signUpForm.password !== signUpForm.confirmPassword) {
      setApiError("As senhas não conferem.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE}/api/usuarios/register`, {
        nome: signUpForm.name,
        email: signUpForm.email,
        senha: signUpForm.password,
      });

      setApiMessage(res.data.message || "Usuário cadastrado com sucesso!");
      toast.success("Conta criada com sucesso! Você será redirecionado.");

      // Redireciona para o login após criar
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erro ao cadastrar usuário.";
      setApiError(msg);
      toast.error(msg);
    }
  };

  // --- LÓGICA do Login.tsx ---
  const [signInForm, setSignInForm] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setApiMessage("");

    try {
      const resp = await axios.post(`${API_BASE}/api/usuarios/login`, {
        email: signInForm.email,
        senha: signInForm.password,
      });

      const token = resp.data?.token;
      if (!token) {
        const msg = "Resposta inválida do servidor.";
        setApiError(msg);
        toast.error(msg);
        return;
      }

      localStorage.setItem("token", token);
      toast.success("Login bem-sucedido! Bem-vindo.");
      navigate("/home", { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Não foi possível fazer login.";
      setApiError(msg);
      toast.error(msg);
    }
  };

  // --- CÓDIGO VISUAL AuthScreen.tsx ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8 gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Music2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-semibold text-gray-800">FindMySong</h1>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* === ABA DE LOGIN (SIGN IN) === */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={signInForm.email}
                        onChange={(e) =>
                          setSignInForm({ ...signInForm, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signInForm.password}
                        onChange={(e) =>
                          setSignInForm({
                            ...signInForm,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {apiError && (
                    <p className="text-destructive text-sm">{apiError}</p>
                  )}
                  {apiMessage && (
                    <p className="text-green-600 text-sm">{apiMessage}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              {/* === ABA DE CADASTRO (SIGN UP) === */}
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Seu nome"
                        className="pl-10"
                        value={signUpForm.name}
                        onChange={(e) =>
                          setSignUpForm({ ...signUpForm, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={signUpForm.email}
                        onChange={(e) =>
                          setSignUpForm({
                            ...signUpForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="•••••••• (mín. 8 caracteres)"
                        className="pl-10"
                        value={signUpForm.password}
                        onChange={(e) =>
                          setSignUpForm({
                            ...signUpForm,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={signUpForm.confirmPassword}
                        onChange={(e) =>
                          setSignUpForm({
                            ...signUpForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  {apiError && (
                    <p className="text-destructive text-sm">{apiError}</p>
                  )}
                  {apiMessage && (
                    <p className="text-green-600 text-sm">{apiMessage}</p>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800"
                  >
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            </CardContent>
         
        </Card>
      </div>
    </div>
  );
}