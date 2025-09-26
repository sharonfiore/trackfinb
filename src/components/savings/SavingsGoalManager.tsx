import React, { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Target, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ProgressBar } from '../ui/ProgressBar';
import { useAppContext } from '../../context/AppContext';

export function SavingsGoalManager() {
  const { savingsGoals, accounts, addSavingsGoal, updateSavingsGoal, deleteSavingsGoal, hideAmounts } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    accountId: '',
    targetDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGoal) {
      updateSavingsGoal(editingGoal, formData);
    } else {
      addSavingsGoal(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      targetAmount: 0,
      currentAmount: 0,
      accountId: '',
      targetDate: '',
    });
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleEdit = (goal: any) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      accountId: goal.accountId,
      targetDate: goal.targetDate,
    });
    setEditingGoal(goal.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta meta de ahorro?')) {
      deleteSavingsGoal(id);
    }
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    return account ? account.name : 'Cuenta no encontrada';
  };

  const formatAmount = (amount: number) => {
    return hideAmounts ? '•••••' : `$${amount.toLocaleString()}`;
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Metas de Ahorro</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const isOverdue = daysRemaining < 0;
          const isCompleted = goal.currentAmount >= goal.targetAmount;
          
          return (
            <Card key={goal.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isCompleted ? 'bg-green-500/20' : isOverdue ? 'bg-red-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Target className={`w-6 h-6 ${
                      isCompleted ? 'text-green-400' : isOverdue ? 'text-red-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{goal.name}</h3>
                    <p className="text-sm text-white/60">{getAccountName(goal.accountId)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handleEdit(goal)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="danger"
                    onClick={() => handleDelete(goal.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <ProgressBar
                  value={goal.currentAmount}
                  max={goal.targetAmount}
                  showLabel={!hideAmounts}
                  color={isCompleted ? 'green' : isOverdue ? 'red' : 'blue'}
                />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60 mb-1">Actual</p>
                    <p className="text-white font-semibold">
                      {formatAmount(goal.currentAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Meta</p>
                    <p className="text-white font-semibold">
                      {formatAmount(goal.targetAmount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/60">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(goal.targetDate).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className={`font-medium ${
                    isCompleted ? 'text-green-400' : isOverdue ? 'text-red-400' : 'text-blue-400'
                  }`}>
                    {isCompleted ? 
                      '¡Meta alcanzada!' : 
                      isOverdue ? 
                        `${Math.abs(daysRemaining)} días atrasado` :
                        `${daysRemaining} días restantes`
                    }
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {savingsGoals.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/60 mb-2">No hay metas de ahorro</h3>
          <p className="text-white/40 mb-6">Define tus objetivos financieros y alcánzalos paso a paso</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primera Meta
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingGoal ? 'Editar Meta de Ahorro' : 'Agregar Meta de Ahorro'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la meta"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Vacaciones, Auto nuevo, Casa"
            required
          />
          
          <Select
            label="Cuenta de ahorro"
            value={formData.accountId}
            onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
            required
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.filter(account => !account.isCredit).map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} (${account.balance.toLocaleString()})
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monto objetivo"
              type="number"
              step="0.01"
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) })}
              placeholder="0.00"
              required
            />

            <Input
              label="Monto actual"
              type="number"
              step="0.01"
              value={formData.currentAmount}
              onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) })}
              placeholder="0.00"
              required
            />
          </div>

          <Input
            label="Fecha objetivo"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingGoal ? 'Actualizar' : 'Agregar'}
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