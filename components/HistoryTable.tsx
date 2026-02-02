import React from 'react';
import { FinancialRecord } from '../types';
import { calculateValues } from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/format';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';

interface HistoryTableProps {
  records: FinancialRecord[];
  onEdit: (record: FinancialRecord) => void;
  onDelete: (id: string) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ records, onEdit, onDelete }) => {
  if (records.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500">Nenhum registro encontrado. Adicione o primeiro lançamento!</p>
      </div>
    );
  }

  // Sort by date descending
  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full bg-white text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3 text-right">Real</th>
              <th className="px-4 py-3 text-right">Despesas</th>
              <th className="px-4 py-3 text-right">Suprimento</th>
              <th className="px-4 py-3 text-right">Lucro</th>
              <th className="px-4 py-3 text-right">Diferença</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedRecords.map((record) => {
              const { real, lucro, diferenca } = calculateValues(record);
              return (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{formatDate(record.date)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(real)}</td>
                  <td className="px-4 py-3 text-right text-rose-600">-{formatCurrency(record.despesas)}</td>
                  <td className="px-4 py-3 text-right text-slate-400">{formatCurrency(record.suprimento)}</td>
                  <td className={`px-4 py-3 text-right font-bold ${lucro >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(lucro)}
                  </td>
                  <td className="px-4 py-3 text-right">
                     {diferenca !== 0 ? (
                       <span className="text-rose-600 font-bold flex items-center justify-end gap-1">
                         <AlertTriangle size={14} /> {formatCurrency(diferenca)}
                       </span>
                     ) : (
                       <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">OK</span>
                     )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => onEdit(record)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if(window.confirm('Tem certeza que deseja excluir este registro?')) onDelete(record.id);
                        }} 
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {sortedRecords.map((record) => {
          const { real, lucro, diferenca } = calculateValues(record);
          return (
            <div key={record.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800">{formatDate(record.date)}</span>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(record)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => {
                        if(window.confirm('Tem certeza que deseja excluir este registro?')) onDelete(record.id);
                    }} 
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-slate-500">Real</div>
                <div className="text-right font-medium">{formatCurrency(real)}</div>
                
                <div className="text-slate-500">Despesas</div>
                <div className="text-right text-rose-600">-{formatCurrency(record.despesas)}</div>
                
                <div className="text-slate-500">Lucro</div>
                <div className={`text-right font-bold ${lucro >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(lucro)}
                </div>

                <div className="text-slate-500">Diferença</div>
                <div className="text-right">
                   {diferenca !== 0 ? (
                       <span className="text-rose-600 font-bold flex items-center justify-end gap-1">
                         <AlertTriangle size={14} /> {formatCurrency(diferenca)}
                       </span>
                     ) : (
                       <span className="text-emerald-600 text-xs font-bold">OK</span>
                     )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};