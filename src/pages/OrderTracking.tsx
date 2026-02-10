/**
 * Página para acompanhar pedido
 * Rota: /order
 * 
 * Permite buscar pedido por email + externalReference
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, MapPin, Loader2, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getOrder } from '@/services/orders';
import type { OrderResponse } from '@/types/order';
import { getOrderStatusLabel } from '@/types/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

export default function OrderTracking() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [externalReference, setExternalReference] = useState('');
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !externalReference) {
      toast.error('Preencha email e número do pedido');
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const orderData = await getOrder(externalReference, email);
      
      // Se o backend retornou 200, email foi validado com sucesso
      setOrder(orderData);
      toast.success('Pedido encontrado!');
    } catch (err: any) {
      console.error('Erro ao buscar pedido:', err);
      // Não vazar informações específicas
      setError('Pedido não encontrado ou email não corresponde');
      toast.error('Não foi possível encontrar o pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Package className="w-6 h-6" />
              Acompanhar Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="externalReference">Número do Pedido</Label>
                <Input
                  id="externalReference"
                  type="text"
                  placeholder="BRAVOS-..."
                  value={externalReference}
                  onChange={(e) => setExternalReference(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Buscar Pedido
                  </>
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {order && (
              <div className="space-y-4 mt-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Número do Pedido</p>
                      <p className="text-2xl font-mono font-bold text-blue-900">
                        #{order.externalReference}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-700 mb-1">Status</p>
                      <p className="text-lg font-semibold text-blue-900">
                        {getOrderStatusLabel(order.status)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Resumo do Pedido</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">{formatCurrency(order.totals.subtotal)}</span>
                    </div>
                    {order.totals.discountTotal > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Desconto:</span>
                        <span className="font-medium">-{formatCurrency(order.totals.discountTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frete:</span>
                      <span className="font-medium">{formatCurrency(order.totals.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-gray-900">{formatCurrency(order.totals.total)}</span>
                    </div>
                  </div>

                  {order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Itens ({order.items.length}):</p>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="text-xs text-gray-600">
                            {item.quantity}x {item.name || `Produto ${item.productId.substring(0, 8)}`}
                            {item.size && ` - Tamanho: ${item.size}`}
                            {item.color && ` - Cor: ${item.color}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {order.shipping.address1 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div className="text-xs text-gray-600">
                          <p className="font-medium">{order.shipping.address1}</p>
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

                  {order.montinkOrderId && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs font-medium text-gray-700 mb-1">ID Montink:</p>
                      <p className="text-xs font-mono text-gray-600">{order.montinkOrderId}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/')}
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para a Loja
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
