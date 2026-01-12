import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

interface Regional {
  id: string;
  nome_regional: string;
}

export function RegionaisManager() {
  const [regionais, setRegionais] = useState<Regional[]>([]);
  const [newRegional, setNewRegional] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadRegionais();
  }, []);

  const loadRegionais = async () => {
    try {
      const { data, error } = await supabase
        .from('regionais')
        .select('*')
        .order('nome_regional');

      if (error) throw error;
      setRegionais(data || []);
    } catch (err) {
      setError('Erro ao carregar regionais');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegional.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('regionais')
        .insert([{ nome_regional: newRegional, created_by: user?.id }]);

      if (error) throw error;
      setNewRegional('');
      await loadRegionais();
    } catch (err) {
      setError('Erro ao adicionar regional');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editingName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('regionais')
        .update({ nome_regional: editingName })
        .eq('id', id);

      if (error) throw error;
      setEditingId(null);
      setEditingName('');
      await loadRegionais();
    } catch (err) {
      setError('Erro ao atualizar regional');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta regional?')) return;

    setLoading(true);
    setError('');

    try {
      const { error } = await supabase
        .from('regionais')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadRegionais();
    } catch (err) {
      setError('Erro ao excluir regional. Verifique se não há responsáveis vinculados.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (regional: Regional) => {
    setEditingId(regional.id);
    setEditingName(regional.nome_regional);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerenciar Regionais</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newRegional}
            onChange={(e) => setNewRegional(e.target.value)}
            placeholder="Nome da regional"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {regionais.map((regional) => (
          <div
            key={regional.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {editingId === regional.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => handleEdit(regional.id)}
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
                <span className="font-medium text-gray-700">{regional.nome_regional}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(regional)}
                    disabled={loading}
                    className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(regional.id)}
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

        {regionais.length === 0 && (
          <p className="text-gray-500 text-center py-8">
            Nenhuma regional cadastrada. Adicione a primeira regional acima.
          </p>
        )}
      </div>
    </div>
  );
}
