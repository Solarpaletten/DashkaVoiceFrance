import React from 'react';

const KidsDashboard: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 text-white">
      <h1 className="text-4xl font-bold mb-4">🧸 Dashka Kids Mode</h1>
      <p className="text-lg opacity-90 mb-6 text-center max-w-lg">
        Добро пожаловать в детский режим обучения! Здесь скоро появятся весёлые упражнения, голосовые фразы и задания для практики английского языка.
      </p>
      <button
        className="bg-white text-pink-600 px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-pink-50 transition-all"
        onClick={() => alert('✨ Kids Mode is coming soon!')}
      >
        ✨ Попробовать
      </button>
    </div>
  );
};

export default KidsDashboard;
