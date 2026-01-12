import { Edit2, Trash2 } from 'lucide-react';
import { PlanoAnual } from './PlanoAnualManager';

interface PlanoAnualTableProps {
  planos: PlanoAnual[];
  onEdit: (plano: PlanoAnual) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

export function PlanoAnualTable({ planos, onEdit, onDelete, loading }: PlanoAnualTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejado':
        return 'bg-blue-100 text-blue-800';
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Concluído':
        return 'bg-green-100 text-green-800';
      case 'Atrasado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (planos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">
          Nenhuma ação cadastrada. Clique em "Nova Ação" para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Regional
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ação
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prazo
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {planos.map((plano) => (
              <tr key={plano.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {plano.regionais?.nome_regional}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {plano.responsaveis?.nome_responsavel}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{plano.acao}</div>
                  {plano.objetivo && (
                    <div className="text-xs text-gray-500 mt-1">{plano.objetivo}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div>{formatDate(plano.prazo_inicio)}</div>
                  <div className="text-xs text-gray-500">até {formatDate(plano.prazo_fim)}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(plano.status)}`}>
                    {plano.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(plano)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(plano.id)}
                      disabled={loading}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          Total: <span className="font-medium">{planos.length}</span> {planos.length === 1 ? 'ação' : 'ações'}
        </p>
      </div>
    </div>
  );
}
