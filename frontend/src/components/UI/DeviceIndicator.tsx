import React, { useEffect, useState } from 'react';

/**
 * DeviceIndicator — мини-компонент для отображения текущего режима экрана:
 * Desktop / Tablet / Mobile.
 * Использует отслеживание ширины окна и автоматически обновляется при ресайзе.
 */
const DeviceIndicator: React.FC = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 700) setDevice('mobile');
      else if (width < 900) setDevice('tablet');
      else setDevice('desktop');
    };

    handleResize(); // первичная проверка
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const label =
    device === 'mobile'
      ? '📱 Mobile version'
      : device === 'tablet'
      ? '💻 Tablet version'
      : '🖥️ Desktop version';

  const color =
    device === 'mobile'
      ? 'bg-green-500'
      : device === 'tablet'
      ? 'bg-yellow-500'
      : 'bg-blue-500';

  return (
    <div
      className={`fixed bottom-3 right-3 px-3 py-2 rounded-lg shadow-lg text-white text-xs font-medium ${color} bg-opacity-80 backdrop-blur-md transition-all`}
    >
      {label}
    </div>
  );
};

export default DeviceIndicator;
