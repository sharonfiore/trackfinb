import React from 'react';
import { Card } from '../ui/Card';
import { useAppContext } from '../../context/AppContext';

export function Charts() {
  const { transactions } = useAppContext();
  
  // Obtener datos de los últimos 6 meses
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    last6Months.push(date.toISOString().slice(0, 7));
  }

  const monthlyData = last6Months.map(month => {
    const monthTransactions = transactions.filter(t => 
      t.date.startsWith(month) && !t.isDeferred
    );
    
    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { month, income, expenses };
  });

  const maxAmount = Math.max(
    ...monthlyData.map(d => Math.max(d.income, d.expenses)),
    1000
  );

  // Datos para gráfico de categorías
  const categoryData = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const totalExpenses = Object.values(categoryData).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Ingresos vs Gastos */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Ingresos vs Gastos (Últimos 6 meses)</h3>
        <div className="space-y-4">
          {monthlyData.map((data, index) => {
            const monthName = new Date(data.month + '-01').toLocaleDateString('es-ES', { 
              month: 'short',
              year: '2-digit' 
            });
            
            const incomePercent = (data.income / maxAmount) * 100;
            const expensesPercent = (data.expenses / maxAmount) * 100;
            
            return (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between text-sm text-white/80">
                  <span>{monthName}</span>
                  <span>${(data.income - data.expenses).toLocaleString()}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-xs text-green-400">Ingresos</div>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="h-full bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${incomePercent}%` }}
                      />
                    </div>
                    <div className="w-20 text-xs text-right text-white/60">
                      ${data.income.toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 text-xs text-red-400">Gastos</div>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className="h-full bg-red-500 rounded-full transition-all duration-500"
                        style={{ width: `${expensesPercent}%` }}
                      />
                    </div>
                    <div className="w-20 text-xs text-right text-white/60">
                      ${data.expenses.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Gráfico de Categorías */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Gastos por Categoría</h3>
        <div className="space-y-4">
          {sortedCategories.map(([category, amount], index) => {
            const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
            const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-purple-500'];
            
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm text-white/80">
                  <span>{category}</span>
                  <span>${amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${colors[index]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {sortedCategories.length === 0 && (
          <div className="text-center text-white/60 py-8">
            No hay datos de gastos disponibles
          </div>
        )}
      </Card>
    </div>
  );
}