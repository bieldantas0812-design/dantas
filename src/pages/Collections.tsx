import React, { useState } from 'react';
import { useDbCollection } from '../hooks/useDb';
import { Collection, Product } from '../types';
import { formatDate } from '../lib/utils';
import { 
  Plus, 
  Library, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  MoreVertical,
  PlusCircle,
  X
} from 'lucide-react';

export function Collections() {
  const { data: collections, add: addCollection } = useDbCollection<Collection>('collections');
  const { data: products } = useDbCollection<Product>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Planejamento de Coleção</h1>
          <p className="text-zinc-400">Organize seus lançamentos e preveja seu lucro.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Nova Coleção
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {collections.map((coll) => {
          const collProducts = products.filter(p => p.collectionId === coll.id);
          const totalExpectedProfit = collProducts.reduce((acc, p) => acc + (p.salePrice - p.totalCost), 0);
          
          return (
            <div key={coll.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between group hover:border-zinc-700 transition-all">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{coll.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <Calendar className="h-3 w-3" />
                      Lançamento: {formatDate(coll.launchDate)}
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-zinc-800 text-[10px] font-bold text-zinc-400 border border-zinc-700 uppercase tracking-widest">
                    {coll.status}
                  </span>
                </div>

                <div className="space-y-3 mb-8">
                    {collProducts.length > 0 ? collProducts.map(p => (
                      <div key={p.id} className="flex items-center justify-between py-2 border-b border-zinc-800/50">
                        <span className="text-sm text-zinc-300">{p.name}</span>
                        <span className="text-xs font-mono text-zinc-500 uppercase">{p.status}</span>
                      </div>
                    )) : (
                      <p className="text-sm text-zinc-600 italic">Nenhum produto vinculado ainda.</p>
                    )}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                 <div className="text-xs">
                    <p className="text-zinc-500 font-medium">Lucro Líquido Previsto</p>
                    <p className="text-lg font-bold text-emerald-500">R$ {totalExpectedProfit.toFixed(2)}</p>
                 </div>
                 <button className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
                   <ChevronRight className="h-5 w-5" />
                 </button>
              </div>
            </div>
          );
        })}

        {collections.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl opacity-50 bg-white/5">
             <Library className="h-12 w-12 text-zinc-600 mb-4" />
             <p className="text-zinc-500 text-sm font-medium">Nenhuma coleção cadastrada.</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-4 text-white hover:underline text-sm font-semibold">Começar planejamento</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Nova Coleção</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="h-6 w-6" /></button>
              </div>

              <form onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                addCollection({
                  name: String(formData.get('name')),
                  launchDate: String(formData.get('date')),
                  status: 'Planejamento'
                } as any);
                setIsModalOpen(false);
              }} className="space-y-4">
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome da Coleção</label>
                    <input name="name" required placeholder="Ex: Rua Não Dorme" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Data de Lançamento</label>
                    <input name="date" type="date" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" />
                 </div>
                 <button type="submit" className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                    <PlusCircle className="h-5 w-5" />
                    Criar Coleção
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
