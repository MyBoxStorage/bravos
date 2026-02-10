import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCcw, Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CheckoutFailure() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get('payment_id');
  const statusDetail = searchParams.get('status_detail');
  
  const getErrorMessage = (detail: string | null) => {
    const messages: Record<string, string> = {
      'cc_rejected_insufficient_amount': 'Saldo insuficiente no cartão',
      'cc_rejected_bad_filled_security_code': 'Código de segurança inválido',
      'cc_rejected_bad_filled_date': 'Data de vencimento inválida',
      'cc_rejected_bad_filled_other': 'Verifique os dados do cartão',
      'cc_rejected_call_for_authorize': 'Entre em contato com seu banco',
      'cc_rejected_card_disabled': 'Cartão desabilitado',
      'cc_rejected_duplicated_payment': 'Pagamento duplicado',
      'cc_rejected_max_attempts': 'Tentativas excedidas',
    };
    
    return detail ? messages[detail] || 'Pagamento recusado pela operadora' : 'Ocorreu um erro no processamento';
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 p-4">
      <Card className="max-w-lg w-full shadow-2xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <XCircle className="w-24 h-24 text-red-500 mx-auto" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Pagamento Recusado
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Não foi possível processar seu pagamento.
          </p>
          
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {getErrorMessage(statusDetail)}
            </AlertDescription>
          </Alert>
          
          {paymentId && (
            <p className="text-sm text-gray-500 mb-8">
              ID da Tentativa: <span className="font-mono">{paymentId}</span>
            </p>
          )}
          
          <div className="space-y-3">
            <Link to="/" className="block">
              <Button className="w-full" size="lg" variant="default">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </Link>
            
            <Link to="/" className="block">
              <Button className="w-full" size="lg" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                Voltar para a Loja
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Dicas:</strong>
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1 text-left">
              <li>• Verifique os dados do cartão</li>
              <li>• Certifique-se de ter saldo disponível</li>
              <li>• Tente outro método de pagamento</li>
              <li>• Entre em contato com seu banco se necessário</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
