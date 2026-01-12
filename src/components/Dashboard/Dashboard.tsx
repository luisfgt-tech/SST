import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart3, CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface Stats {
  total: number;
  planejado: number;
  emAndamento: number;
  concluido: number;
  atrasado: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    planejado: 0,
    emAndamento: 0,
    concluido: 0,
    atrasado: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('plano_anual')
        .select('status');

      if (error) throw error;

      const stats = {
        total: data.length,
        planejado: data.filter(p => p.status === 'Planejado').length,
        emAndamento: data.filter(p => p.status === 'Em andamento').length,
        concluido: data.filter(p => p.status === 'Concluído').length,
        atrasado: data.filter(p => p.status === 'Atrasado').length
      };

      setStats(stats);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

  const StatCard = ({
    title,
    value,
    percentage,
    icon: Icon,
    color
  }: {
    title: string;
    value: number;
    percentage: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-500">{percentage}%</div>
        </div>
      </div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando indicadores...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Indicadores</h2>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-4xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-gray-600 mt-1">Total de Ações Cadastradas</div>
          </div>
          <ListTodo className="w-12 h-12 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Planejadas"
          value={stats.planejado}
          percentage={getPercentage(stats.planejado)}
          icon={Clock}
          color="bg-blue-500"
        />

        <StatCard
          title="Em Andamento"
          value={stats.emAndamento}
          percentage={getPercentage(stats.emAndamento)}
          icon={BarChart3}
          color="bg-yellow-500"
        />

        <StatCard
          title="Concluídas"
          value={stats.concluido}
          percentage={getPercentage(stats.concluido)}
          icon={CheckCircle}
          color="bg-green-500"
        />

        <StatCard
          title="Atrasadas"
          value={stats.atrasado}
          percentage={getPercentage(stats.atrasado)}
          icon={AlertCircle}
          color="bg-red-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo Geral</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Taxa de Conclusão</span>
            <span className="font-bold text-green-600">{getPercentage(stats.concluido)}%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Ações em Execução</span>
            <span className="font-bold text-yellow-600">{getPercentage(stats.emAndamento)}%</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Taxa de Atraso</span>
            <span className="font-bold text-red-600">{getPercentage(stats.atrasado)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
