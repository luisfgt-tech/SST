import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { X } from 'lucide-react';
import { PlanoAnual } from './PlanoAnualManager';

interface Regional {
  id: string;
  nome_regional: string;
}

interface Responsavel {
  id: string;
  nome_responsavel: string;
  regional_id: string;
}

interface PlanoAnualFormProps {
  plano: PlanoAnual | null;
  regionais: Regional[];
  responsaveis: Responsavel[];
  onSave: () => void;
  onCancel: () => void;
}

export function PlanoAnualForm({ plano, regionais, responsaveis, onSave, onCancel }: PlanoAnualFormProps) {
  const [formData, setFormData] = useState({
    regional_id: '',
    responsavel_id: '',
    acao: '',
    descricao: '',
    objetivo: '',
    prazo_inicio: '',
    prazo_fim: '',
    status: 'Planejado',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (plano) {
      setFormData({
        regional_id: plano.regional_id,
        responsavel_id: plano.responsavel_id,
        acao: plano.acao,
        descricao: plano.descricao || '',
        objetivo: plano.objetivo || '',
        prazo_inicio: plano.prazo_inicio,
        prazo_fim: plano.prazo_fim,
        status: plano.status,
        observacoes: plano.observacoes || ''
      });
    }
  }, [plano]);

  const filteredResponsaveis = formData.regional_id
    ? responsaveis.filter(r => r.regional_id === formData.regional_id)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSave = {
        ...formData,
        data_atualizacao: new Date().toISOString(),
        created_by: user?.id
      };

      if (plano) {
        const { error } = await supabase
          .from('plano_anual')
          .update(dataToSave)
          .eq('id', plano.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('plano_anual')
          .insert([dataToSave]);

        if (error) throw error;
      }

      onSave();
    } catch (err) {
      setError('Erro ao salvar plano');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      if (field === 'regional_id') {
        newData.responsavel_id = '';
      }

      return newData;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">
          {plano ? 'Editar Ação' : 'Nova Ação'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regional *
            </label>
            <select
              value={formData.regional_id}
              onChange={(e) => handleChange('regional_id', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione</option>
              {regionais.map((r) => (
                <option key={r.id} value={r.id}>{r.nome_regional}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsável *
            </label>
            <select
              value={formData.responsavel_id}
              onChange={(e) => handleChange('responsavel_id', e.target.value)}
              required
              disabled={!formData.regional_id}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Selecione</option>
              {filteredResponsaveis.map((r) => (
                <option key={r.id} value={r.id}>{r.nome_responsavel}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ação *
          </label>
          <input
            type="text"
            value={formData.acao}
            onChange={(e) => handleChange('acao', e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Nome da ação"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={formData.descricao}
            onChange={(e) => handleChange('descricao', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Descrição detalhada da ação"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objetivo
          </label>
          <textarea
            value={formData.objetivo}
            onChange={(e) => handleChange('objetivo', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Objetivo da ação"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início *
            </label>
            <input
              type="date"
              value={formData.prazo_inicio}
              onChange={(e) => handleChange('prazo_inicio', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim *
            </label>
            <input
              type="date"
              value={formData.prazo_fim}
              onChange={(e) => handleChange('prazo_fim', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Planejado">Planejado</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluído">Concluído</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            value={formData.observacoes}
            onChange={(e) => handleChange('observacoes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Observações adicionais"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
