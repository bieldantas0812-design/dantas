import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useDbCollection } from '../hooks/useDb';
import { Sale, InventoryItem, Expense, Goal, Product } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';

export function Dashboard() {
  const { data: sales } = useDbCollection<Sale>('sales');
  const { data: inventory } = useDbCollection<InventoryItem>('inventory_items');
  const { data: expenses } = useDbCollection<Expense>('expenses');
  const { data: goals } = useDbCollection<Goal>('goals');
  const { data: products } = useDbCollection<Product>('products');

  // Stats
  const totalSalesCount = sales.length;
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.amountPaid, 0);
  const totalProfit = sales.reduce((acc, sale) => acc + sale.profit, 0);
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalProfit - totalExpenses;
  
  const totalStock = inventory.reduce((acc, item) => acc + item.currentStock, 0);
  const itemsSold = inventory.reduce((acc, item) => acc + item.soldQuantity, 0);

  // Alerts
  const lowStockItems = inventory.filter(item => item.currentStock < 5);

  const stats = [
    { label: 'Estoque Total', value: totalStock, icon: Package, color: 'text-blue-500' },
    { label: 'Camisas Vendidas', value: itemsSold, icon: ShoppingCart, color: 'text-purple-500' },
    { label: 'Faturamento Total', value: formatCurrency(totalRevenue), icon: TrendingUp, color: 'text-green-500' },
    { label: 'Lucro Líquido', value: formatCurrency(netProfit), icon: DollarSign, color: netProfit >= 0 ? 'text-emerald-500' : 'text-red-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-zinc-400">Visão geral do seu corre.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <stat.icon className={cn("h-5 w-5", stat.color)} />
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</span>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts & Notifications */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 overflow-hidden">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Alertas
            </h2>
            <div className="space-y-4">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-yellow-500/10 p-3 border border-yellow-500/20">
                     <Package className="h-4 w-4 text-yellow-500 mt-0.5" />
                     <div>
                       <p className="text-sm font-medium text-yellow-200">Estoque Baixo</p>
                       <p className="text-xs text-yellow-200/70">{item.model} {item.color} ({item.size}) - Apenas {item.currentStock} unidades.</p>
                     </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 rounded-lg bg-green-500/10 p-3 border border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-green-200">Tudo sob controle no estoque!</p>
                </div>
              )}

              {goals.filter(g => (g.currentValue / g.targetValue) >= 1).map((goal, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg bg-green-500/10 p-3 border border-green-500/20">
                  <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-200">Meta Batida!</p>
                    <p className="text-xs text-green-200/70">{goal.title} concluída com sucesso.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Metas Ativas
            </h2>
            <div className="space-y-6">
              {goals.length > 0 ? goals.slice(0, 3).map((goal) => {
                const percent = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-300 font-medium">{goal.title}</span>
                      <span className="text-zinc-500">{percent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 transition-all duration-1000" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500">
                      {goal.currentValue} / {goal.targetValue}
                    </p>
                  </div>
                );
              }) : (
                <p className="text-sm text-zinc-500">Nenhuma meta cadastrada.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-semibold text-white">Vendas Mensais</h2>
             <div className="flex items-center gap-2 text-xs text-zinc-500">
               <Calendar className="h-4 w-4" />
               Últimos 30 dias
             </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sales.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#71717a" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => new Date(val?.seconds * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `R$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                />
                <Bar dataKey="amountPaid" fill="#fff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Quick Actions or Bottom Grid */}
       <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Melhores Produtos</h2>
            <div className="space-y-4">
               {products.slice(0, 5).map((product) => (
                 <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                       {product.mockupUrl ? <img src={product.mockupUrl} className="object-cover h-full w-full" /> : <Shirt className="h-5 w-5 text-zinc-600" />}
                     </div>
                     <div>
                       <p className="text-sm font-medium text-white">{product.name}</p>
                       <p className="text-xs text-zinc-500">{product.color}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-semibold text-white">{formatCurrency(product.salePrice)}</p>
                     <p className="text-xs text-green-500">{(product.salePrice / product.totalCost * 100 - 100).toFixed(0)}% margem</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Resumo Financeiro</h2>
            <div className="space-y-4">
               <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                 <span className="text-sm text-zinc-400">Receita Bruta</span>
                 <span className="text-sm font-semibold text-white">{formatCurrency(totalRevenue)}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                 <span className="text-sm text-zinc-400">Total Produção (Estimado)</span>
                 <span className="text-sm font-semibold text-red-400">-{formatCurrency(totalRevenue - totalProfit)}</span>
               </div>
               <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                 <span className="text-sm text-zinc-400">Despesas Operacionais</span>
                 <span className="text-sm font-semibold text-red-400">-{formatCurrency(totalExpenses)}</span>
               </div>
               <div className="flex justify-between items-center pt-2">
                 <span className="text-base font-bold text-white">Lucro Real</span>
                 <span className={cn("text-base font-bold", netProfit >= 0 ? "text-green-500" : "text-red-500")}>
                   {formatCurrency(netProfit)}
                 </span>
               </div>
            </div>
          </div>
       </div>
    </div>
  );
}
