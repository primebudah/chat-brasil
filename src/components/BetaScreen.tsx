"use client";

interface BetaScreenProps {
  onEnter: () => void;
}

export default function BetaScreen({ onEnter }: BetaScreenProps) {
  return (
    <div className="min-h-screen bg-[#13151a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-3xl">��</span>
          <span className="text-3xl">��</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-6">
          Bem-vindo ao <span className="text-cyan-400">Chat Brasil</span>
        </h1>

        <div className="bg-[#1e2128] rounded-2xl p-6 border border-gray-800 text-left space-y-4 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            Esta é uma <strong className="text-yellow-400">versão Beta</strong>.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Estamos construindo a primeira comunidade chat para brasileiros que vivem no Japão.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Novas funcionalidades serão adicionadas conforme o crescimento da comunidade.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Sua participação é muito importante.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed font-medium">
            Obrigado por fazer parte deste projeto. 💚
          </p>
        </div>

        <button
          onClick={onEnter}
          className="w-full px-6 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-lg transition-colors"
        >
          Entrar na Comunidade
        </button>

        <p className="text-[10px] text-gray-600 mt-4">
          Versão Beta • Chat Brasil 2025
        </p>
      </div>
    </div>
  );
}
