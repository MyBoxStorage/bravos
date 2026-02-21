import { Resend } from 'resend';

const FROM = 'Bravos Brasil <noreply@bravosbrasil.com.br>';

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

interface WelcomeEmailData {
  name: string;
  email: string;
}

export async function sendWelcomeEmail(data: { name: string; email: string }) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await getResend().emails.send({
      from: FROM,
      to: data.email,
      subject: 'Bem-vindo à Bravos Brasil — Seus 5 créditos estão esperando',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">

          <!-- Header -->
          <div style="background: #00843D; padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <p style="color: #FFCC29; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px; font-weight: bold;">MODA PATRIÓTICA</p>
            <h1 style="color: #ffffff; font-size: 36px; margin: 0; letter-spacing: 4px; font-weight: 900;">BRAVOS BRASIL</h1>
            <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 12px 0 0; letter-spacing: 1px;">Veste seus valores</p>
          </div>

          <!-- Hero message -->
          <div style="background: #002776; padding: 32px; text-align: center;">
            <p style="color: #FFCC29; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 8px; font-weight: bold;">BEM-VINDO À FAMÍLIA</p>
            <h2 style="color: #ffffff; font-size: 24px; margin: 0; font-weight: 700;">Olá, ${data.name.split(' ')[0]}!</h2>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin: 12px 0 0; line-height: 1.6;">Sua conta foi criada com sucesso.<br>Você já pode explorar toda a coleção patriótica.</p>
          </div>

          <!-- Credits badge -->
          <div style="padding: 32px; background: #f9fafb; text-align: center; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
            <div style="display: inline-block; background: #FFCC29; border-radius: 50px; padding: 16px 32px;">
              <p style="color: #002776; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 4px;">Presente de boas-vindas</p>
              <p style="color: #002776; font-size: 28px; font-weight: 900; margin: 0;">🎁 5 CRÉDITOS GRÁTIS</p>
            </div>
            <p style="color: #6b7280; font-size: 13px; margin: 16px 0 0; line-height: 1.6;">Use seus créditos para criar estampas exclusivas<br>com Inteligência Artificial no Gerador de Estampas.</p>
          </div>

          <!-- Features -->
          <div style="padding: 32px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
            <p style="color: #111827; font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 20px;">O que você pode fazer agora</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; width: 36px;">
                  <div style="width: 28px; height: 28px; background: #00843D; border-radius: 50%; text-align: center; line-height: 28px; font-size: 13px;">✦</div>
                </td>
                <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f3f4f6;">
                  <p style="color: #111827; font-size: 14px; font-weight: bold; margin: 0 0 2px;">Explorar a Coleção Patriota</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 0;">Camisetas exclusivas que celebram a brasilidade</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6; vertical-align: top; width: 36px;">
                  <div style="width: 28px; height: 28px; background: #00843D; border-radius: 50%; text-align: center; line-height: 28px; font-size: 13px;">✦</div>
                </td>
                <td style="padding: 12px 0 12px 12px; border-bottom: 1px solid #f3f4f6;">
                  <p style="color: #111827; font-size: 14px; font-weight: bold; margin: 0 0 2px;">Criar Estampas com IA</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 0;">Gere artes exclusivas usando seus 5 créditos</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; vertical-align: top; width: 36px;">
                  <div style="width: 28px; height: 28px; background: #00843D; border-radius: 50%; text-align: center; line-height: 28px; font-size: 13px;">✦</div>
                </td>
                <td style="padding: 12px 0 12px 12px;">
                  <p style="color: #111827; font-size: 14px; font-weight: bold; margin: 0 0 2px;">Personalizar via WhatsApp</p>
                  <p style="color: #6b7280; font-size: 13px; margin: 0;">Fale com nossa equipe para pedidos especiais</p>
                </td>
              </tr>
            </table>
          </div>

          <!-- CTA -->
          <div style="padding: 32px; text-align: center; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">
            <a href="https://bravosbrasil.com.br" style="display: inline-block; background: #00843D; color: #FFCC29; text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; padding: 16px 40px; border-radius: 50px;">
              ACESSAR MINHA CONTA →
            </a>
          </div>

          <!-- Footer -->
          <div style="background: #111827; padding: 24px 32px; text-align: center; border-radius: 0 0 12px 12px;">
            <p style="color: #FFCC29; font-size: 16px; font-weight: bold; letter-spacing: 3px; margin: 0 0 8px;">BRAVOS BRASIL</p>
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0; line-height: 1.6;">
              Dúvidas? Fale conosco pelo WhatsApp<br>
              Este é um e-mail automático, não é necessário responder.
            </p>
          </div>

        </div>
      `,
    });
  } catch (err) {
    console.error('Erro ao enviar e-mail de boas-vindas:', err);
  }
}

export async function sendVerificationEmail(data: { name: string; email: string; token: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️  Email não configurado');
    return;
  }
  try {
    await getResend().emails.send({
      from: FROM,
      to: data.email,
      subject: 'Confirme seu e-mail — Bravos Brasil',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #fff; border-radius: 12px; border: 1px solid #e5e7eb;">
          <h2 style="color: #00843D; font-size: 24px; margin-bottom: 8px;">Confirme seu e-mail</h2>
          <p style="color: #374151; margin-bottom: 24px;">Olá, ${data.name}! Use o código abaixo para confirmar sua conta:</p>
          <div style="background: #f9fafb; border: 2px dashed #00843D; border-radius: 8px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: bold; color: #002776; letter-spacing: 8px;">${data.token}</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">O código expira em <strong>15 minutos</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">Se não foi você, ignore este e-mail.</p>
        </div>
      `,
    });
    console.log('✅ Verification email sent to:', data.email);
  } catch (err) {
    console.error('Erro ao enviar e-mail de verificação:', err);
  }
}

