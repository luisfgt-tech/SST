import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Regional {
  id: string;
  nome_regional: string;
}

interface Responsavel {
  id: string;
  nome_responsavel: string;
  regional_id: string;
  regionais?: { nome_regional: string };
}

export function ResponsaveisManager() {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [regionais, setRegionais] = useState<Regional[]>([]);
  const [newResponsavel, setNewResponsavel] = useState('');
  const [selectedRegional, setSelectedRegional] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [editingRegional, setEditingRegional] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [regionaisRes, responsaveisRes] = await Promise.all([
        supabase.from('regionais').select('*').order('nome_regional'),
        supabase.from('responsaveis').select('*, regionais(nome_regional)').order('nome_responsavel')
      ]);

      if (regionaisRes.error) throw regionaisRes.error;
      if (responsaveisRes.error) throw responsaveisRes.error;

      setRegionais(regionaisRes.data || []);
      setResponsaveis(responsaveisRes.data || []);
    } catch (err) {
      setError('Erro ao carregar dados');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponsavel.trim() || !selectedRegional) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('responsaveis')
        .insert([{
          nome_responsavel: newResponsavel,
          regional_id: selectedRegional,
          created_by: user?.id
        }]);

      if (error) throw error;
      setNewResponsavel('');
      setSelectedRegional('');
      await loadData();
    } catch (err) {
      setError('Erro ao adicionar responsável');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editingName.trim() || !editingRegional) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('responsaveis')
        .update({
          nome_responsavel: editingName,
          regional_id: editingRegional
        })
        .eq('id', id);

      if (error) throw error;
      setEditingId(null);
      setEditingName('');
      setEditingRegional('');
      await loadData();
    } catch (err) {
      setError('Erro ao atualizar responsável');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este responsável?')) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('responsaveis')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadData();
    } catch (err) {
      setError('Erro ao excluir responsável. Verifique se não há planos vinculados.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (responsavel: Responsavel) => {
    setEditingId(responsavel.id);
    setEditingName(responsavel.nome_responsavel);
    setEditingRegional(responsavel.regional_id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
    setEditingRegional('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Responsáveis</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {regionais.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          Cadastre pelo menos uma regional antes de adicionar responsáveis.
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={newResponsavel}
            onChange={(e) => setNewResponsavel(e.target.value)}
            placeholder="Nome do responsável"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={selectedRegional}
            onChange={(e) => setSelectedRegional(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione a regional</option>
            {regionais.map((regional) => (
              <option key={regional.id} value={regional.id}>
                {regional.nome_regional}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={loading || regionais.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </form>

      <div className="space-y-2">
        {responsaveis.map((responsavel) => (
          <div
            key={responsavel.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {editingId === responsavel.id ? (
              <>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={editingRegional}
                    onChange={(e) => setEditingRegional(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    {regionais.map((regional) => (
                      <option key={regional.id} value={regional.id}>
                        {regional.nome_regional}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(responsavel.id)}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700 disabled:opacity-50"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={loading}
                    className="text-gray-600 hover:text-gray-700 disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <span className="font-medium text-gray-700 block">{responsavel.nome_responsavel}</span>
                  <span className="text-sm text-gray-500">
                    {responsavel.regionais?.nome_regional}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(responsavel)}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(responsavel.id)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {responsaveis.length === 0 && regionais.length > 0 && (
          <p className="text-gray-500 text-center py-8">
            Nenhum responsável cadastrado. Adicione o primeiro responsável acima.
          </p>
        )}
      </div>
    </div>
  );
}
