import { useState } from 'react';
import { GoogleGenerativeAI, type Part } from '@google/generative-ai';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import { apiConfig } from '../config/api';
import { Sparkles, Download, MessageCircle, Clock } from 'lucide-react';

const API_URL = apiConfig.baseURL;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const WHATSAPP_NUMBER = '5524992796969';

const EXEMPLOS = {
  upload: '/assets/exemplo-upload.jpg',
  prompt: '/assets/exemplo-prompt.jpg',
  estampa: '/assets/exemplo-estampa.jpg',
};

export function GeradorEstampas() {
  const { user, token, refreshUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Apenas imagens são permitidas');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande (máx 5MB)');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedPreview((ev.target?.result as string) ?? '');
    reader.readAsDataURL(file);
    setError('');
  };

  const handleGenerate = async () => {
    if (!user || !token) {
      setShowAuthModal(true);
      return;
    }

    if (user.credits < 1) {
      setError('Você não tem créditos! Compre um produto para ganhar +5 gerações.');
      return;
    }

    if (prompt.length < 10) {
      setError('Descreva sua estampa com mais detalhes (mínimo 10 caracteres)');
      return;
    }

    if (!GEMINI_API_KEY) {
      setError('Chave da API Gemini não configurada. Configure VITE_GEMINI_API_KEY.');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedImage('');

    try {
      const base64 = uploadedFile
        ? await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string) ?? '');
            reader.readAsDataURL(uploadedFile);
          })
        : undefined;

      // Gerar imagem com Gemini
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

      const parts: Part[] = [
        {
          text: `Crie uma arte para estampa de camiseta baseada nesta descrição: ${prompt}

INSTRUÇÕES:
- Crie uma imagem artística, vibrante e impactante
- Adequada para impressão em tecido (alta resolução)
- Estilo: ilustração vetorial, cores vivas
- Fundo transparente ou branco
- Formato quadrado ou retangular adequado para camiseta
- Evite textos muito pequenos
- Foco no conceito visual da descrição`,
        },
      ];

      if (base64) {
        const base64Data = base64.split(',')[1];
        const mimeType = base64.match(/data:(.*?);/)?.[1] || 'image/jpeg';
        parts.push({
          inlineData: { mimeType, data: base64Data },
        });
      }

      const result = await model.generateContent(parts as Part[]);
      const response = result.response;

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (p: { inlineData?: { mimeType?: string } }) => p.inlineData && p.inlineData.mimeType
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error('Gemini não retornou imagem');
      }

      const imageData = imagePart.inlineData;
      const imagemGeradaPeloGemini = `data:${imageData.mimeType};base64,${imageData.data}`;

      const body = {
        prompt,
        uploadedImage: base64,
        generatedImage: imagemGeradaPeloGemini,
      };

      const res = await fetch(`${API_URL}/api/generate-stamp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar estampa');
      }

      setGeneratedImage(data.image);
      setExpiresAt(data.expiresAt ?? '');
      await refreshUser();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `estampa-${Date.now()}.png`;
    link.click();
  };

  const handleWhatsApp = () => {
    const message = 'Olá! Gerei uma estampa personalizada e gostaria de fazer um pedido!';
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* COMO FUNCIONA */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">COMO FUNCIONA</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-2">Envie sua foto (opcional)</p>
                  <div className="w-full h-36 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={EXEMPLOS.upload}
                      alt="Exemplo de upload"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-2">Descreva a estampa</p>
                  <div className="w-full h-36 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={EXEMPLOS.prompt}
                      alt="Exemplo de prompt"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-2">Gere com IA</p>
                  <div className="w-full h-36 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    <img
                      src={EXEMPLOS.estampa}
                      alt="Exemplo de estampa gerada"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GERADOR */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              CRIE SUA ESTAMPA EXCLUSIVA
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Personalize com Inteligência Artificial
            </p>

            {user && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 font-semibold text-sm">
                  💳 Créditos: {user.credits}/5
                </p>
                {user.credits === 0 && (
                  <p className="text-green-600 text-xs mt-1">
                    Compre um produto para ganhar +5 créditos
                  </p>
                )}
              </div>
            )}

            {/* Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                📷 Upload de Foto (Opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full text-sm"
              />
              {uploadedPreview && (
                <img
                  src={uploadedPreview}
                  alt="Preview"
                  className="mt-2 rounded-lg max-h-32 object-cover"
                />
              )}
            </div>

            {/* Prompt */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                ✍️ Descreva sua estampa ideal
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                rows={4}
                placeholder="Exemplo: Uma águia rasgando uma bandeira vermelha, com a frase 'LIBERDADE' em dourado"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {prompt.length}/500 caracteres
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">❌ {error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || (!!user && user.credits < 1)}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              {loading ? 'Gerando...' : '✨ GERAR ESTAMPA COM IA'}
            </button>

            {!user && (
              <p className="text-xs text-gray-500 text-center mt-2">
                Faça login para gerar estampas
              </p>
            )}
          </div>

          {/* RESULTADO */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">SUA ESTAMPA</h3>

            {generatedImage ? (
              <>
                <img
                  src={generatedImage}
                  alt="Estampa gerada"
                  className="w-full rounded-lg border-2 border-green-500 mb-4"
                />

                {expiresAt && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                    <Clock size={16} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-800 text-xs">
                      ⚠️ Esta imagem fica disponível por <strong>7 dias</strong> e será
                      apagada em {new Date(expiresAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <button
                    onClick={handleDownload}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    Baixar Imagem
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Fazer Pedido no WhatsApp
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-400">Sua estampa aparecerá aqui</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </section>
  );
}
