import { useState, useEffect } from "react";

const STORAGE_KEY = "cookie_consent";
const DELAY_MS = 1000;

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem(STORAGE_KEY);
    if (consent === "accepted") return;
    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: "#1a1a1a",
        borderTop: "1px solid #333",
        padding: "12px 24px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
      }}
      className="cookie-banner"
    >
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#ccc",
          lineHeight: 1.4,
          flex: 1,
        }}
      >
        🍪 Usamos cookies essenciais para o funcionamento do site. Ao continuar
        navegando, você concorda com nossa{" "}
        <a
          href="/politica-de-privacidade"
          style={{ color: "#00843D", textDecoration: "underline" }}
        >
          Política de Privacidade
        </a>
        .
      </p>
      <button
        type="button"
        onClick={handleAccept}
        style={{
          background: "#00843D",
          color: "white",
          border: "none",
          borderRadius: 50,
          padding: "8px 20px",
          fontSize: 14,
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        Entendi
      </button>
      <style>{`
        @media (max-width: 639px) {
          .cookie-banner {
            flex-direction: column;
            gap: 8px;
            align-items: stretch;
          }
          .cookie-banner button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
