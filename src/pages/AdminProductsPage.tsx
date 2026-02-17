import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLogin } from './AdminLogin';
import ProductAdmin from '@/components/admin/ProductAdmin';

export function AdminProductsPage() {
  const { isAuthenticated, isLoading, error, login, logout } = useAdminAuth();

  if (isLoading && !error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#0a0a0a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '3px solid #00843D',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin onLogin={login} isLoading={isLoading} error={error} />
    );
  }

  return <ProductAdmin onLogout={logout} />;
}
