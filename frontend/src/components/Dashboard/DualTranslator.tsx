import React, { useEffect, useRef, useState } from 'react';
import { useTranslator } from '../../hooks/useTranslator';

const useDeviceType = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 700) setDevice('mobile');
      else if (width < 900) setDevice('tablet');
      else setDevice('desktop');
    };

    handleResize(); // Первичная проверка
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
};

const DualTranslator: React.FC = () => {

  const device = useDeviceType();
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';
  const isDesktop = device === 'desktop';

  const {
    originalText,
    translatedText,
    isRecording,
    status,
    toggleRecording,
    connectionStatus,
    recognitionLang,
    setRecognitionLang
  } = useTranslator();

  const dialects = ['fr-FR', 'fr-CH', 'ru-RU'];
  const dialectNames = {
    'fr-FR': '🇫🇷 France',
    'fr-CH': '🇨🇭 Suisse',
    'ru-RU': '🇷🇺 Русский'
  };

  const [dialect, setDialect] = useState(recognitionLang);
  const [dialectIndex, setDialectIndex] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    speaker: string;
    lang: string;
    text: string;
    translation: string;
    timestamp: string;
  }>>([]);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  // Переключение диалекта по Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Enter' && !isRecording) {
        e.preventDefault();
        const nextIndex = (dialectIndex + 1) % dialects.length;
        setDialectIndex(nextIndex);
        const newDialect = dialects[nextIndex];
        setDialect(newDialect);
        setRecognitionLang(newDialect);
      } else if (e.code === 'Space') {
        e.preventDefault();
        toggleRecording();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialectIndex, isRecording, toggleRecording]);

  // Добавление в историю после каждого перевода
  useEffect(() => {
    if (translatedText && translatedText !== 'Перевод появится здесь...' && originalText) {
      const newEntry = {
        speaker: dialect.startsWith('ru') ? 'RU' : 'FR',
        lang: dialect,
        text: originalText,
        translation: translatedText,
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      };
      setConversationHistory(prev => {
        // Избегаем дублирования
        if (prev.length > 0 && prev[prev.length - 1].text === originalText) {
          return prev;
        }
        return [...prev, newEntry];
      });
    }
  }, [translatedText]);

  useEffect(() => {
    setDialect(recognitionLang);
  }, [recognitionLang]);

  useEffect(() => {
    if (leftPanelRef.current) {
      leftPanelRef.current.scrollTop = leftPanelRef.current.scrollHeight;
    }
  }, [originalText]);

  useEffect(() => {
    if (rightPanelRef.current) {
      rightPanelRef.current.scrollTop = rightPanelRef.current.scrollHeight;
    }
  }, [translatedText]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`${label} скопирован в буфер обмена`);
    } catch {
      alert('Ошибка копирования');
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600">

      <div className="text-center text-white/60 text-xs mt-2">
        {isMobile && "📱 Mobile version"}
        {isTablet && "💻 Tablet version"}
        {isDesktop && "🖥️ Desktop version"}
      </div>

      <header className="flex justify-between items-center p-6">
        <h1 className="text-white text-3xl font-bold">🎤 Dual Translator</h1>

        <div className="px-4 py-2 bg-white/20 rounded-lg text-white font-semibold">
          {dialectNames[dialect as keyof typeof dialectNames]}
        </div>

        <button
          onClick={toggleRecording}
          className={`px-8 py-4 rounded-xl font-semibold text-white text-lg shadow-lg transition-all ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isRecording ? '⏹️ Остановить' : '▶️ Запустить'}
        </button>

        <div className="flex gap-3">
          <div className={`w-3 h-3 rounded-full ${connectionStatus.ws ? 'bg-green-400' : 'bg-red-400'}`} />
          <div className={`w-3 h-3 rounded-full ${connectionStatus.ai ? 'bg-green-400' : 'bg-red-400'}`} />
        </div>
      </header>

      <div className="px-6 pb-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center text-white">
          <span>{status}</span>
          <span className="ml-3 text-sm opacity-70">(Enter = смена языка | Space = старт/стоп)</span>
        </div>
      </div>

      <main className="flex-1 flex gap-4 px-6 pb-6">
        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <span>🇷🇺</span>
              <span>Оригинал</span>
            </h2>
            <button
              onClick={() => copyToClipboard(originalText, 'Оригинал')}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm"
              disabled={!originalText || originalText === 'Начните говорить...'}
            >
              📋 Копировать
            </button>
          </div>
          <div
            ref={leftPanelRef}
            className="flex-1 bg-white/5 rounded-xl p-4 overflow-y-auto"
          >
            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
              {originalText || 'Начните говорить...'}
            </p>
          </div>
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-semibold flex items-center gap-2">
              <span>🇫🇷</span>
              <span>Перевод</span>
            </h2>
            <button
              onClick={() => copyToClipboard(translatedText, 'Перевод')}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm"
              disabled={!translatedText || translatedText === 'Перевод появится здесь...'}
            >
              📋 Копировать
            </button>
          </div>
          <div
            ref={rightPanelRef}
            className="flex-1 bg-white/5 rounded-xl p-4 overflow-y-auto"
          >
            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap">
              {translatedText || 'Перевод появится здесь...'}
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white/10 backdrop-blur-sm p-6 text-white">
        <h3 className="font-semibold mb-3 text-lg">🕐 История разговора</h3>
        <div className="max-h-48 overflow-y-auto space-y-3 pr-2">
          {conversationHistory.length === 0 ? (
            <p className="text-white/50 text-center py-4">История пуста</p>
          ) : (
            conversationHistory.map((msg, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-3 border-l-4 border-white/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{msg.speaker}</span>
                  <span className="text-sm opacity-70">{msg.timestamp}</span>
                </div>
                <div className="text-base">
                  <p className="mb-1">{msg.text}</p>
                  <p className="text-white/80 italic">→ {msg.translation}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </footer>
    </div>
  );
};

export default DualTranslator;