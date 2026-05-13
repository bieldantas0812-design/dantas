import React, { useState } from 'react';
import { useDbCollection } from '../hooks/useDb';
import { Sale, Product, Client } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { 
  Plus, 
  ShoppingCart, 
  User, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  PlusCircle,
  X,
  Search
} from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export function Sales() {
  const { data: sales, add: addSale } = useDbCollection<Sale>('sales');
  const { data: products } = useDbCollection<Product>('products');
  const { data: clients, add: addClient } = useDbCollection<Client>('clients');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    productId: '',
    clientName: '',
    amountPaid: 0,
    paymentMethod: 'Pix',
    deliveryStatus: 'Pendente',
    size: 'M' as any
  });

  const selectedProduct = products.find(p => p.id === formData.productId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Vendas</h1>
          <p className="text-zinc-400">Registre suas vendas e acompanhe o fluxo de caixa.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Nova Venda
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
             <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-500 uppercase tracking-widest font-bold text-[10px]">
                <tr>
                   <th className="px-6 py-4 text-center">Data</th>
                   <th className="px-6 py-4">Cliente</th>
                   <th className="px-6 py-4">Produto</th>
                   <th className="px-6 py-4 text-center">Tam.</th>
                   <th className="px-6 py-4 text-right">Valor</th>
                   <th className="px-6 py-4 text-right">Lucro</th>
                   <th className="px-6 py-4 text-center">Status</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-zinc-800">
               {sales.length === 0 ? (
                 <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-600 italic">
                      Nenhuma venda registrada ainda.
                    </td>
                 </tr>
               ) : (
                 sales.sort((a,b) => b.timestamp?.seconds - a.timestamp?.seconds).map(sale => {
                   const product = products.find(p => p.id === sale.productId);
                   return (
                     <tr key={sale.id} className="hover:bg-zinc-800/30 transition-colors group">
                        <td className="px-6 py-4 text-center text-zinc-500 font-mono text-xs">
                           {formatDate(sale.timestamp)}
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-2">
                             <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                               <User className="h-3 w-3 text-zinc-500" />
                             </div>
                             <span className="font-medium text-white">{sale.clientId}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">
                           {product?.name || 'Produto Removido'}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className="text-[10px] font-black text-zinc-500">{sale.size}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-white">
                           {formatCurrency(sale.amountPaid)}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-500">
                           {formatCurrency(sale.profit)}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <span className={cn(
                             "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                             sale.deliveryStatus === 'Entregue' ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"
                           )}>
                             {sale.deliveryStatus}
                           </span>
                        </td>
                     </tr>
                   );
                 })
               )}
             </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
           <div className="w-full max-w-xl bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Registrar Venda</h2>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-white"><X className="h-6 w-6"/></button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Produto</label>
                          <select 
                            value={formData.productId}
                            onChange={e => {
                               const p = products.find(x => x.id === e.target.value);
                               setFormData({...formData, productId: e.target.value, amountPaid: p?.salePrice || 0});
                            }}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none"
                          >
                             <option value="">Selecione...</option>
                             {products.map(p => (
                               <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.salePrice)}</option>
                             ))}
                          </select>
                       </div>

                       <div className="space-y-1">
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Nome do Cliente</label>
                          <input 
                            placeholder="Nome completo"
                            value={formData.clientName}
                            onChange={e => setFormData({...formData, clientName: e.target.value})}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none" 
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tamanho</label>
                             <select 
                               value={formData.size}
                               onChange={e => setFormData({...formData, size: e.target.value as any})}
                               className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none"
                             >
                                <option>P</option>
                                <option>M</option>
                                <option>G</option>
                                <option>GG</option>
                             </select>
                          </div>
                          <div className="space-y-1">
                             <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Pagamento</label>
                             <select 
                               value={formData.paymentMethod}
                               onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                               className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-white outline-none"
                             >
                                <option>Pix</option>
                                <option>Cartão</option>
                                <option>Dinheiro</option>
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6 p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
                       <div className="text-center">
                          <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Valor Venda</p>
                          <input 
                            type="number" step="0.01"
                            value={formData.amountPaid}
                            onChange={e => setFormData({...formData, amountPaid: Number(e.target.value)})}
                            className="bg-transparent border-none text-3xl font-black text-white text-center w-full outline-none" 
                          />
                       </div>
                       
                       <div className="space-y-2 pt-4 border-t border-zinc-800">
                          <div className="flex justify-between text-xs">
                             <span className="text-zinc-500">Custo da Peça:</span>
                             <span className="text-zinc-300 font-mono">-{formatCurrency(selectedProduct?.totalCost || 0)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                             <span className="text-sm text-zinc-100">Lucro Estimado:</span>
                             <span className="text-sm text-emerald-500 font-mono">{formatCurrency(formData.amountPaid - (selectedProduct?.totalCost || 0))}</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <button 
                  onClick={() => {
                    const profit = formData.amountPaid - (selectedProduct?.totalCost || 0);
                    addSale({
                      clientId: formData.clientName,
                      productId: formData.productId,
                      amountPaid: formData.amountPaid,
                      paymentMethod: formData.paymentMethod,
                      size: formData.size,
                      deliveryStatus: 'Pendente',
                      paymentStatus: 'Pago',
                      profit: profit,
                      timestamp: Timestamp.now()
                    } as any);
                    setIsModalOpen(false);
                  }}
                  className="w-full bg-white text-zinc-950 font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                 >
                    <PlusCircle className="h-5 w-5" />
                    Finalizar Venda
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
