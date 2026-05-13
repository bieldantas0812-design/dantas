import React, { useState, useMemo } from 'react';
import { useDbCollection } from '../hooks/useDb';
import { Product, InventoryItem, DTFStock } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Plus, 
  Trash2, 
  Shirt, 
  Settings2, 
  Calculator, 
  Sparkles,
  TrendingUp,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

export function Products() {
  const { data: products, add: addProduct, remove: removeProduct } = useDbCollection<Product>('products');
  const { data: inventory } = useDbCollection<InventoryItem>('inventory_items');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for dynamic calculation
  const [formData, setFormData] = useState({
    name: '',
    baseShirtId: '',
    frontPrintCost: 0,
    backPrintCost: 0,
    packaging: 2,
    label: 1,
    bag: 2,
    machineFee: 3,
    shipping: 0,
    commission: 0,
    markup: 100, // 100% margin
  });

  const selectedBaseShirt = useMemo(() => {
    return inventory.find(i => i.id === formData.baseShirtId);
  }, [formData.baseShirtId, inventory]);

  const costs = useMemo(() => {
    const baseShirt = selectedBaseShirt?.unitPrice || 0;
    const total = 
      baseShirt + 
      formData.frontPrintCost + 
      formData.backPrintCost + 
      formData.packaging + 
      formData.label + 
      formData.bag + 
      formData.machineFee + 
      formData.shipping + 
      formData.commission;
    
    return {
      baseShirt,
      prints: formData.frontPrintCost + formData.backPrintCost,
      extras: formData.packaging + formData.label + formData.bag,
      fees: formData.machineFee + formData.shipping + formData.commission,
      total
    };
  }, [formData, selectedBaseShirt]);

  const suggestedPrice = costs.total * (1 + formData.markup / 100);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Catálogo de Produtos</h1>
          <p className="text-zinc-400">Monte suas peças e calcule preços automaticamente.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Novo Produto
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 transition-all hover:border-zinc-700 hover:bg-zinc-900 shadow-lg">
             <div className="aspect-square w-full bg-zinc-800 flex items-center justify-center p-8 relative">
                {product.mockupUrl ? (
                   <img src={product.mockupUrl} alt={product.name} className="object-contain h-full w-full drop-shadow-2xl" />
                ) : (
                   <Shirt className="h-24 w-24 text-zinc-700" />
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                   <span className="px-2 py-1 bg-zinc-900/80 backdrop-blur rounded text-[10px] font-bold text-zinc-400 border border-zinc-700 uppercase tracking-widest">
                     {product.status}
                   </span>
                </div>
             </div>
             <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                   <h3 className="font-bold text-white text-lg">{product.name}</h3>
                   <div className="text-right">
                      <p className="text-xs text-zinc-500 font-medium">Preço sugerido</p>
                      <p className="text-xl font-black text-white">{formatCurrency(product.salePrice)}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                   <div className="flex items-center gap-1">
                      <Calculator className="h-3 w-3" />
                      Custo: {formatCurrency(product.totalCost)}
                   </div>
                   <div className="flex items-center gap-1 text-emerald-500">
                      <TrendingUp className="h-3 w-3" />
                      Lucro: {formatCurrency(product.salePrice - product.totalCost)}
                   </div>
                </div>
                <button 
                  onClick={() => removeProduct(product.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg py-2 border border-zinc-800 text-zinc-600 hover:text-red-500 hover:border-red-500/30 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Remover
                </button>
             </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl opacity-50 bg-white/5">
             <Shirt className="h-12 w-12 text-zinc-600 mb-4" />
             <p className="text-zinc-500 text-sm font-medium">Nenhum produto cadastrado ainda.</p>
             <button onClick={() => setIsModalOpen(true)} className="mt-4 text-white hover:underline text-sm font-semibold">Criar primeiro produto</button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all overflow-y-auto">
          <div className="w-full max-w-4xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto">
             {/* Left: Preview & Calculator */}
             <div className="flex-1 p-8 bg-zinc-900 border-r border-zinc-800">
                <div className="mb-8">
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Precificador Inteligente</h2>
                   <p className="text-zinc-500 text-sm">Calculando cada centavo do seu corre.</p>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                         <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Custo Total</p>
                         <p className="text-2xl font-black text-white">{formatCurrency(costs.total)}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-500 text-emerald-950 border border-emerald-400">
                         <p className="text-[10px] font-bold text-emerald-900 uppercase mb-1">Preço Sugerido</p>
                         <p className="text-2xl font-black">{formatCurrency(suggestedPrice)}</p>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs text-zinc-400">
                        <span>Camiseta Lisa</span>
                        <span>{formatCurrency(costs.baseShirt)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-zinc-400">
                        <span>Estampas (Frente + Costas)</span>
                        <span>{formatCurrency(costs.prints)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-zinc-400">
                        <span>Embalagem / Tags / Sacola</span>
                        <span>{formatCurrency(costs.extras)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-zinc-400">
                        <span>Taxas / Frete / Comissão</span>
                        <span>{formatCurrency(costs.fees)}</span>
                      </div>
                      <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                        <span className="text-sm font-bold text-zinc-200">Margem Pretendida</span>
                        <div className="flex items-center gap-2">
                           <input 
                             type="number" 
                             value={formData.markup} 
                             onChange={e => setFormData({...formData, markup: Number(e.target.value)})}
                             className="w-16 bg-zinc-800 border-none rounded px-2 py-1 text-sm font-bold text-white text-center" 
                           />
                           <span className="text-sm font-bold text-zinc-500">%</span>
                        </div>
                      </div>
                   </div>

                   <div className="p-4 rounded-2xl bg-zinc-800/30 border border-zinc-800">
                      <h4 className="text-xs font-black text-zinc-500 uppercase mb-3 flex items-center gap-2">
                        <Sparkles className="h-3 w-3" />
                        Estratégias de Mercado
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                         <button onClick={() => setFormData({...formData, markup: 60})} className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest transition-colors">Giro Rápido (60%)</button>
                         <button onClick={() => setFormData({...formData, markup: 100})} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest transition-colors">Padrão (100%)</button>
                         <button onClick={() => setFormData({...formData, markup: 150})} className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest transition-colors">Premium (150%)</button>
                         <button onClick={() => setFormData({...formData, markup: 80})} className="px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-widest transition-colors">Promoção (80%)</button>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Form */}
             <div className="flex-[1.2] p-8 space-y-6 overflow-y-auto max-h-[90vh]">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Dados do Produto</h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white"><X className="h-6 w-6"/></button>
                </div>

                <div className="space-y-4">
                   <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome da Peça</label>
                      <input 
                        placeholder="Ex: Camiseta Skull Classic" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" 
                      />
                   </div>

                   <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Base de Estampa (Camisa Lisa)</label>
                      <select 
                        value={formData.baseShirtId}
                        onChange={e => setFormData({...formData, baseShirtId: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none"
                      >
                         <option value="">Selecione no estoque...</option>
                         {inventory.map(item => (
                           <option key={item.id} value={item.id}>{item.model} - {item.color} ({item.size}) - Un: {formatCurrency(item.unitPrice)}</option>
                         ))}
                      </select>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Custo Estampa Frente</label>
                        <input 
                          type="number" step="0.01" 
                          value={formData.frontPrintCost}
                          onChange={e => setFormData({...formData, frontPrintCost: Number(e.target.value)})}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white font-mono focus:ring-2 focus:ring-white outline-none text-sm" 
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Custo Estampa Costas</label>
                        <input 
                          type="number" step="0.01" 
                          value={formData.backPrintCost}
                          onChange={e => setFormData({...formData, backPrintCost: Number(e.target.value)})}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-white font-mono focus:ring-2 focus:ring-white outline-none text-sm" 
                        />
                      </div>
                   </div>

                   <div className="grid grid-cols-3 gap-2">
                       <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                          <label className="text-[8px] font-black text-zinc-600 uppercase mb-1 block">Embalagem</label>
                          <input type="number" value={formData.packaging} onChange={e => setFormData({...formData, packaging: Number(e.target.value)})} className="bg-transparent w-full text-white font-bold text-xs outline-none" />
                       </div>
                       <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                          <label className="text-[8px] font-black text-zinc-600 uppercase mb-1 block">Etiqueta</label>
                          <input type="number" value={formData.label} onChange={e => setFormData({...formData, label: Number(e.target.value)})} className="bg-transparent w-full text-white font-bold text-xs outline-none" />
                       </div>
                       <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                          <label className="text-[8px] font-black text-zinc-600 uppercase mb-1 block">Sacola</label>
                          <input type="number" value={formData.bag} onChange={e => setFormData({...formData, bag: Number(e.target.value)})} className="bg-transparent w-full text-white font-bold text-xs outline-none" />
                       </div>
                   </div>

                   <div className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4">
                      <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Simulador de Meta Financeira</h4>
                      <div className="flex items-center justify-between">
                         <span className="text-sm text-zinc-400">Lucro Líquido p/ Peça</span>
                         <span className="text-sm font-bold text-emerald-400">{formatCurrency(suggestedPrice - costs.total)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-1 group relative">
                           <span className="text-sm text-zinc-400">Meta de Lucro Total</span>
                           <HelpCircle className="h-3 w-3 text-zinc-700" />
                         </div>
                         <div className="flex items-center gap-2">
                            <span className="text-sm text-zinc-500 font-bold">R$</span>
                            <input type="number" defaultValue={1000} id="targetProfit" className="w-20 bg-zinc-800 border-none rounded px-2 py-1 text-sm font-bold text-white text-right" />
                         </div>
                      </div>
                      <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                         <span className="text-xs text-zinc-500 italic">Você precisará vender aproximadamente:</span>
                         <span className="text-lg font-black text-white">45 <small className="text-[10px] font-normal text-zinc-500">Peças</small></span>
                      </div>
                   </div>

                   <button 
                    onClick={() => {
                        addProduct({
                            name: formData.name,
                            totalCost: costs.total,
                            salePrice: suggestedPrice,
                            status: 'ideia',
                            baseShirtCost: costs.baseShirt,
                            color: selectedBaseShirt?.color || '',
                            collectionId: '',
                            mockupUrl: '',
                            prints: [],
                            extraCosts: {
                                packaging: formData.packaging,
                                label: formData.label,
                                bag: formData.bag,
                                tagFee: formData.machineFee,
                                shipping: formData.shipping,
                                commission: formData.commission
                            }
                        } as any);
                        setIsModalOpen(false);
                    }}
                    className="w-full bg-white text-zinc-950 font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                   >
                       <PlusCircle className="h-5 w-5" />
                       Salvar no Catálogo
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
