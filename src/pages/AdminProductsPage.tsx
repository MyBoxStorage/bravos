import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLogin } from './AdminLogin';
import ProductAdmin from '@/components/admin/ProductAdmin';

export function AdminProductsPage() {
  const { isAuthenticated, error, login, logout } = useAdminAuth();

  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} error={error} />;
  }

  return <ProductAdmin onLogout={logout} />;
}
