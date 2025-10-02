'use client';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 ml-64 fixed top-0 right-0 left-64 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Bem-vindo ao xCloud Dashboard</h2>
          <p className="text-sm text-gray-600">Gerencie seu ecossistema xCloud</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            🔔 Notificações
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            👤 Admin
          </button>
        </div>
      </div>
    </header>
  );
}
