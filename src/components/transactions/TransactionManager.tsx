import React, { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, ArrowUpRight, ArrowDownLeft, Filter, Calendar, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAppContext } from '../../context/AppContext';

export function TransactionManager() {
  const { 
    transactions, 
    accounts, 
    addTransaction, 
    updateTransaction, 
    deleteTransaction,
    hideAmounts 
  } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: 0,
    description: '',
    category: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    isDeferred: false,
    deferredMonth: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTransaction) {
      updateTransaction(editingTransaction, formData);
    } else {
      addTransaction(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      amount: 0,
      description: '',
      category: '',
      accountId: '',
      date: new Date().toISOString().split('T')[0],
      isDeferred: false,
      deferredMonth: '',
    });
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: any) => {
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      accountId: transaction.accountId,
      date: transaction.date,
      isDeferred: transaction.isDeferred || false,
      deferredMonth: transaction.deferredMonth || '',
    });
    setEditingTransaction(transaction.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      deleteTransaction(id);
    }
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : 'Cuenta no encontrada';
  };

  const isAccountCredit = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.isCredit : false;
  };

  const formatAmount = (amount: number) => {
    return hideAmounts ? '•••••' : `$${amount.toLocaleString()}`;
  };

  const filteredAndSortedTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const expenseCategories = [
    'Alimentación', 'Transporte', 'Salud', 'Entretenimiento', 'Educación',
    'Servicios', 'Compras', 'Viajes', 'Otros'
  ];

  const incomeCategories = [
    'Salario', 'Freelance', 'Inversiones', 'Bonos', 'Otros ingresos'
  ];

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Transacciones</h2>
        
        <div className="flex flex-wrap gap-3">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-auto min-w-[120px]"
          >
            <option value="all">Todas</option>
            <option value="income">Ingresos</option>
            <option value="expense">Gastos</option>
          </Select>
          
          <Button variant="secondary" onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
            <Calendar className="w-4 h-4 mr-2" />
            {sortOrder === 'desc' ? 'Más recientes' : 'Más antiguos'}
          </Button>
          
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Transacción
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedTransactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex items-center justify-between">
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
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{transaction.description}</h3>
                    {transaction.isDeferred && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Diferido
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-white/60">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{getAccountName(transaction.accountId)}</span>
                    <span>•</span>
                    <span>{new Date(transaction.date).toLocaleDateString('es-ES')}</span>
                    {transaction.isDeferred && transaction.deferredMonth && (
                      <>
                        <span>•</span>
                        <span>Para {new Date(transaction.deferredMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className={`font-semibold text-lg ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatAmount(transaction.amount)}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleEdit(transaction)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAndSortedTransactions.length === 0 && (
        <Card className="p-12 text-center">
          <ArrowUpDown className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/60 mb-2">
            {filterType === 'all' ? 'No hay transacciones' : `No hay ${filterType === 'income' ? 'ingresos' : 'gastos'}`}
          </h3>
          <p className="text-white/40 mb-6">
            {filterType === 'all' 
              ? 'Registra tu primera transacción para comenzar'
              : `Registra tu primer ${filterType === 'income' ? 'ingreso' : 'gasto'}`
            }
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Transacción
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingTransaction ? 'Editar Transacción' : 'Agregar Transacción'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Tipo"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            required
          >
            <option value="income">Ingreso</option>
            <option value="expense">Gasto</option>
          </Select>

          <Input
            label="Monto"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            placeholder="0.00"
            required
          />

          <Input
            label="Descripción"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Ej: Supermercado, Salario, Gasolina"
            required
          />

          <Select
            label="Categoría"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>

          <Select
            label="Cuenta"
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
            required
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} ({account.isCredit ? 'Crédito' : 'Débito'})
              </option>
            ))}
          </Select>

          <Input
            label="Fecha"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          {formData.type === 'expense' && isAccountCredit(formData.accountId) && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDeferred"
                  checked={formData.isDeferred}
                  onChange={(e) => setFormData({ ...formData, isDeferred: e.target.checked })}
                  className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                />
                <label htmlFor="isDeferred" className="text-white/80">
                  Diferir gasto al próximo mes
                </label>
              </div>

              {formData.isDeferred && (
                <Input
                  label="Mes de pago"
                  type="month"
                  value={formData.deferredMonth}
                  onChange={(e) => setFormData({ ...formData, deferredMonth: e.target.value })}
                  required
                />
              )}
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingTransaction ? 'Actualizar' : 'Agregar'}
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}