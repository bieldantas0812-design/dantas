import React, { useState, useMemo } from 'react';
import { useDbCollection } from '../hooks/useDb';
import { Goal, Sale } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { 
  Plus, 
  Target, 
  Trash2, 
  CheckCircle2, 
  Trophy, 
  Zap, 
  PlusCircle,
  X 
} from 'lucide-react';

export function GoalsPage() {
  const { data: goals, add: addGoal, remove: removeGoal, update: updateGoal } = useDbCollection<Goal>('goals');
  const { data: sales } = useDbCollection<Sale>('sales');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const enrichedGoals = useMemo(() => {
    return goals.map(goal => {
      let currentVal = goal.currentValue;
      
      // Auto-calculate based on type
      if (goal.type === 'vendas') {
        currentVal = sales.length;
      } else if (goal.type === 'faturamento') {
        currentVal = sales.reduce((acc, s) => acc + s.amountPaid, 0);
      } else if (goal.type === 'lucro') {
        currentVal = sales.reduce((acc, s) => acc + s.profit, 0);
      }

      return {
        ...goal,
        currentValue: currentVal,
        percent: Math.min(100, Math.round((currentVal / goal.targetValue) * 100))
      };
    });
  }, [goals, sales]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Metas da Marca</h1>
          <p className="text-zinc-400">Onde você quer chegar? Defina e conquiste.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Nova Meta
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {enrichedGoals.map((goal) => (
          <div key={goal.id} className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 hover:border-zinc-700 transition-all">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "p-2 rounded-lg",
                     goal.percent >= 100 ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"
                   )}>
                      {goal.percent >= 100 ? <Trophy className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                   </div>
                   <h3 className="text-xl font-bold text-white tracking-tight">{goal.title}</h3>
                </div>
                <button onClick={() => removeGoal(goal.id)} className="text-zinc-700 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Progresso</p>
                      <p className="text-3xl font-black text-white">{goal.percent}%</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Objetivo</p>
                      <p className="text-sm font-bold text-zinc-300">
                        {goal.type === 'vendas' ? `${goal.targetValue} peças` : formatCurrency(goal.targetValue)}
                      </p>
                   </div>
                </div>

                <div className="h-3 w-full rounded-full bg-zinc-800 overflow-hidden relative">
                   <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        goal.percent >= 100 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                      )}
                      style={{ width: `${goal.percent}%` }}
                   />
                </div>

                <div className="flex justify-between items-center text-xs text-zinc-500">
                   <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {goal.percent >= 100 ? 'Meta atingida!' : `${goal.targetValue - goal.currentValue} restantes`}
                   </div>
                   <span className="font-mono">Prazo: {formatDate(goal.deadline)}</span>
                </div>
             </div>
          </div>
        ))}

        {enrichedGoals.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl opacity-50 bg-zinc-900/10">
             <Target className="h-12 w-12 text-zinc-700 mb-4" />
             <p className="text-zinc-500 text-sm font-medium">Você ainda não tem metas. Bora focar?</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-4 text-white hover:underline text-sm font-semibold">Criar primeira meta</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="w-full max-w-md bg-zinc-900 rounded-3xl border border-zinc-800 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Nova Meta</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="h-6 w-6" /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                addGoal({
                  title: String(fd.get('title')),
                  type: String(fd.get('type')),
                  targetValue: Number(fd.get('target')),
                  currentValue: 0,
                  deadline: String(fd.get('deadline')),
                } as any);
                setIsModalOpen(false);
              }} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Título da Meta</label>
                    <input name="title" required placeholder="Ex: Vender 100 camisas no mês" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tipo</label>
                       <select name="type" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none">
                          <option value="vendas">Peças Vendidas</option>
                          <option value="faturamento">Faturamento (R$)</option>
                          <option value="lucro">Lucro Líquido (R$)</option>
                          <option value="outro">Manual</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Valor Alvo</label>
                       <input name="target" type="number" required placeholder="1000" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white font-mono focus:ring-2 focus:ring-white outline-none" />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Prazo Final</label>
                    <input name="deadline" type="date" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" />
                 </div>
                 <button type="submit" className="w-full bg-white text-zinc-950 font-black py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Ativar Meta
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
