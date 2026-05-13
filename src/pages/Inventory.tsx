import React, { useState } from 'react';
import { useDbCollection } from '../hooks/useDb';
import { InventoryItem, DTFStock, Print, Supplier } from '../types';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { 
  Plus, 
  Trash2, 
  Search, 
  ChevronRight, 
  Box, 
  Scissors, 
  Truck,
  PlusCircle,
  X
} from 'lucide-react';
export function Inventory() {
  const [activeTab, setActiveTab] = useState<'shirts' | 'dtf' | 'suppliers'>('shirts');
  const { data: shirts, add: addShirt, remove: removeShirt } = useDbCollection<InventoryItem>('inventory_items');
  const { data: dtfStock, add: addDtf } = useDbCollection<DTFStock>('dtf_stock');
  const { data: suppliers, add: addSupplier } = useDbCollection<Supplier>('suppliers');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Estoque de Base</h1>
          <p className="text-zinc-400">Gerencie suas camisetas lisas, DTF e fornecedores.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Novo Cadastro
        </button>
      </div>

      <div className="flex gap-1 rounded-xl bg-zinc-900 p-1 w-fit border border-zinc-800">
        <button
          onClick={() => setActiveTab('shirts')}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            activeTab === 'shirts' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Box className="h-4 w-4" />
          Camisetas
        </button>
        <button
          onClick={() => setActiveTab('dtf')}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            activeTab === 'dtf' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Scissors className="h-4 w-4" />
          DTF / Estampas
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
            activeTab === 'suppliers' ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Truck className="h-4 w-4" />
          Fornecedores
        </button>
      </div>

      {activeTab === 'shirts' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-6 py-4">Modelo / Cor</th>
                  <th className="px-6 py-4 text-center">Tamanho</th>
                  <th className="px-6 py-4 text-right">Preço Un.</th>
                  <th className="px-6 py-4 text-center">Estoque</th>
                  <th className="px-6 py-4 text-center">Vendido</th>
                  <th className="px-6 py-4 text-right">Data Compra</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {shirts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-600 italic">
                      Nenhuma camiseta cadastrada.
                    </td>
                  </tr>
                ) : (
                  shirts.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex flex-col">
                          <span>{item.model}</span>
                          <span className="text-xs text-zinc-500">{item.color}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="rounded-md bg-zinc-800 border border-zinc-700 px-2 py-1 text-xs font-bold text-zinc-400">
                          {item.size}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-zinc-300">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          item.currentStock < 5 ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                        )}>
                          {item.currentStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-zinc-500">
                        {item.soldQuantity}
                      </td>
                      <td className="px-6 py-4 text-right text-zinc-500">
                        {formatDate(item.purchaseDate)}
                      </td>
                      <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => removeShirt(item.id)}
                          className="text-zinc-600 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'dtf' && (
        <div className="grid gap-6 md:grid-cols-2">
           <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Metragem em Estoque</h3>
              <div className="space-y-4">
                 {dtfStock.map((dtf) => (
                   <div key={dtf.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-white">{dtf.meters}m de DTF</span>
                        <span className="text-xs text-zinc-500">{formatDate(dtf.purchaseDate)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-zinc-500">Preço p/ metro</p>
                          <p className="font-semibold text-zinc-200">{formatCurrency(dtf.pricePerMeter)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Estampas p/ m</p>
                          <p className="font-semibold text-zinc-200">{dtf.printsPerMeter} unid.</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Custo p/ estampa</p>
                          <p className="font-semibold text-emerald-400">{formatCurrency(dtf.pricePerMeter / dtf.printsPerMeter)}</p>
                        </div>
                      </div>
                   </div>
                 ))}
                 {dtfStock.length === 0 && <p className="text-center text-zinc-600 py-8 italic">Nenhuma compra de DTF registrada.</p>}
              </div>
           </div>
           
           <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Calculadora de Custo de Arte</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                   <p className="text-sm text-zinc-400 mb-4 font-mono uppercase text-center tracking-widest bg-zinc-900 py-1">Simulador Rápido</p>
                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span>Preço do Metro</span>
                        <span className="text-white font-semibold">R$ 80,00</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span>Estampas por Metro</span>
                        <span className="text-white font-semibold">8 estampas (A3-ish)</span>
                      </div>
                      <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                        <span className="text-sm font-bold text-white">Custo Unitário</span>
                        <span className="text-xl font-black text-emerald-500">R$ 10,00</span>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-500 uppercase tracking-widest font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-4">Nome do Fornecedor</th>
                  <th className="px-6 py-4">Contato / Link</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {suppliers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-zinc-600 italic">
                      Nenhum fornecedor cadastrado.
                    </td>
                  </tr>
                ) : (
                  suppliers.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                      <td className="px-6 py-4 text-zinc-400">{s.contact}</td>
                      <td className="px-6 py-4 text-right">
                         <button className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                           <Trash2 className="h-4 w-4" />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Simple Modal for Inventory (Adding Placeholder logic here since it's a big app) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
           <div className="w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Adicionar {activeTab === 'shirts' ? 'Camisas' : activeTab === 'dtf' ? 'DTF' : 'Fornecedor'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {activeTab === 'shirts' && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addShirt({
                      color: String(formData.get('color')),
                      size: String(formData.get('size')) as any,
                      model: String(formData.get('model')),
                      unitPrice: Number(formData.get('price')),
                      initialQuantity: Number(formData.get('qty')),
                      currentStock: Number(formData.get('qty')),
                      soldQuantity: 0,
                      supplierId: '',
                      purchaseDate: new Date().toISOString(),
                    } as any);
                    setIsModalOpen(false);
                  }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Modelo</label>
                        <input name="model" required placeholder="Oversized" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Cor</label>
                        <input name="color" required placeholder="Preta" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Tamanho</label>
                        <select name="size" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none">
                          <option>P</option>
                          <option>M</option>
                          <option>G</option>
                          <option>GG</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Preço Un.</label>
                        <input name="price" type="number" step="0.01" required placeholder="18.00" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm font-mono focus:ring-2 focus:ring-white outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Quantidade</label>
                      <input name="qty" type="number" required placeholder="20" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                       <PlusCircle className="h-5 w-5" />
                       Cadastrar Lote
                    </button>
                  </form>
                )}

                {activeTab === 'dtf' && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addDtf({
                      meters: Number(formData.get('meters')),
                      pricePerMeter: Number(formData.get('price')),
                      printsPerMeter: Number(formData.get('prints')),
                      purchaseDate: new Date().toISOString(),
                    } as any);
                    setIsModalOpen(false);
                  }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Metros Comprados</label>
                      <input name="meters" type="number" step="0.1" required placeholder="1.0" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Preço por Metro (R$)</label>
                      <input name="price" type="number" step="0.01" required placeholder="80.00" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Quantas Estampas couberam?</label>
                      <input name="prints" type="number" required placeholder="8" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all">
                       Salvar Compra de DTF
                    </button>
                  </form>
                )}

                {activeTab === 'suppliers' && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addSupplier({
                      name: String(formData.get('name')),
                      contact: String(formData.get('contact'))
                    } as any);
                    setIsModalOpen(false);
                  }} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Nome do Fornecedor</label>
                      <input name="name" required placeholder="Fábrica X" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Contato / Link</label>
                      <input name="contact" required placeholder="@fornecedor ou link" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-white text-zinc-950 font-bold py-3 rounded-lg hover:bg-zinc-200 transition-all">
                       Salvar Fornecedor
                    </button>
                  </form>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
