/**
 * Hook para detectar informações do dispositivo
 * 
 * Retorna informações sobre o dispositivo atual (mobile, tablet, web)
 */

import { useState, useEffect } from 'react';
import { getDeviceInfo, type DeviceInfo, type Platform } from '@/utils/device-detection';

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());

  useEffect(() => {
    // Atualizar informações do dispositivo
    setDeviceInfo(getDeviceInfo());

    // Listener para mudanças de orientação (mobile)
    const handleResize = () => {
      setDeviceInfo(getDeviceInfo());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return {
    ...deviceInfo,
    isWeb: !deviceInfo.isMobile && !deviceInfo.isTablet,
  };
}

/**
 * Hook simplificado para verificar se é mobile
 */
export function useIsMobile() {
  const { isMobile, isTablet } = useDevice();
  return isMobile || isTablet;
}

/**
 * Hook para obter a plataforma
 */
export function usePlatform(): Platform {
  const { platform } = useDevice();
  return platform;
}
