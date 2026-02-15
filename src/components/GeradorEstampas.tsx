import React, { useState, useRef, useCallback } from 'react';

// ============================================
// COMPONENTE: Gerador de Estampas com IA
// Seção: CRIE SUA ESTAMPA EXCLUSIVA
// ============================================

// URLs das imagens de exemplo (ajustar conforme estrutura do projeto)
const IMAGES = {
  upload: '/assets/exemplo-upload.jpg',
  prompt: '/assets/exemplo-prompt.jpg',
  estampa: '/assets/exemplo-estampa.jpg'
};

// API Endpoint
const API_URL = 'https://gerador.bravosbrasil.com.br';

// WhatsApp número
const WHATSAPP_NUMBER = '5524992796969';

interface GeradorEstampasProps {
  className?: string;
}

const GeradorEstampas: React.FC<GeradorEstampasProps> = ({ className = '' }) => {
  // Estados
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerationTime, setLastGenerationTime] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handlers
  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setPrompt(value);
      setCharCount(value.length);
      setError(null);
    }
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    // Validações
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError('Por favor, envie apenas arquivos JPG ou PNG.');
      return;
    }

    if (file.size > maxSize) {
      setError('O arquivo não pode exceder 5MB.');
      return;
    }

    setUploadedFile(file);
    setError(null);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const sanitizeInput = (input: string): string => {
    return input.replace(/<[^>]*>/g, '').trim();
  };

  const handleGenerate = useCallback(async () => {
    // Rate limiting
    const now = Date.now();
    if (now - lastGenerationTime < 3000) {
      setError('Aguarde alguns segundos antes de gerar novamente.');
      return;
    }

    // Validações
    const sanitizedPrompt = sanitizeInput(prompt);
    if (!sanitizedPrompt || sanitizedPrompt.length < 10) {
      setError('Por favor, descreva sua estampa com pelo menos 10 caracteres.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const formData = new FormData();
      if (uploadedFile) {
        formData.append('photo', uploadedFile);
      }
      formData.append('prompt', sanitizedPrompt);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();

      if (data.image_url) {
        setGeneratedImage(data.image_url);
        setLastGenerationTime(Date.now());
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (err) {
      setError('Erro ao gerar estampa. Tente novamente ou fale conosco no WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, uploadedFile, lastGenerationTime]);

  const handleDownload = useCallback(() => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'estampa_bravos_brasil.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [generatedImage]);

  const handleWhatsApp = useCallback(() => {
    const message = encodeURIComponent(
      'Olá! Acabei de criar minha estampa personalizada no site e quero usar em um produto! Pode me ajudar?'
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, []);

  // Estilos inline
  const styles: Record<string, React.CSSProperties> = {
    section: {
      padding: '64px 16px',
      background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
      position: 'relative' as const,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '32px',
      alignItems: 'start',
    },
    // Coluna 1: Exemplo
    exampleCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    },
    exampleTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '20px',
      textAlign: 'center' as const,
    },
    stepContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '8px',
    },
    stepImage: {
      borderRadius: '12px',
      objectFit: 'cover' as const,
    },
    stepText: {
      fontSize: '14px',
      color: '#666666',
      textAlign: 'center' as const,
    },
    stepTextSuccess: {
      fontSize: '14px',
      color: '#00B74A',
      fontWeight: 600,
      textAlign: 'center' as const,
    },
    arrow: {
      fontSize: '24px',
      color: '#00B74A',
      margin: '4px 0',
    },
    // Coluna 2: Gerador
    generatorCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    },
    title: {
      fontSize: '36px',
      fontWeight: 700,
      color: '#00B74A',
      textAlign: 'center' as const,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: 400,
      color: '#666666',
      textAlign: 'center' as const,
      marginBottom: '32px',
    },
    uploadContainer: {
      marginBottom: '24px',
    },
    uploadLabel: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '8px',
      display: 'block',
    },
    uploadArea: {
      width: '100%',
      height: '120px',
      border: isDragging ? '2px solid #00B74A' : '2px dashed #cbd5e1',
      borderRadius: '12px',
      background: isDragging ? '#f1f5f9' : '#f9fafb',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    uploadAreaHover: {
      background: '#f1f5f9',
      border: '2px solid #00B74A',
    },
    uploadIcon: {
      fontSize: '48px',
      marginBottom: '8px',
    },
    uploadText: {
      fontSize: '14px',
      color: '#9ca3af',
      textAlign: 'center' as const,
    },
    filePreview: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      background: '#f0fdf4',
      borderRadius: '8px',
      border: '1px solid #00B74A',
    },
    filePreviewImage: {
      width: '80px',
      height: '80px',
      borderRadius: '8px',
      objectFit: 'cover' as const,
    },
    fileInfo: {
      flex: 1,
    },
    fileName: {
      fontSize: '14px',
      color: '#374151',
      fontWeight: 500,
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '4px 8px',
    },
    textareaContainer: {
      marginBottom: '24px',
    },
    textareaLabel: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '8px',
      display: 'block',
    },
    textarea: {
      width: '100%',
      height: '140px',
      padding: '16px',
      fontSize: '15px',
      lineHeight: 1.6,
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      resize: 'none' as const,
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
    },
    charCounter: {
      fontSize: '12px',
      color: '#9ca3af',
      textAlign: 'right' as const,
      marginTop: '4px',
    },
    generateButton: {
      width: '100%',
      height: '56px',
      background: 'linear-gradient(135deg, #00B74A 0%, #00a043 100%)',
      color: '#ffffff',
      fontSize: '18px',
      fontWeight: 700,
      border: 'none',
      borderRadius: '12px',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 12px rgba(0,183,74,0.3)',
      transition: 'all 0.3s ease',
      opacity: isLoading ? 0.6 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid transparent',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    errorMessage: {
      background: '#fee2e2',
      color: '#991b1b',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '16px',
      fontSize: '14px',
      textAlign: 'center' as const,
    },
    // Coluna 3: Preview
    previewCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
    },
    previewTitle: {
      fontSize: '16px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '16px',
      textAlign: 'center' as const,
    },
    previewArea: {
      width: '100%',
      aspectRatio: '1',
      maxWidth: '280px',
      margin: '0 auto',
      background: '#f9fafb',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    previewPlaceholder: {
      fontSize: '64px',
      marginBottom: '8px',
    },
    previewPlaceholderText: {
      fontSize: '14px',
      color: '#9ca3af',
      textAlign: 'center' as const,
      padding: '0 16px',
    },
    previewImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
      borderRadius: '8px',
    },
    actionButtons: {
      marginTop: '16px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    downloadButton: {
      width: '100%',
      height: '44px',
      background: 'transparent',
      border: '2px solid #00B74A',
      color: '#00B74A',
      fontSize: '14px',
      fontWeight: 600,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    whatsappButton: {
      width: '100%',
      height: '44px',
      background: '#25D366',
      color: '#ffffff',
      fontSize: '14px',
      fontWeight: 600,
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    },
    shimmer: {
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    },
  };

  return (
    <section id="gerador-estampas" className={`gerador-estampas-section ${className}`} style={styles.section}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .gerador-estampas-section textarea:focus {
          outline: none;
          border-color: #00B74A;
          box-shadow: 0 0 0 3px rgba(0,183,74,0.1);
        }
        .gerador-estampas-section .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,183,74,0.4);
        }
        .gerador-estampas-section .download-btn:hover {
          background: #00B74A;
          color: #ffffff;
        }
        .gerador-estampas-section .whatsapp-btn:hover {
          background: #128C7E;
        }
        @media (max-width: 1023px) {
          .gerador-estampas-section .container-grid {
            grid-template-columns: 1fr;
          }
          .gerador-estampas-section .example-steps {
            flex-direction: row !important;
            justify-content: center;
            gap: 16px;
          }
          .gerador-estampas-section .example-steps .arrow {
            transform: rotate(-90deg);
          }
        }
        @media (max-width: 767px) {
          .gerador-estampas-section {
            padding: 40px 16px;
          }
          .gerador-estampas-section .example-steps {
            flex-direction: column !important;
          }
          .gerador-estampas-section .example-steps .arrow {
            transform: rotate(0deg);
          }
          .gerador-estampas-section h2 {
            font-size: 28px !important;
          }
          .gerador-estampas-section .subtitle {
            font-size: 16px !important;
          }
        }
      `}</style>

      <div className="container-grid" style={styles.container}>
        {/* Coluna 1: Exemplo do Fluxo */}
        <div style={styles.exampleCard}>
          <h3 style={styles.exampleTitle}>Como funciona</h3>
          <div className="example-steps" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Passo 1 */}
            <div style={styles.stepContainer}>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>PASSO 1</span>
              <img
                src={IMAGES.upload}
                alt="Envie sua foto"
                style={{ ...styles.stepImage, width: '100px', height: '100px' }}
              />
              <span style={styles.stepText}>Envie sua foto</span>
            </div>
            
            <span className="arrow" style={styles.arrow}>↓</span>
            
            {/* Passo 2 */}
            <div style={styles.stepContainer}>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>PASSO 2</span>
              <img
                src={IMAGES.prompt}
                alt="Descreva a estampa"
                style={{ ...styles.stepImage, width: '100%', height: '60px', objectFit: 'cover' }}
              />
              <span style={styles.stepText}>Descreva a estampa</span>
            </div>
            
            <span className="arrow" style={styles.arrow}>↓</span>
            
            {/* Passo 3 */}
            <div style={styles.stepContainer}>
              <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>PASSO 3</span>
              <img
                src={IMAGES.estampa}
                alt="Estampa pronta"
                style={{ ...styles.stepImage, width: '150px', height: '150px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <span style={styles.stepTextSuccess}>Estampa pronta!</span>
            </div>
          </div>
        </div>

        {/* Coluna 2: Gerador Principal */}
        <div style={styles.generatorCard}>
          <h2 className="title" style={styles.title}>CRIE SUA ESTAMPA EXCLUSIVA</h2>
          <p className="subtitle" style={styles.subtitle}>Personalize com Inteligência Artificial</p>

          {/* Upload de Foto */}
          <div style={styles.uploadContainer}>
            <label style={styles.uploadLabel}>📸 Upload de Foto (Opcional)</label>
            {!uploadedFile ? (
              <div
                style={styles.uploadArea}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <span style={styles.uploadIcon}>📷</span>
                <span style={styles.uploadText}>
                  Clique ou arraste sua foto aqui<br />
                  <small>(JPG, PNG até 5MB)</small>
                </span>
              </div>
            ) : (
              <div style={styles.filePreview}>
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" style={styles.filePreviewImage} />
                )}
                <div style={styles.fileInfo}>
                  <span style={styles.fileName}>{uploadedFile.name}</span>
                </div>
                <button style={styles.removeButton} onClick={removeFile} title="Remover arquivo">
                  ✕
                </button>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Textarea */}
          <div style={styles.textareaContainer}>
            <label style={styles.textareaLabel}>✍️ Descreva sua estampa ideal</label>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Exemplo: Me coloque dando um abraço de frente com Jesus Cristo, com a bandeira do Brasil ao fundo em aquarela e a frase 'EU TENHO FÉ' em dourado na parte de baixo"
              style={styles.textarea}
              maxLength={200}
              disabled={isLoading}
            />
            <div style={styles.charCounter}>{charCount}/200 caracteres</div>
          </div>

          {/* Botão Gerar */}
          <button
            className="generate-btn"
            style={styles.generateButton}
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span style={styles.spinner}></span>
                Gerando sua estampa...
              </>
            ) : (
              <>✨ GERAR ESTAMPA COM IA</>
            )}
          </button>

          {/* Mensagem de Erro */}
          {error && (
            <div style={styles.errorMessage}>
              ❌ {error}
            </div>
          )}
        </div>

        {/* Coluna 3: Preview */}
        <div style={styles.previewCard}>
          <h3 style={styles.previewTitle}>Sua Estampa</h3>
          <div style={styles.previewArea}>
            {isLoading ? (
              <div style={{ ...styles.shimmer, width: '100%', height: '100%' }}></div>
            ) : generatedImage ? (
              <img
                src={generatedImage}
                alt="Estampa gerada"
                style={styles.previewImage}
              />
            ) : (
              <>
                <span style={styles.previewPlaceholder}>🖼️</span>
                <span style={styles.previewPlaceholderText}>Sua estampa aparecerá aqui</span>
              </>
            )}
          </div>

          {/* Botões de Ação */}
          {generatedImage && !isLoading && (
            <div style={styles.actionButtons}>
              <button
                className="download-btn"
                style={styles.downloadButton}
                onClick={handleDownload}
              >
                ⬇️ BAIXAR IMAGEM
              </button>
              <button
                className="whatsapp-btn"
                style={styles.whatsappButton}
                onClick={handleWhatsApp}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                USAR ESSA ESTAMPA
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GeradorEstampas;
