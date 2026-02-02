import React, { useState, useEffect } from 'react';
import { FinancialRecord } from '../types';
import { calculateValues } from '../utils/calculations';
import { formatCurrency } from '../utils/format';
import { Input } from './Input';
import { X, Save, Calculator } from 'lucide-react';

interface EntryFormProps {
  initialData?: FinancialRecord;
  onSave: (record: FinancialRecord) => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<FinancialRecord>>({
    date: new Date().toISOString().split('T')[0],
    suprimento: 0,
    relatorio: 0,
    dinheiro: 0,
    cartao: 0,
    pix: 0,
    despesas: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date) return alert('Data é obrigatória');
    
    const record: FinancialRecord = {
      id: initialData?.id || crypto.randomUUID(),
      date: formData.date!,
      suprimento: Number(formData.suprimento),
      relatorio: Number(formData.relatorio),
      dinheiro: Number(formData.dinheiro),
      cartao: Number(formData.cartao),
      pix: Number(formData.pix),
      despesas: Number(formData.despesas),
    };
    onSave(record);
  };

  const calculated = calculateValues(formData);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {initialData ? 'Editar Lançamento' : 'Novo Lançamento'}
          </h2>
          <button onClick={onCancel} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            <div className="hidden md:block"></div> {/* Spacer */}

            {/* Inputs de Valores */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 pb-1 border-b border-slate-200">Entradas & Suprimentos</h3>
            </div>
            
            <Input label="Suprimento (Fundo de Caixa)" type="number" step="0.01" name="suprimento" value={formData.suprimento} onChange={handleChange} />
            <Input label="Relatório (Sistema/Z)" type="number" step="0.01" name="relatorio" value={formData.relatorio} onChange={handleChange} />
            
            <Input label="Dinheiro" type="number" step="0.01" name="dinheiro" value={formData.dinheiro} onChange={handleChange} className="bg-emerald-50 border-emerald-200 focus:ring-emerald-500" />
            <Input label="Cartão" type="number" step="0.01" name="cartao" value={formData.cartao} onChange={handleChange} className="bg-emerald-50 border-emerald-200 focus:ring-emerald-500" />
            <Input label="Pix" type="number" step="0.01" name="pix" value={formData.pix} onChange={handleChange} className="bg-emerald-50 border-emerald-200 focus:ring-emerald-500" />
            
            <Input label="Despesas (Saídas)" type="number" step="0.01" name="despesas" value={formData.despesas} onChange={handleChange} className="bg-rose-50 border-rose-200 focus:ring-rose-500" />
          </div>

          {/* Prévia dos Cálculos */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Calculator size={14} /> Prévia dos Cálculos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <span className="block text-xs text-slate-500">Real</span>
                <span className="font-bold text-slate-800">{formatCurrency(calculated.real)}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">Lucro</span>
                <span className={`font-bold ${calculated.lucro >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {formatCurrency(calculated.lucro)}
                </span>
              </div>
              <div>
                <span className="block text-xs text-slate-500">Diferença</span>
                <span className={`font-bold ${calculated.diferenca === 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                  {formatCurrency(calculated.diferenca)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
            >
              <Save size={18} /> Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};