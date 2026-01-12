import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit2, Trash2, Filter, X } from 'lucide-react';
import { PlanoAnualForm } from './PlanoAnualForm';
import { PlanoAnualTable } from './PlanoAnualTable';

interface Regional {
  id: string;
  nome_regional: string;
}

interface Responsavel {
  id: string;
  nome_responsavel: string;
  regional_id: string;
}

export interface PlanoAnual {
  id: string;
  regional_id: string;
  responsavel_id: string;
  acao: string;
  descricao: string | null;
  objetivo: string | null;
  prazo_inicio: string;
  prazo_fim: string;
  status: string;
  observacoes: string | null;
  data_atualizacao: string;
  regionais?: { nome_regional: string };
  responsaveis?: { nome_responsavel: string };
}

export function PlanoAnualManager() {
  const [planos, setPlanos] = useState<PlanoAnual[]>([]);
  const [regionais, setRegionais] = useState<Regional[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPlano, setEditingPlano] = useState<PlanoAnual | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filterRegional, setFilterRegional] = useState('');
  const [filterResponsavel, setFilterResponsavel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, [filterRegional, filterResponsavel, filterStatus]);

  const loadData = async () => {
    try {
      const [regionaisRes, responsaveisRes] = await Promise.all([
        supabase.from('regionais').select('*').order('nome_regional'),
        supabase.from('responsaveis').select('*').order('nome_responsavel')
      ]);

      if (regionaisRes.error) throw regionaisRes.error;
      if (responsaveisRes.error) throw responsaveisRes.error;

      setRegionais(regionaisRes.data || []);
      setResponsaveis(responsaveisRes.data || []);

      await loadPlanos();
    } catch (err) {
      setError('Erro ao carregar dados');
    }
  };

  const loadPlanos = async () => {
    try {
      let query = supabase
        .from('plano_anual')
        .select('*, regionais(nome_regional), responsaveis(nome_responsavel)')
        .order('prazo_fim', { ascending: false });

      if (filterRegional) query = query.eq('regional_id', filterRegional);
      if (filterResponsavel) query = query.eq('responsavel_id', filterResponsavel);
      if (filterStatus) query = query.eq('status', filterStatus);

      const { data, error } = await query;

      if (error) throw error;
      setPlanos(data || []);
    } catch (err) {
      setError('Erro ao carregar planos');
    }
  };

  const handleSave = async () => {
    setShowForm(false);
    setEditingPlano(null);
    await loadPlanos();
  };

  const handleEdit = (plano: PlanoAnual) => {
    setEditingPlano(plano);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este plano?')) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('plano_anual')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadPlanos();
    } catch (err) {
      setError('Erro ao excluir plano');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilterRegional('');
    setFilterResponsavel('');
    setFilterStatus('');
  };

  const filteredResponsaveis = filterRegional
    ? responsaveis.filter(r => r.regional_id === filterRegional)
    : responsaveis;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Plano Anual de Segurança</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          <button
            onClick={() => {
              setEditingPlano(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Ação
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Regional
              </label>
              <select
                value={filterRegional}
                onChange={(e) => {
                  setFilterRegional(e.target.value);
                  setFilterResponsavel('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas</option>
                {regionais.map((r) => (
                  <option key={r.id} value={r.id}>{r.nome_regional}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Responsável
              </label>
              <select
                value={filterResponsavel}
                onChange={(e) => setFilterResponsavel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                disabled={!filterRegional && responsaveis.length > 0}
              >
                <option value="">Todos</option>
                {filteredResponsaveis.map((r) => (
                  <option key={r.id} value={r.id}>{r.nome_responsavel}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="Planejado">Planejado</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluído">Concluído</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Limpar filtros
            </button>
          </div>
        </div>
      )}

      {showForm ? (
        <PlanoAnualForm
          plano={editingPlano}
          regionais={regionais}
          responsaveis={responsaveis}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPlano(null);
          }}
        />
      ) : (
        <PlanoAnualTable
          planos={planos}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}
    </div>
  );
}
