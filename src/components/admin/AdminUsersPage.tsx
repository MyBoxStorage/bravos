import { useState, useEffect, useCallback, useRef } from 'react';
import { MoreVertical, Loader2 } from 'lucide-react';
import { apiConfig } from '@/config/api';
import { getAdminToken } from '@/hooks/useAdminAuth';
import { getAdminErrorMessage, isAdminAuthError } from '@/utils/adminErrors';
import { clearAdminToken } from '@/hooks/useAdminAuth';

interface AdminUserRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  credits: number;
  totalGenerations: number;
  createdAt: string;
  purchasedOrdersCount: number;
}

const DEBOUNCE_MS = 500;
const PAGE_SIZE = 20;

function formatDatePtBr(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<AdminUserRow | null>(null);
  const [modalCredits, setModalCredits] = useState('');
  const [modalReason, setModalReason] = useState('');
  const [savingCredits, setSavingCredits] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const token = getAdminToken();

  const fetchUsers = useCallback(
    async (searchTerm: string, pageNum: number) => {
      if (!token) return;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(pageNum));
        params.set('limit', String(PAGE_SIZE));
        if (searchTerm) params.set('search', searchTerm);
        const res = await fetch(
          `${apiConfig.baseURL}/api/admin/users?${params}`,
          { headers: { 'x-admin-token': token } }
        );
        if (!res.ok) {
          if (isAdminAuthError(res.status)) clearAdminToken();
          alert(getAdminErrorMessage(res.status));
          return;
        }
        const data = await res.json();
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
        setPage(data.page ?? 1);
        setTotalPages(data.totalPages ?? 1);
      } catch (e) {
        if (import.meta.env.DEV) console.error(e);
        alert(getAdminErrorMessage());
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    if (token) fetchUsers(search, page);
  }, [token, search, page, fetchUsers]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openCreditsModal = (u: AdminUserRow) => {
    setModalUser(u);
    setModalCredits(String(u.credits));
    setModalReason('');
    setOpenMenuId(null);
  };

  const closeCreditsModal = () => {
    setModalUser(null);
    setModalCredits('');
    setModalReason('');
  };

  const saveCredits = async () => {
    if (!modalUser || !token) return;
    const creditsNum = parseInt(modalCredits, 10);
    if (Number.isNaN(creditsNum) || creditsNum < 0) {
      alert('Informe um número válido de créditos.');
      return;
    }
    setSavingCredits(true);
    try {
      const res = await fetch(
        `${apiConfig.baseURL}/api/admin/users/${encodeURIComponent(modalUser.id)}/credits`,
        {
          method: 'PATCH',
          headers: {
            'x-admin-token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ credits: creditsNum, reason: modalReason.trim() || undefined }),
        }
      );
      if (!res.ok) {
        if (isAdminAuthError(res.status)) clearAdminToken();
        alert(getAdminErrorMessage(res.status));
        return;
      }
      closeCreditsModal();
      fetchUsers(search, page);
    } catch (e) {
      if (import.meta.env.DEV) console.error(e);
      alert(getAdminErrorMessage());
    } finally {
      setSavingCredits(false);
    }
  };

  const toggleBlock = async (u: AdminUserRow) => {
    if (!token) return;
    setOpenMenuId(null);
    try {
      const res = await fetch(
        `${apiConfig.baseURL}/api/admin/users/${encodeURIComponent(u.id)}/block`,
        {
          method: 'PATCH',
          headers: {
            'x-admin-token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blocked: u.emailVerified }),
        }
      );
      if (!res.ok) {
        if (isAdminAuthError(res.status)) clearAdminToken();
        alert(getAdminErrorMessage(res.status));
        return;
      }
      fetchUsers(search, page);
    } catch (e) {
      if (import.meta.env.DEV) console.error(e);
      alert(getAdminErrorMessage());
    }
  };

  const styles = {
    page: {
      padding: 24,
      background: '#111',
      minHeight: '100%',
      fontFamily: "'Inter', sans-serif",
      color: '#fff',
    },
    header: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      gap: 16,
      marginBottom: 20,
    },
    title: { fontSize: 20, fontWeight: 600, color: '#fff' },
    count: { fontSize: 13, color: '#888' },
    search: {
      flex: '1 1 280px',
      maxWidth: 400,
      padding: '10px 14px',
      borderRadius: 8,
      border: '1px solid #333',
      background: '#1a1a1a',
      color: '#fff',
      fontSize: 14,
    },
    card: {
      background: '#1a1a1a',
      borderRadius: 12,
      border: '1px solid #252525',
      overflow: 'hidden' as const,
    },
    tableWrap: { overflowX: 'auto' as const },
    table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
    th: {
      textAlign: 'left' as const,
      padding: '12px 14px',
      color: '#888',
      fontWeight: 600,
      borderBottom: '1px solid #252525',
      background: '#1a1a1a',
    },
    td: {
      padding: '12px 14px',
      borderBottom: '1px solid #252525',
      color: '#ccc',
    },
    badgeVerified: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
      background: '#00843D33',
      color: '#00843D',
    },
    badgeBlocked: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
      background: 'rgba(220, 53, 69, 0.2)',
      color: '#dc3545',
    },
    badgeCredits: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 500,
      background: 'rgba(0, 123, 255, 0.2)',
      color: '#007bff',
    },
    btnAction: {
      background: 'none',
      border: 'none',
      color: '#888',
      cursor: 'pointer',
      padding: 6,
      borderRadius: 6,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    dropdown: {
      position: 'absolute' as const,
      right: 0,
      top: '100%',
      marginTop: 4,
      minWidth: 180,
      background: '#252525',
      border: '1px solid #333',
      borderRadius: 8,
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
      zIndex: 50,
      padding: 4,
    },
    dropdownBtn: {
      width: '100%',
      textAlign: 'left' as const,
      padding: '10px 12px',
      border: 'none',
      background: 'none',
      color: '#ccc',
      cursor: 'pointer',
      borderRadius: 6,
      fontSize: 13,
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap' as const,
      gap: 12,
      padding: '14px 16px',
      borderTop: '1px solid #252525',
      background: '#1a1a1a',
    },
    paginationInfo: { fontSize: 13, color: '#888' },
    paginationBtns: { display: 'flex', gap: 8 },
    btnPagination: {
      padding: '8px 14px',
      borderRadius: 8,
      border: '1px solid #333',
      background: '#252525',
      color: '#fff',
      cursor: 'pointer',
      fontSize: 13,
    },
    modalOverlay: {
      position: 'fixed' as const,
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 24,
    },
    modal: {
      background: '#1a1a1a',
      borderRadius: 12,
      border: '1px solid #333',
      padding: 24,
      maxWidth: 400,
      width: '100%',
    },
    modalTitle: { fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#fff' },
    modalField: { marginBottom: 16 },
    modalLabel: { display: 'block', fontSize: 12, color: '#888', marginBottom: 6 },
    modalInput: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: 8,
      border: '1px solid #333',
      background: '#111',
      color: '#fff',
      fontSize: 14,
      boxSizing: 'border-box' as const,
    },
    modalActions: { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 },
    btnSecondary: {
      padding: '10px 18px',
      borderRadius: 8,
      border: '1px solid #333',
      background: 'transparent',
      color: '#ccc',
      cursor: 'pointer',
      fontSize: 13,
    },
    btnPrimary: {
      padding: '10px 18px',
      borderRadius: 8,
      border: 'none',
      background: '#00843D',
      color: '#fff',
      cursor: 'pointer',
      fontSize: 13,
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Usuários</h1>
        <span style={styles.count}>{total} usuário(s)</span>
        <input
          type="search"
          placeholder="Buscar por nome, e-mail ou telefone..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={styles.search}
          aria-label="Buscar usuários"
        />
      </div>

      <div style={styles.card}>
        <div style={styles.tableWrap}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
              <Loader2 size={24} style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              <div style={{ marginTop: 8 }}>Carregando...</div>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nome</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Telefone</th>
                  <th style={styles.th}>Verificado</th>
                  <th style={styles.th}>Créditos</th>
                  <th style={styles.th}>Gerações</th>
                  <th style={styles.th}>Pedidos</th>
                  <th style={styles.th}>Cadastro</th>
                  <th style={styles.th}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.name ?? '—'}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.phone ?? '—'}</td>
                    <td style={styles.td}>
                      <span style={u.emailVerified ? styles.badgeVerified : styles.badgeBlocked}>
                        {u.emailVerified ? 'Verificado' : 'Bloqueado'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badgeCredits}>{u.credits}</span>
                    </td>
                    <td style={styles.td}>{u.totalGenerations}</td>
                    <td style={styles.td}>{u.purchasedOrdersCount}</td>
                    <td style={styles.td}>{formatDatePtBr(u.createdAt)}</td>
                    <td style={styles.td}>
                      <div style={{ position: 'relative', display: 'inline-block' }} ref={openMenuId === u.id ? menuRef : null}>
                        <button
                          type="button"
                          style={styles.btnAction}
                          onClick={() => setOpenMenuId(openMenuId === u.id ? null : u.id)}
                          aria-label="Ações"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {openMenuId === u.id && (
                          <div style={styles.dropdown}>
                            <button
                              type="button"
                              style={styles.dropdownBtn}
                              onClick={() => openCreditsModal(u)}
                            >
                              Editar créditos
                            </button>
                            <button
                              type="button"
                              style={styles.dropdownBtn}
                              onClick={() => toggleBlock(u)}
                            >
                              {u.emailVerified ? 'Bloquear' : 'Desbloquear'}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {!loading && users.length > 0 && (
          <div style={styles.pagination}>
            <span style={styles.paginationInfo}>
              Página {page} de {totalPages}
            </span>
            <div style={styles.paginationBtns}>
              <button
                type="button"
                style={styles.btnPagination}
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <button
                type="button"
                style={styles.btnPagination}
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      {modalUser && (
        <div style={styles.modalOverlay} onClick={closeCreditsModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Editar créditos</h2>
            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Novo valor de créditos</label>
              <input
                type="number"
                min={0}
                value={modalCredits}
                onChange={(e) => setModalCredits(e.target.value)}
                style={styles.modalInput}
              />
            </div>
            <div style={styles.modalField}>
              <label style={styles.modalLabel}>Motivo (opcional)</label>
              <input
                type="text"
                value={modalReason}
                onChange={(e) => setModalReason(e.target.value)}
                placeholder="Ex: Ajuste manual"
                style={styles.modalInput}
              />
            </div>
            <div style={styles.modalActions}>
              <button type="button" style={styles.btnSecondary} onClick={closeCreditsModal} disabled={savingCredits}>
                Cancelar
              </button>
              <button type="button" style={styles.btnPrimary} onClick={saveCredits} disabled={savingCredits}>
                {savingCredits ? (
                  <>
                    <Loader2 size={14} style={{ display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />
                    Salvar
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
