import React from 'react';
import { TrendingUp, TrendingDown, Wallet, Target, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAppContext } from '../../context/AppContext';

export function StatsCards() {
  const { transactions, accounts, savingsGoals, hideAmounts, toggleHideAmounts, getTotalBalance } = useAppContext();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyTransactions = transactions.filter(t => 
    t.date.startsWith(currentMonth) && !t.isDeferred
  );

  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavingsGoals = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

  const formatAmount = (amount: number) => {
    return hideAmounts ? '•••••' : `$${amount.toLocaleString()}`;
  };

  const stats = [
    {
      title: 'Balance Total',
      value: getTotalBalance(),
      icon: Wallet,
      color: 'from-blue-600 to-blue-400',
      textColor: 'text-blue-100',
    },
    {
      title: 'Ingresos del Mes',
      value: monthlyIncome,
      icon: TrendingUp,
      color: 'from-green-600 to-green-400',
      textColor: 'text-green-100',
    },
    {
      title: 'Gastos del Mes',
      value: monthlyExpenses,
      icon: TrendingDown,
      color: 'from-red-600 to-red-400',
      textColor: 'text-red-100',
    },
    {
      title: 'Ahorros Acumulados',
      value: totalSavingsGoals,
      icon: Target,
      color: 'from-orange-600 to-orange-400',
      textColor: 'text-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Resumen Financiero</h2>
        <button
          onClick={toggleHideAmounts}
          className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title={hideAmounts ? 'Mostrar montos' : 'Ocultar montos'}
        >
          {hideAmounts ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                <Icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div>
                <p className="text-white/60 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">
                  {formatAmount(stat.value)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}