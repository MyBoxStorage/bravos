/**
 * Utilitários para detecção de dispositivo e plataforma
 * 
 * Usado para adaptar a experiência de checkout entre web e mobile
 */

/**
 * Detecta se o dispositivo é mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  
  // Regex para detectar dispositivos móveis
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  return mobileRegex.test(userAgent.toLowerCase());
}

/**
 * Detecta se o dispositivo é tablet
 */
export function isTabletDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  
  // Tablets geralmente têm "tablet" no user agent ou são iPads
  const tabletRegex = /(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i;
  
  return tabletRegex.test(userAgent.toLowerCase());
}

/**
 * Detecta a plataforma do dispositivo
 */
export type Platform = 'ios' | 'android' | 'web';

export function getPlatform(): Platform {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera;
  
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'ios';
  }
  
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  return 'web';
}

/**
 * Detecta se está em ambiente mobile (mobile ou tablet)
 */
export function isMobileEnvironment(): boolean {
  return isMobileDevice() || isTabletDevice();
}

/**
 * Detecta se deve usar redirecionamento ao invés de Brick
 * (para mobile, é melhor redirecionar para o app do Mercado Pago)
 */
export function shouldUseRedirect(): boolean {
  return isMobileEnvironment();
}

/**
 * Obtém informações completas do dispositivo
 */
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  platform: Platform;
  userAgent: string;
  shouldUseRedirect: boolean;
}

export function getDeviceInfo(): DeviceInfo {
  const userAgent = typeof window !== 'undefined' 
    ? (window.navigator.userAgent || window.navigator.vendor || (window as any).opera || '')
    : '';
  
  return {
    isMobile: isMobileDevice(),
    isTablet: isTabletDevice(),
    platform: getPlatform(),
    userAgent,
    shouldUseRedirect: shouldUseRedirect(),
  };
}
