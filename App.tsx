import React, { useState, useEffect } from 'react';
import { FinancialRecord } from './types';
import { calculateTotals } from './utils/calculations';
import { SummaryCard } from './components/SummaryCard';
import { EntryForm } from './components/EntryForm';
import { HistoryTable } from './components/HistoryTable';
import { Plus, Wallet, TrendingUp, AlertCircle, Banknote } from 'lucide-react';

const STORAGE_KEY = 'finandia_data_v1';

function App() {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | undefined>(undefined);

  // Load data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const handleSaveRecord = (record: FinancialRecord) => {
    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === record.id ? record : r));
    } else {
      setRecords(prev => [...prev, record]);
    }
    setIsFormOpen(false);
    setEditingRecord(undefined);
  };

  const handleEditRecord = (record: FinancialRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  const totals = calculateTotals(records);

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-8 pb-16 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Banknote className="text-emerald-400" /> FinanDia
            </h1>
            <p className="text-slate-400 text-sm mt-1">Controle Financeiro Diário</p>
          </div>
          <button
            onClick={() => {
              setEditingRecord(undefined);
              setIsFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Novo Lançamento</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 -mt-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard 
            title="Lucro Acumulado" 
            value={totals.lucro} 
            type="positive" 
            icon={<TrendingUp size={20} />}
          />
          <SummaryCard 
            title="Real Acumulado" 
            value={totals.real} 
            type="info"
            icon={<Wallet size={20} />}
          />
           <SummaryCard 
            title="Faturamento Bruto" 
            value={totals.faturamento} 
            type="neutral"
            icon={<Banknote size={20} />}
          />
          <SummaryCard 
            title="Diferença Total" 
            value={totals.diferenca} 
            type={totals.diferenca === 0 ? 'neutral' : 'negative'}
            icon={<AlertCircle size={20} />}
          />
        </div>

        {/* List Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h2 className="text-lg font-bold text-slate-800">Histórico de Lançamentos</h2>
             <span className="text-sm text-slate-500">{records.length} registros</span>
          </div>
          <div className="p-4 sm:p-6">
            <HistoryTable 
              records={records} 
              onEdit={handleEditRecord} 
              onDelete={handleDeleteRecord} 
            />
          </div>
        </div>
      </main>

      {/* Modal Form */}
      {isFormOpen && (
        <EntryForm 
          initialData={editingRecord} 
          onSave={handleSaveRecord} 
          onCancel={() => {
            setIsFormOpen(false);
            setEditingRecord(undefined);
          }} 
        />
      )}
      
      <footer className="text-center mt-12 text-slate-400 text-sm">
        <p>Dados armazenados localmente no seu navegador.</p>
      </footer>
    </div>
  );
}

export default App;