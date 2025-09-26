import React, { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, CreditCard, Wallet, Eye, EyeOff } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAppContext } from '../../context/AppContext';

export function AccountManager() {
  const { accounts, accountTypes, addAccount, updateAccount, deleteAccount, hideAmounts, toggleHideAmounts } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    typeId: '',
    balance: 0,
    creditLimit: 0,
    isCredit: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAccount) {
      updateAccount(editingAccount, formData);
    } else {
      addAccount(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      typeId: '',
      balance: 0,
      creditLimit: 0,
      isCredit: false,
    });
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleEdit = (account: any) => {
    setFormData({
      name: account.name,
      typeId: account.typeId,
      balance: account.balance,
      creditLimit: account.creditLimit || 0,
      isCredit: account.isCredit,
    });
    setEditingAccount(account.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
      deleteAccount(id);
    }
  };

  const getTypeName = (typeId: string) => {
    const type = accountTypes.find(t => t.id === typeId);
    return type ? type.name : 'Tipo no encontrado';
  };

  const formatAmount = (amount: number) => {
    return hideAmounts ? '•••••' : `$${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestión de Cuentas</h2>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={toggleHideAmounts}>
            {hideAmounts ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Cuenta
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card key={account.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  account.isCredit ? 'bg-orange-500/20' : 'bg-green-500/20'
                }`}>
                  {account.isCredit ? (
                    <CreditCard className="w-6 h-6 text-orange-400" />
                  ) : (
                    <Wallet className="w-6 h-6 text-green-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{account.name}</h3>
                  <p className="text-sm text-white/60">{getTypeName(account.typeId)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleEdit(account)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => handleDelete(account.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Balance:</span>
                <span className={`font-semibold ${
                  account.balance >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatAmount(account.balance)}
                </span>
              </div>
              
              {account.isCredit && account.creditLimit && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Límite:</span>
                    <span className="text-white/80">
                      {formatAmount(account.creditLimit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Disponible:</span>
                    <span className="text-blue-400 font-semibold">
                      {formatAmount(account.creditLimit - Math.abs(account.balance))}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>

      {accounts.length === 0 && (
        <Card className="p-12 text-center">
          <CreditCard className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/60 mb-2">No hay cuentas registradas</h3>
          <p className="text-white/40 mb-6">Crea tu primera cuenta para comenzar a gestionar tus finanzas</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primera Cuenta
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingAccount ? 'Editar Cuenta' : 'Agregar Cuenta'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre de la cuenta"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Cuenta Corriente, Tarjeta Visa"
            required
          />
          
          <Select
            label="Tipo de cuenta"
            value={formData.typeId}
            onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
            required
          >
            <option value="">Seleccionar tipo</option>
            {accountTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCredit"
              checked={formData.isCredit}
              onChange={(e) => setFormData({ ...formData, isCredit: e.target.checked })}
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
            />
            <label htmlFor="isCredit" className="text-white/80">
              Es tarjeta de crédito
            </label>
          </div>

          <Input
            label={formData.isCredit ? "Balance inicial" : "Balance inicial"}
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
            placeholder="0.00"
            required
          />

          {formData.isCredit && (
            <Input
              label="Límite de crédito"
              type="number"
              step="0.01"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
          )}

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingAccount ? 'Actualizar' : 'Agregar'}
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