import { useState, useEffect, lazy, Suspense } from 'react';
import { AdminNav } from '@/components/AdminNav';
import { apiConfig } from '@/config/api';
import { getAdminToken, setAdminToken as persistAdminToken, clearAdminToken } from '@/hooks/useAdminAuth';
import { getAdminErrorMessage, isAdminAuthError } from '@/utils/adminErrors';

const AdminOverviewCharts = lazy(() => import('@/components/admin/AdminOverviewCharts'));

interface AnalyticsData {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    pendingRevenue: number;
    totalUsers: number;
    totalGenerations: number;
    successfulGenerations: number;
    couponsUsed: number;
    totalDiscount: number;
  };
  salesByDay: Array<{ date: string; count: number; revenue: number }>;
  topProducts: Array<{ productName: string; totalSold: number; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
}

export function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    const savedToken = getAdminToken();
    if (savedToken) {
      setAdminToken(savedToken);
      fetchAnalytics(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = async (
    token?: string,
    start?: string,
    end?: string
  ) => {
    const tokenToUse = token || adminToken;
    if (!tokenToUse) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (start) params.append('startDate', start);
      if (end) params.append('endDate', end);

      const res = await fetch(
        `${apiConfig.baseURL}/api/admin/analytics/overview?${params}`,
        {
          headers: { 'x-admin-token': tokenToUse },
        }
      );

      if (!res.ok) {
        if (isAdminAuthError(res.status)) clearAdminToken();
        alert(getAdminErrorMessage(res.status));
        return;
      }

      const data = await res.json();
      setAnalytics(data.analytics);
      setIsAuthenticated(true);
      persistAdminToken(tokenToUse);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error fetching analytics:', error);
      alert(getAdminErrorMessage());
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalytics(adminToken);
  };

  const handleDateFilter = () => {
    fetchAnalytics(adminToken, dateRange.start, dateRange.end);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6">📊 Admin - Dashboard</h1>
          <form onSubmit={handleLogin}>
            <label className="block text-sm font-medium mb-2">Admin Token</label>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
              placeholder="Digite o token de admin"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Carregando analytics...</div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-3xl text-[#002776]">📊 DASHBOARD DE VENDAS</h1>
            <AdminNav />
          </div>

          {/* Filtro de data */}
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="border border-gray-200 rounded-xl px-3 py-2 font-body text-sm focus:border-[#00843D] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Data Fim</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="border border-gray-200 rounded-xl px-3 py-2 font-body text-sm focus:border-[#00843D] focus:outline-none"
              />
            </div>
            <button
              onClick={handleDateFilter}
              className="bg-[#00843D] text-white px-4 py-2 rounded-full font-body text-sm hover:bg-[#006633] transition-colors"
            >
              Filtrar
            </button>
            <button
              onClick={() => {
                setDateRange({ start: '', end: '' });
                fetchAnalytics(adminToken);
              }}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-body text-sm hover:bg-gray-200 transition-colors"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Cards de Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-body text-xs text-gray-500 uppercase tracking-widest mb-2">Receita Total</div>
            <div className="font-display text-3xl text-[#00843D]">
              R$ {analytics.overview.totalRevenue.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-body">
              Pendente: R$ {analytics.overview.pendingRevenue.toFixed(2)}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-body text-xs text-gray-500 uppercase tracking-widest mb-2">Total de Pedidos</div>
            <div className="font-display text-3xl text-[#002776]">
              {analytics.overview.totalOrders}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-body text-xs text-gray-500 uppercase tracking-widest mb-2">
              Usuários Cadastrados
            </div>
            <div className="font-display text-3xl text-[#002776]">
              {analytics.overview.totalUsers}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-body text-xs text-gray-500 uppercase tracking-widest mb-2">Estampas Geradas</div>
            <div className="font-display text-3xl text-[#FFCC29]">
              {analytics.overview.successfulGenerations}
            </div>
            <div className="text-xs text-gray-500 mt-1 font-body">
              Total: {analytics.overview.totalGenerations}
            </div>
          </div>
        </div>

        {/* Charts (lazy-loaded — Recharts is ~450 kB) */}
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-sm text-gray-400 font-body">
              Carregando gráficos…
            </div>
          }
        >
          <AdminOverviewCharts
            salesByDay={analytics.salesByDay}
            topProducts={analytics.topProducts}
            ordersByStatus={analytics.ordersByStatus}
          />
        </Suspense>

        {/* Cards de Cupons */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-body text-xs text-gray-500 uppercase tracking-widest mb-2">Cupons Utilizados</div>
            <div className="font-display text-3xl text-[#FFCC29]">
              {analytics.overview.couponsUsed}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="font-body text-xs text-gray-500 uppercase tracking-widest mb-2">
              Desconto Total Concedido
            </div>
            <div className="font-display text-3xl text-red-500">
              R$ {analytics.overview.totalDiscount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