export interface OrderConfirmationData {
  name: string;
  email: string;
  orderId: string;
  total: number;
  shippingCost: number;
  couponCode?: string;
  couponDiscount: number;
  items: { name: string; color: string; size: string; quantity: number; unitPrice: number }[];
  shippingAddress: string;
}

export async function sendOrderConfirmationEmail(
  data: OrderConfirmationData
): Promise<{ data?: { id: string }; error?: unknown } | undefined> {
  if (!process.env.RESEND_API_KEY) return;

  const itemsHtml = data.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-family: Arial, sans-serif; font-size: 14px; color: #374151;">
        ${item.name}${item.color ? ` — ${item.color}` : ''}${item.size ? ` / ${item.size}` : ''}
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #374151;">
        ${item.quantity}x
      </td>
      <td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-family: Arial, sans-serif; font-size: 14px; color: #374151;">
        R$ ${(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}
      </td>
    </tr>
  `
    )
    .join('');

  try {
    const { data: resData, error } = await getResend().emails.send({
      from: FROM,
      to: data.email,
      subject: `✅ Pedido confirmado — Bravos Brasil #${data.orderId.slice(-6).toUpperCase()}`,
      html: `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #ffffff;">

  <!-- 1. HEADER -->
  <div style="background: linear-gradient(135deg, #002776 0%, #00843D 100%); padding: 40px 24px; text-align: center;">
    <h1 style="color: #FFCC29; font-size: 32px; margin: 0; letter-spacing: 4px; font-weight: bold;">BRAVOS BRASIL</h1>
    <p style="color: #ffffff; font-size: 16px; margin: 12px 0 0; letter-spacing: 1px;">Pedido Confirmado</p>
  </div>

  <!-- 2. CARTA (bloco pergaminho) -->
  <div style="background: #F5E6C8; border: 2px solid #8B6914; border-radius: 4px; margin: 24px 20px; padding: 40px;">
    <h2 style="font-family: Georgia, serif; color: #002776; font-size: 24px; margin: 0 0 24px; font-weight: bold;">Uma carta para você, Bravo.</h2>
    <p style="font-family: Georgia, serif; color: #3D2B00; font-size: 16px; line-height: 1.9; margin: 0;">
      Hoje você fez mais do que uma compra.<br><br>
      Você escolheu um lado.<br><br>
      Num país que tantas vezes tenta nos calar, você levantou a cabeça e disse: sou brasileiro e tenho orgulho disso.<br><br>
      Cada peça Bravos Brasil carrega mais do que tecido e estampa — carrega convicção. A convicção de quem não se rende, de quem acredita no Brasil mesmo quando é difícil, de quem veste seus valores com orgulho todos os dias.<br><br>
      Você agora faz parte de um time que se recusa a baixar a cabeça.<br><br>
      Bem-vindo. Você estava faltando aqui.<br><br>
      Com orgulho e gratidão,
    </p>
    <p style="font-family: Georgia, serif; font-style: italic; color: #00843D; font-size: 20px; margin: 16px 0 0;">Equipe Bravos Brasil 🇧🇷</p>
    <div style="border-top: 1px dashed #8B6914; margin: 24px 0;"></div>
  </div>

  <!-- 3. RESUMO DO PEDIDO -->
  <div style="padding: 0 20px 24px;">
    <!-- Número do pedido -->
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Número do pedido</p>
      <p style="color: #002776; font-size: 20px; font-weight: bold; margin: 0; font-family: Arial, sans-serif;">#${data.orderId.slice(-6).toUpperCase()}</p>
    </div>

    <!-- Itens -->
    <h3 style="color: #00843D; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px; font-family: Arial, sans-serif;">Itens do pedido</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      ${itemsHtml}
    </table>

    <!-- Totais -->
    <div style="border-top: 2px solid #e5e7eb; padding-top: 16px; margin-bottom: 24px;">
      <table style="width: 100%; border-collapse: collapse;">
        ${data.shippingCost > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif;">Frete</td>
          <td style="padding: 8px 0; color: #374151; font-size: 14px; font-family: Arial, sans-serif; text-align: right;">R$ ${data.shippingCost.toFixed(2).replace('.', ',')}</td>
        </tr>` : `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif;">Frete</td>
          <td style="padding: 8px 0; color: #00843D; font-size: 14px; font-weight: bold; font-family: Arial, sans-serif; text-align: right;">Grátis</td>
        </tr>`}
        ${data.couponDiscount > 0 ? `
        <tr>
          <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-family: Arial, sans-serif;">Cupom ${data.couponCode ?? ''}</td>
          <td style="padding: 8px 0; color: #00843D; font-size: 14px; font-family: Arial, sans-serif; text-align: right;">− R$ ${data.couponDiscount.toFixed(2).replace('.', ',')}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 12px 0 0; border-top: 1px solid #e5e7eb; color: #111827; font-size: 16px; font-weight: bold; font-family: Arial, sans-serif;">Total</td>
          <td style="padding: 12px 0 0; border-top: 1px solid #e5e7eb; color: #00843D; font-size: 18px; font-weight: bold; font-family: Arial, sans-serif; text-align: right;">R$ ${data.total.toFixed(2).replace('.', ',')}</td>
        </tr>
      </table>
    </div>

    <!-- Endereço -->
    ${data.shippingAddress ? `
    <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, sans-serif;">Endereço de entrega</p>
      <p style="color: #374151; font-size: 14px; margin: 0; font-family: Arial, sans-serif;">${data.shippingAddress}</p>
    </div>` : ''}

    <!-- CTA -->
    <div style="text-align: center; margin-top: 24px;">
      <a href="https://bravosbrasil.com.br/order" style="display: inline-block; background: #00843D; color: #FFCC29; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 32px; border-radius: 50px; letter-spacing: 1px; font-family: Arial, sans-serif;">
        ACOMPANHAR MEU PEDIDO
      </a>
    </div>
  </div>

  <!-- 4. FOOTER -->
  <div style="background: #002776; padding: 24px; text-align: center;">
    <p style="color: #ffffff; font-size: 14px; margin: 0 0 8px; font-family: Arial, sans-serif;">Bravos Brasil — Veste seus valores.</p>
    <p style="color: #FFCC29; font-size: 12px; margin: 0; font-family: Arial, sans-serif;">Dúvidas? WhatsApp ou responda este e-mail.</p>
  </div>
</div>
      `,
    });
    console.log('✅ Order confirmation email sent to:', data.email);
    return { data: resData ?? undefined, error: error ?? undefined };
  } catch (err) {
    console.error('Erro ao enviar email de confirmação de pedido:', err);
    throw err;
  }
}

