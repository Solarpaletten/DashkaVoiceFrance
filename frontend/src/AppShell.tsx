// frontend/src/AppShell.tsx
import React from 'react';
import { useMediaQuery } from 'react-responsive';

// Основные экраны
import DualTranslator from './components/Dashboard/DualTranslator';
import DashboardTablet from './components/Dashboard/DashboardTablet';
import DashboardMobile from './components/Dashboard/DashboardMobile';

// Детский режим (будет использоваться в v1.4.0)
import KidsDashboard from './components/Dashboard/KidsDashboard';

// Dev-индикатор режима
import DeviceIndicator from './components/UI/DeviceIndicator';

function AppShell() {
  // ✅ Определяем тип устройства
  const isDesktop = useMediaQuery({ minWidth: 1025 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // ✅ Флаг для детского режима (в будущем можно брать из настроек или localStorage)
  const kidsMode = false; // true — включает детский интерфейс

  // 🔧 Основная логика выбора дашборда
  if (kidsMode) {
    return (
      <>
        <KidsDashboard />
        {process.env.NODE_ENV === 'development' && <DeviceIndicator />}
      </>
    );
  }

  if (isDesktop) {
    return (
      <>
        <DualTranslator />
        {process.env.NODE_ENV === 'development' && <DeviceIndicator />}
      </>
    );
  }

  if (isTablet) {
    return (
      <>
        <DashboardTablet />
        {process.env.NODE_ENV === 'development' && <DeviceIndicator />}
      </>
    );
  }

  if (isMobile) {
    return (
      <>
        <DashboardMobile />
        {process.env.NODE_ENV === 'development' && <DeviceIndicator />}
      </>
    );
  }

  // 🧩 Fallback — на случай неопределённого разрешения
  return (
    <>
      <DualTranslator />
      {process.env.NODE_ENV === 'development' && <DeviceIndicator />}
    </>
  );
}

export default AppShell;
