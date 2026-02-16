import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Home, MapPin, Loader2, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import { getOrder } from '@/services/orders';
import type { OrderResponse } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference') ?? searchParams.get('ref');

  const [trackOrderRef] = useState<string | null>(() => {
    const fromUrl = searchParams.get('ref') ?? searchParams.get('external_reference');
    if (fromUrl) return fromUrl;
    try {
      const raw = localStorage.getItem('bb_order_pending');
      if (!raw) return null;
      const data = JSON.parse(raw) as { externalReference?: string };
      return data.externalReference ?? null;
    } catch {
      return null;
    }
  });

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const pendingEmailRef = useRef<string | null>(null);

  useEffect(() => {
    const refToLoad = trackOrderRef ?? externalReference;
    if (!refToLoad) {
      setLoading(false);
      return;
    }

    let pendingEmail: string | null = null;
    try {
      const pendingRaw = localStorage.getItem('bb_order_pending');
      const pending = pendingRaw ? (JSON.parse(pendingRaw) as { externalReference?: string; email?: string } | null) : null;
      if (pending?.externalReference === refToLoad) {
        pendingEmail = pending?.email ?? null;
      }
      pendingEmailRef.current = pendingEmail;
    } catch {
      pendingEmailRef.current = null;
    }

    if (!refToLoad || !pendingEmail) {
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      try {
        const orderData = await getOrder(refToLoad, pendingEmail!);
        setOrder(orderData);
      } catch {
        toast.error('Erro ao carregar detalhes do pedido');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [trackOrderRef, externalReference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00843D]/10 via-[#00843D]/5 to-[#FFCC29]/10 p-4">
      <Card className="max-w-lg w-full shadow-2xl border-0 rounded-xl overflow-hidden">
        <CardContent className="p-6 sm:p-8 text-center">
          {/* Ícone Principal com animação scale suave */}
          <div className="mb-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-[#00843D]/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              <CheckCircle className="w-20 h-20 sm:w-24 sm:h-24 text-[#00843D] relative z-10" />
            </div>
          </div>

          {/* Título com font-display (Bebas Neue) */}
          <h1 className="font-display text-3xl sm:text-4xl text-[#002776] mb-3 tracking-wide">
            Pagamento Aprovado! 🎉
          </h1>

          {/* Subtítulo */}
          <p className="text-base sm:text-lg text-[#002776]/70 mb-6 sm:mb-8 font-body">
            Seu pedido foi confirmado com sucesso e já está sendo processado.
          </p>

          {/* Badge de Status Aprovado */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-[#00843D]/15 text-[#00843D] border border-[#00843D]/30 rounded-full px-4 py-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Pagamento Confirmado
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#00843D]" />
            </div>
          ) : (
            <>
              {/* Card do Número do Pedido - com cores da marca */}
              {(externalReference || trackOrderRef) && (
                <div className="bg-gradient-to-r from-[#00843D]/10 to-[#00843D]/5 rounded-xl p-5 sm:p-6 mb-6 border border-[#00843D]/30 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-[#00843D]/10 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-[#00843D]" />
                    </div>
                    <p className="text-sm font-medium text-[#00843D] font-body">Número do Pedido</p>
                  </div>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-[#002776]">
                    #{externalReference || trackOrderRef}
                  </p>
                </div>
              )}

              {/* Aviso quando não tem order - com amarelo da marca */}
              {!loading && trackOrderRef && !order && (
                <div className="text-sm text-[#002776] bg-[#FFCC29]/10 border border-[#FFCC29]/30 rounded-xl p-4 mb-4 font-body">
                  Para acompanhar, use o botão abaixo e informe seu e-mail.
                </div>
              )}

              {/* Resumo do Pedido */}
              {order && (
                <div className="mb-6 space-y-4">
                  <div className="bg-white rounded-xl border border-[#002776]/10 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-[#00843D]/10 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#00843D]" />
                      </div>
                      <h3 className="font-display text-lg text-[#002776] tracking-wide">Resumo do Pedido</h3>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-[#002776]/60 font-body">Subtotal:</span>
                        <span className="font-medium text-[#002776] font-body">{formatCurrency(order.totals.subtotal)}</span>
                      </div>
                      {order.totals.discountTotal > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-[#00843D] font-body">Desconto:</span>
                          <span className="font-medium text-[#00843D] font-body">-{formatCurrency(order.totals.discountTotal)}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-[#002776]/60 font-body">Frete:</span>
                        <span className="font-medium text-[#002776] font-body">{formatCurrency(order.totals.shippingCost)}</span>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-[#002776]/10 items-center">
                        <span className="font-semibold text-[#002776] font-body">Total:</span>
                        <span className="font-bold text-lg sm:text-xl text-[#00843D] font-body">{formatCurrency(order.totals.total)}</span>
                      </div>
                    </div>

                    {order.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-[#002776]/10">
                        <p className="text-xs font-medium text-[#002776]/70 mb-2 font-body">Itens ({order.items.length}):</p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-[#002776]/60 font-body">
                              {item.quantity}x {item.name || `Produto ${item.productId.substring(0, 8)}`}
                              {item.size && <span className="text-[#002776]/40"> — Tamanho: {item.size}</span>}
                              {item.color && <span className="text-[#002776]/40"> — Cor: {item.color}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.shipping.address1 && (
                      <div className="mt-4 pt-4 border-t border-[#002776]/10">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#002776]/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                            <MapPin className="w-4 h-4 text-[#002776]" />
                          </div>
                          <div className="text-xs text-[#002776]/70 font-body text-left">
                            <p className="font-medium text-[#002776]">{order.shipping.address1}</p>
                            {order.shipping.number && <p>Nº {order.shipping.number}</p>}
                            {order.shipping.complement && <p>{order.shipping.complement}</p>}
                            {order.shipping.district && <p>{order.shipping.district}</p>}
                            {order.shipping.city && order.shipping.state && (
                              <p>{order.shipping.city} - {order.shipping.state}</p>
                            )}
                            {order.shipping.cep && <p>CEP: {order.shipping.cep}</p>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Alerta "Próximos passos" - com verde da marca */}
              <div className="mb-6 p-4 sm:p-5 bg-[#00843D]/5 rounded-xl border border-[#00843D]/20">
                <p className="text-sm text-[#00843D] font-body leading-relaxed">
                  <strong className="font-semibold">Próximos passos:</strong> Estamos preparando seu pedido para envio.
                </p>
              </div>
            </>
          )}

          {/* ID do Pagamento */}
          {paymentId && (
            <p className="text-sm text-[#002776]/50 mb-4 font-body">
              ID do Pagamento: <span className="font-mono">{paymentId}</span>
            </p>
          )}

          {/* Botões de Ação */}
          <div className="space-y-3">
            {trackOrderRef ? (
              <Button
                className="w-full bg-[#00843D] hover:bg-[#006633] text-white rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                size="lg"
                onClick={() => {
                  const emailForState = pendingEmailRef.current ?? undefined;
                  navigate(`/order?ref=${encodeURIComponent(trackOrderRef)}`, {
                    state: { ref: trackOrderRef, email: emailForState },
                  });
                  localStorage.removeItem('bb_order_pending');
                  localStorage.removeItem('pixPaymentData');
                }}
                aria-label="Acompanhar meu pedido"
              >
                <PackageSearch className="w-4 h-4 mr-2" />
                Acompanhar meu pedido
              </Button>
            ) : (
              <p className="text-sm text-[#002776]/60 py-2 font-body">
                Consulte seu e-mail para acompanhar o pedido.
              </p>
            )}
            <Link to="/" className="block">
              <Button
                className="w-full border-2 border-[#00843D] text-[#00843D] hover:bg-[#00843D] hover:text-white rounded-lg transition-all duration-300"
                size="lg"
                variant="outline"
                aria-label="Voltar para a Loja"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para a Loja
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-xs text-[#002776]/50 mt-6 font-body">
            Você receberá um email de confirmação em breve com os detalhes do pedido.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
