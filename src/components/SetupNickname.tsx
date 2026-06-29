"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { Pencil, X, Upload, Image } from "lucide-react";
import { AVATAR_OPTIONS, getRandomAvatar } from "@/lib/avatars";

interface SetupNicknameProps {
  user: User;
  onComplete: () => void;
}

export default function SetupNickname({ user, onComplete }: SetupNicknameProps) {
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Assign random avatar on mount
  useEffect(() => {
    setAvatarUrl(getRandomAvatar());
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Imagem deve ser menor que 2MB");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("Erro ao fazer upload. Tente novamente.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(urlData.publicUrl + "?t=" + Date.now());
    setUploading(false);
    setShowGallery(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = nickname.trim();
    if (trimmed.length < 3) {
      setError("Mínimo 3 caracteres");
      return;
    }
    if (trimmed.length > 20) {
      setError("Máximo 20 caracteres");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // Check if nickname is unique
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("nickname", trimmed)
      .single();

    if (existing) {
      setError("Este apelido já está em uso. Escolha outro.");
      setLoading(false);
      return;
    }

    // Create profile
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      nickname: trimmed,
      avatar_url: avatarUrl,
    });

    if (insertError) {
      setError("Erro ao criar perfil. Tente novamente.");
      setLoading(false);
      return;
    }

    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#13151a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Configure seu perfil
          </h1>
          <p className="text-gray-400 text-sm">
            Escolha sua foto e apelido
          </p>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/10">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl text-gray-400">?</div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 flex items-center justify-center text-white shadow-lg transition-colors"
              title="Alterar foto"
            >
              <Pencil size={14} />
            </button>
          </div>
        </div>

        {/* Gallery modal */}
        {showGallery && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#1a1d23] rounded-2xl border border-gray-700 shadow-2xl max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">Escolha uma foto de perfil</h3>
                <button
                  onClick={() => setShowGallery(false)}
                  className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Upload option */}
              <div className="px-4 py-3 border-b border-gray-800">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2b2d31] hover:bg-[#35373c] border border-gray-700 text-gray-300 text-sm font-medium transition-colors"
                >
                  <Upload size={16} />
                  {uploading ? "Enviando..." : "Enviar foto da galeria"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </div>

              {/* Avatar grid */}
              <div className="flex-1 overflow-y-auto p-3">
                <p className="text-[11px] text-gray-500 uppercase font-semibold mb-2 px-1">
                  <Image size={12} className="inline mr-1" />
                  Galeria — Tema Japão
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {AVATAR_OPTIONS.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setAvatarUrl(url);
                        setShowGallery(false);
                      }}
                      className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-colors hover:border-cyan-400 ${
                        avatarUrl === url ? "border-cyan-500" : "border-transparent"
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError("");
              }}
              placeholder="Seu apelido..."
              maxLength={20}
              className="w-full px-4 py-3 rounded-xl bg-[#1e2128] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors text-center text-lg"
              autoFocus
            />
            <div className="flex justify-between mt-1.5 px-1">
              <span className="text-xs text-gray-500">
                {nickname.length}/20 caracteres
              </span>
              {error && (
                <span className="text-xs text-red-400">{error}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={nickname.trim().length < 3 || loading}
            className="w-full px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium transition-colors"
          >
            {loading ? "Criando..." : "Continuar"}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-600 mt-6">
          Mínimo 3 caracteres • Deve ser único
        </p>
      </div>
    </div>
  );
}
