import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { useAppContext } from '../../context/AppContext';

export function RecentTransactions() {
  const { transactions, accounts, hideAmounts } = useAppContext();

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const formatAmount = (amount: number) => {
    return hideAmounts ? '•••••' : `$${amount.toLocaleString()}`;
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : 'Cuenta no encontrada';
  };

  if (recentTransactions.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-white mb-6">Transacciones Recientes</h3>
        <div className="text-center text-white/60 py-8">
          No hay transacciones registradas
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-white mb-6">Transacciones Recientes</h3>
      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="w-5 h-5" />
                ) : (
                  <ArrowDownLeft className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">{transaction.description}</p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{getAccountName(transaction.accountId)}</span>
                  {transaction.isDeferred && (
                    <>
                      <span>•</span>
                      <span className="text-orange-400">Diferido</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatAmount(transaction.amount)}
              </p>
              <div className="flex items-center gap-1 text-sm text-white/60">
                <Calendar className="w-4 h-4" />
                {new Date(transaction.date).toLocaleDateString('es-ES')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}