export interface OrderStatusEmailData {
  name: string;
  email: string;
  orderId: string;
  status: 'READY_FOR_MONTINK' | 'SENT_TO_MONTINK';
  externalReference: string;
}

export async function sendOrderStatusEmail(data: OrderStatusEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  const statusConfig = {
    READY_FOR_MONTINK: {
      emoji: '⚙️',
      label: 'Em Preparação',
      message: 'Seu pedido foi confirmado e já está sendo preparado pela nossa equipe.',
      detail: 'Em breve você receberá uma nova notificação quando seu pedido for enviado.',
      color: '#002776',
    },
    SENT_TO_MONTINK: {
      emoji: '🚚',
      label: 'Enviado para Produção',
      message: 'Seu pedido foi enviado para produção e está a caminho!',
      detail: 'Acompanhe o status do seu pedido pelo link abaixo.',
      color: '#00843D',
    },
  };

  const config = statusConfig[data.status];

  try {
    await getResend().emails.send({
      from: FROM,
      to: data.email,
      subject: `${config.emoji} Pedido ${config.label} — Bravos Brasil #${data.externalReference.slice(-6).toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
          
          <!-- Header -->
          <div style="background: #00843D; padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <p style="color: #FFCC29; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px; font-weight: bold;">ATUALIZAÇÃO DO PEDIDO</p>
            <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px; font-weight: 900;">BRAVOS BRASIL</h1>
          </div>

          <!-- Status banner -->
          <div style="background: ${config.color}; padding: 24px 32px; text-align: center;">
            <p style="font-size: 32px; margin: 0 0 8px;">${config.emoji}</p>
            <h2 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700;">${config.label}</h2>
          </div>

          <!-- Body -->
          <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 8px;">Olá, <strong>${data.name.split(' ')[0]}</strong>!</p>
            <p style="color: #374151; font-size: 15px; margin: 0 0 24px; line-height: 1.6;">${config.message}</p>

            <!-- Número do pedido -->
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 1px;">Número do pedido</p>
              <p style="color: #002776; font-size: 20px; font-weight: bold; margin: 0;">#${data.externalReference.slice(-6).toUpperCase()}</p>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">${config.detail}</p>

            <!-- CTA -->
            <div style="text-align: center;">
              <a href="https://bravosbrasil.com.br/order?ref=${encodeURIComponent(data.externalReference)}" style="display: inline-block; background: #00843D; color: #FFCC29; text-decoration: none; font-size: 14px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; padding: 16px 40px; border-radius: 50px;">
                ACOMPANHAR PEDIDO →
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
              Dúvidas? Entre em contato via WhatsApp.<br>
              Bravos Brasil — Veste seus valores.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Erro ao enviar email de status do pedido:', err);
  }
}

// ==================== WELCOME COUPON EMAIL (Newsletter) ====================

export async function sendWelcomeCouponEmail(email: string) {
  if (!process.env.RESEND_API_KEY) return;
  try {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: '🎁 Seu cupom de 10% OFF está aqui — Bravos Brasil',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">
          <div style="background: #00843D; padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <p style="color: #FFCC29; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px; font-weight: bold;">PRESENTE EXCLUSIVO</p>
            <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px; font-weight: 900;">BRAVOS BRASIL</h1>
          </div>
          <div style="background: #002776; padding: 28px 32px; text-align: center;">
            <p style="font-size: 48px; margin: 0 0 8px;">🎁</p>
            <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 4px; font-weight: 700;">Seu desconto está esperando!</h2>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin: 0;">Use na sua primeira compra</p>
          </div>
          <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <div style="background: #f9fafb; border: 2px dashed #00843D; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Seu cupom exclusivo</p>
              <p style="color: #00843D; font-size: 36px; font-weight: 900; letter-spacing: 6px; margin: 0 0 8px;">BEMVINDO10</p>
              <p style="color: #002776; font-size: 20px; font-weight: bold; margin: 0;">10% OFF na primeira compra</p>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0 0 24px;">
              ⚠️ Cupom válido para uma única utilização.<br>
              <strong>Não acumulável</strong> com outras promoções ou cupons.
            </p>
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://bravosbrasil.com.br/catalogo" style="display: inline-block; background: #00843D; color: #FFCC29; text-decoration: none; font-size: 15px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; padding: 18px 40px; border-radius: 50px;">
                USAR MEU DESCONTO →
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">Bravos Brasil — Veste seus valores.</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Erro ao enviar email de cupom:', err);
  }
}

// ==================== ABANDONED CART EMAIL ====================

export interface AbandonedCartEmailData {
  name: string;
  email: string;
  orderId: string;
  externalReference: string;
  items: { name: string; color: string; size: string; quantity: number; unitPrice: number }[];
  total: number;
}

export async function sendAbandonedCartEmail(data: AbandonedCartEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;">
        <p style="font-family: Arial, sans-serif; font-size: 14px; color: #111827; font-weight: bold; margin: 0 0 2px;">${item.name}</p>
        <p style="font-family: Arial, sans-serif; font-size: 12px; color: #6b7280; margin: 0;">${[item.size, item.color].filter(Boolean).join(' · ')}</p>
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #374151;">${item.quantity}x</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-family: Arial, sans-serif; font-size: 14px; color: #374151;">R$ ${(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')}</td>
    </tr>
  `).join('');

  try {
    await getResend().emails.send({
      from: FROM,
      to: data.email,
      subject: `🛒 Você esqueceu algo — Bravos Brasil`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff;">

          <!-- Header -->
          <div style="background: #00843D; padding: 40px 32px; text-align: center; border-radius: 12px 12px 0 0;">
            <p style="color: #FFCC29; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0 0 8px; font-weight: bold;">SEU CARRINHO ESTÁ ESPERANDO</p>
            <h1 style="color: #ffffff; font-size: 32px; margin: 0; letter-spacing: 4px; font-weight: 900;">BRAVOS BRASIL</h1>
          </div>

          <!-- Hero -->
          <div style="background: #002776; padding: 28px 32px; text-align: center;">
            <p style="font-size: 40px; margin: 0 0 8px;">🛒</p>
            <h2 style="color: #ffffff; font-size: 22px; margin: 0 0 8px; font-weight: 700;">Olá, ${data.name.split(' ')[0]}!</h2>
            <p style="color: rgba(255,255,255,0.75); font-size: 14px; margin: 0; line-height: 1.6;">Você deixou itens no carrinho.<br>Eles ainda estão reservados para você!</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">

            <!-- Itens -->
            <h3 style="color: #00843D; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Itens no seu carrinho</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              ${itemsHtml}
            </table>

            <!-- Total -->
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <table style="width: 100%;"><tr>
                <td style="font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; color: #111827;">Total</td>
                <td style="font-family: Arial, sans-serif; font-size: 18px; font-weight: bold; color: #00843D; text-align: right;">R$ ${data.total.toFixed(2).replace('.', ',')}</td>
              </tr></table>
            </div>

            <!-- Urgência -->
            <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px; text-align: center;">
              <p style="font-family: Arial, sans-serif; font-size: 13px; color: #92400e; margin: 0;">⏳ Seu pedido será cancelado automaticamente em <strong>24 horas</strong> se não for finalizado.</p>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="https://bravosbrasil.com.br/order?ref=${encodeURIComponent(data.externalReference)}" style="display: inline-block; background: #00843D; color: #FFCC29; text-decoration: none; font-size: 15px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; padding: 18px 40px; border-radius: 50px;">
                FINALIZAR MINHA COMPRA →
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              Dúvidas? Fale conosco via WhatsApp.<br>
              Bravos Brasil — Veste seus valores.
            </p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error('Erro ao enviar email de carrinho abandonado:', err);
  }
}
