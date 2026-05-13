import React, { useState } from 'react';
import { useDbCollection } from '../hooks/useDb';
import { Expense } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { 
  Plus, 
  DollarSign, 
  PieChart, 
  Calendar, 
  Trash2, 
  Filter,
  PlusCircle,
  X,
  CreditCard,
  Zap,
  TrendingDown
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

const CATEGORIES = [
  'Compra de Camisas',
  'Compra de DTF',
  'Tráfego Pago',
  'Embalagem / Sacola',
  'Etiqueta / Tags',
  'Frete / Envios',
  'Marketing / Fotos',
  'Domínio / Site',
  'Motoboy / Delivery',
  'Assinaturas / Ferramentas',
  'Outros'
];

export function Expenses() {
  const { data: expenses, add: addExpense, remove: removeExpense } = useDbCollection<Expense>('expenses');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalFixed = expenses.filter(e => e.type === 'fixo').reduce((acc, e) => acc + e.amount, 0);
  const totalVariable = expenses.filter(e => e.type === 'variavel').reduce((acc, e) => acc + e.amount, 0);
  const totalInvestment = expenses.filter(e => e.type === 'investimento').reduce((acc, e) => acc + e.amount, 0);
  const totalAmount = expenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Controle de Gastos</h1>
          <p className="text-zinc-400">Gerencie todos os custos do seu negócio.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Lançar Gasto
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Gasto Fixo', value: totalFixed, icon: CreditCard, color: 'text-blue-500' },
            { label: 'Gasto Variável', value: totalVariable, icon: Zap, color: 'text-yellow-500' },
            { label: 'Investimento', value: totalInvestment, icon: DollarSign, color: 'text-purple-500' },
            { label: 'Total Acumulado', value: totalAmount, icon: TrendingDown, color: 'text-red-500' },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={cn("h-4 w-4", stat.color)} />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{formatCurrency(stat.value)}</h3>
            </div>
          ))}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
           <h2 className="font-bold text-white uppercase tracking-tighter text-sm">Histórico de Lançamentos</h2>
           <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"><Filter className="h-4 w-4" /></button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-zinc-900/80 text-zinc-500 uppercase tracking-widest font-bold text-[10px]">
                <tr>
                   <th className="px-6 py-4">Descrição</th>
                   <th className="px-6 py-4">Categoria</th>
                   <th className="px-6 py-4 text-center">Tipo</th>
                   <th className="px-6 py-4 text-right">Valor</th>
                   <th className="px-6 py-4 text-center">Data</th>
                   <th className="px-6 py-4 text-right"></th>
                </tr>
             </thead>
             <tbody className="divide-y divide-zinc-800">
               {expenses.length === 0 ? (
                 <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 italic">Nenhum gasto lançado.</td>
                 </tr>
               ) : (
                 expenses.sort((a,b) => b.timestamp?.seconds - a.timestamp?.seconds).map(exp => (
                   <tr key={exp.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white">{exp.description}</td>
                      <td className="px-6 py-4 text-zinc-500">{exp.category}</td>
                      <td className="px-6 py-4 text-center">
                         <span className={cn(
                           "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                           exp.type === 'fixo' ? "bg-blue-500/10 text-blue-500" : 
                           exp.type === 'variavel' ? "bg-yellow-500/10 text-yellow-500" : 
                           "bg-purple-500/10 text-purple-500"
                         )}>
                            {exp.type}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-red-400">{formatCurrency(exp.amount)}</td>
                      <td className="px-6 py-4 text-center text-zinc-500 font-mono text-xs">{formatDate(exp.timestamp)}</td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => removeExpense(exp.id)} className="p-1 text-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="h-4 w-4"/></button>
                      </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Lançar Despesa</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="h-6 w-6" /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                addExpense({
                  description: String(fd.get('desc')),
                  amount: Number(fd.get('amount')),
                  category: String(fd.get('category')),
                  type: String(fd.get('type')) as any,
                  timestamp: Timestamp.now()
                } as any);
                setIsModalOpen(false);
              }} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Descrição</label>
                    <input name="desc" required placeholder="Ex: Campanha Facebook Ads" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Valor</label>
                      <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white font-mono focus:ring-2 focus:ring-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tipo</label>
                      <select name="type" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none">
                         <option value="fixo">Fixo</option>
                         <option value="variavel">Variável</option>
                         <option value="investimento">Investimento</option>
                      </select>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Categoria</label>
                    <select name="category" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none">
                       {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                 </div>
                 <button type="submit" className="w-full bg-white text-zinc-950 font-black py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Registrar Gasto
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
