"use client";

import { createClient } from "@/lib/supabase";
import { Globe, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginScreen() {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setGoogleError("");
    window.location.href = "/api/auth/google";
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailLoading(true);
    setEmailError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setEmailError("Erro ao enviar link. Tente novamente.");
    } else {
      setEmailSent(true);
    }
    setEmailLoading(false);
  };


  return (
    <div className="min-h-screen bg-[#13151a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-4xl">🇧🇷</span>
            <h1 className="text-3xl font-bold text-white">
              Chat <span className="text-cyan-400">Brasil</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm">
            A comunidade dos brasileiros no Japão 🇧🇷🇯🇵
          </p>
        </div>

        {/* Login buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-800 font-medium transition-colors disabled:opacity-70"
          >
            <Globe size={20} />
            {googleLoading ? "Redirecionando..." : "Entrar com Google"}
          </button>
          {googleError && <p className="text-xs text-red-400 text-center">{googleError}</p>}

          <div className="relative flex items-center my-2">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-3 text-xs text-gray-500">ou</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {!emailSent ? (
            <form onSubmit={handleEmailLogin} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                placeholder="Seu e-mail"
                className="w-full px-4 py-3 rounded-xl bg-[#1e2128] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
              {emailError && <p className="text-xs text-red-400">{emailError}</p>}
              <button
                type="submit"
                disabled={!email.trim() || emailLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-[#1e2128] hover:bg-[#252830] border border-gray-700 text-gray-200 font-medium transition-colors disabled:opacity-50"
              >
                <Mail size={20} />
                {emailLoading ? "Enviando..." : "Entrar com E-mail"}
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-cyan-600/10 border border-cyan-600/30 text-center">
              <p className="text-sm text-cyan-400">✉️ Link enviado para <strong>{email}</strong></p>
              <p className="text-xs text-gray-400 mt-1">Verifique sua caixa de entrada</p>
            </div>
          )}

        </div>

        {/* Privacy notice */}
        <div className="mt-6 p-4 rounded-xl bg-[#1e2128] border border-gray-800">
          <p className="text-xs text-gray-400 leading-relaxed">
            🔒 Seu login serve apenas para autenticação.
            Seu nome, e-mail e informações pessoais <strong className="text-gray-300">NÃO são exibidos</strong> para outros usuários.
            Os demais usuários verão apenas o apelido escolhido por você.
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-gray-600 mt-6">
          Versão Beta • Chat Brasil 2024
        </p>
      </div>
    </div>
  );
}
