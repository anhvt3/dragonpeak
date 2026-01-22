import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'pc';

const BREAKPOINT = 768;

export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < BREAKPOINT ? 'mobile' : 'pc';
    }
    return 'mobile';
  });

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(window.innerWidth < BREAKPOINT ? 'mobile' : 'pc');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}
