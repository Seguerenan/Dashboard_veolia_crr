// src/pages/AdminLogin.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔒 LOGOUT AUTOMÁTICO AO CARREGAR A PÁGINA
  useEffect(() => {
    supabase.auth.signOut();
  }, []);

  // 🔐 FUNÇÃO DE LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage("Email ou senha inválidos.");
      return;
    }

    // login OK → vai para página admin
    navigate("/admin");
  };

  return (
    <div
      className="flex items-start justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/veolia.jpg')` }}
    >
      {/* Botão voltar para dashboard */}
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Dashboard
        </Button>
      </div>

      {/* Card Login */}
      <div className="bg-black/50 backdrop-blur-md rounded-lg w-full max-w-md p-1 mt-40">
        <Card className="bg-black/80 text-yellow-400 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>

          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}