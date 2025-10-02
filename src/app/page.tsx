import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MetricCard from '@/components/dashboard/MetricCard';

export default function Home() {
  return (
    <>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-24 p-8 bg-gray-50 min-h-screen">
        {/* Metrics Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Métricas Gerais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Usuários Ativos" value="1,234" icon="👥" trend="+12%" trendUp />
            <MetricCard title="Aplicações Rodando" value="42" icon="📱" trend="+5%" trendUp />
            <MetricCard title="Logs Hoje" value="15.8K" icon="📝" trend="+8%" trendUp />
            <MetricCard title="CPU Médio" value="45%" icon="⚡" trend="-3%" trendUp={false} />
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Atividade Recente</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Nova aplicação implantada</p>
                    <p className="text-sm text-gray-600">api-gateway-v2 - há 5 minutos</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">✅ Sucesso</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Usuário adicionado</p>
                    <p className="text-sm text-gray-600">admin@xcloud.com - há 12 minutos</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">👤 Usuário</span>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Alerta de performance</p>
                    <p className="text-sm text-gray-600">database-cluster - há 1 hora</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">⚠️ Aviso</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">Backup concluído</p>
                    <p className="text-sm text-gray-600">prod-database - há 2 horas</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">💾 Backup</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">⚡ Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-blue-600 text-white rounded-lg p-6 hover:bg-blue-700 transition-colors text-left">
              <div className="text-3xl mb-2">➕</div>
              <h3 className="font-semibold mb-1">Nova Aplicação</h3>
              <p className="text-sm text-blue-100">Implante uma nova aplicação</p>
            </button>

            <button className="bg-green-600 text-white rounded-lg p-6 hover:bg-green-700 transition-colors text-left">
              <div className="text-3xl mb-2">👥</div>
              <h3 className="font-semibold mb-1">Gerenciar Usuários</h3>
              <p className="text-sm text-green-100">Adicionar ou remover usuários</p>
            </button>

            <button className="bg-purple-600 text-white rounded-lg p-6 hover:bg-purple-700 transition-colors text-left">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold mb-1">Ver Relatórios</h3>
              <p className="text-sm text-purple-100">Analytics e métricas</p>
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
