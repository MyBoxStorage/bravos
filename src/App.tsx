import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages — lazy loaded for route-based code splitting
const HomePage = lazy(() => import("@/pages/HomePage"));
const CatalogPage = lazy(() =>
  import("@/pages/CatalogPage").then((m) => ({ default: m.CatalogPage }))
);
const ProductPage = lazy(() => import("@/pages/ProductPage"));
const UserDashboard = lazy(() => import("@/pages/UserDashboard"));
const OrderTracking = lazy(() => import("@/pages/OrderTracking"));
const CheckoutSuccess = lazy(() => import("@/pages/CheckoutSuccess"));
const CheckoutFailure = lazy(() => import("@/pages/CheckoutFailure"));
const CheckoutPending = lazy(() => import("@/pages/CheckoutPending"));
const MinhasEstampasPage = lazy(() =>
  import("@/pages/MinhasEstampasPage").then((m) => ({
    default: m.MinhasEstampasPage,
  }))
);
const PoliticaTrocas = lazy(() => import("@/pages/PoliticaTrocas"));
const PoliticaPrivacidade = lazy(() => import("@/pages/PoliticaPrivacidade"));
const TermosDeUso = lazy(() => import("@/pages/TermosDeUso"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const Contato = lazy(() => import("@/pages/Contato"));

// Admin — lazy loaded to avoid Supabase env crash in production
const AdminUnifiedPage = lazy(() =>
  import("@/pages/AdminUnifiedPage").then((m) => ({
    default: m.AdminUnifiedPage,
  }))
);

function App() {
  useEffect(() => {
    if (import.meta.env.DEV) console.log("App initialized");
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <Routes>
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/produto/:slug" element={<ProductPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/failure" element={<CheckoutFailure />} />
            <Route path="/checkout/pending" element={<CheckoutPending />} />
            <Route path="/minha-conta" element={<UserDashboard />} />
            <Route path="/order" element={<OrderTracking />} />
            <Route path="/admin/*" element={<AdminUnifiedPage />} />
            <Route path="/trocas-e-devolucoes" element={<PoliticaTrocas />} />
            <Route
              path="/politica-de-privacidade"
              element={<PoliticaPrivacidade />}
            />
            <Route path="/termos-de-uso" element={<TermosDeUso />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/minhas-estampas" element={<MinhasEstampasPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
