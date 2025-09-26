import React, { useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Building2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useAppContext } from '../../context/AppContext';

const iconOptions = [
  { value: 'Building2', label: 'Banco', icon: Building2 },
  { value: 'Wallet', label: 'Billetera', icon: Building2 },
  { value: 'CreditCard', label: 'Tarjeta', icon: Building2 },
  { value: 'TrendingUp', label: 'Inversión', icon: Building2 },
  { value: 'Smartphone', label: 'Digital', icon: Building2 },
];

export function AccountTypeManager() {
  const { accountTypes, addAccountType, updateAccountType, deleteAccountType } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Building2',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingType) {
      updateAccountType(editingType, formData);
    } else {
      addAccountType(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', icon: 'Building2' });
    setIsModalOpen(false);
    setEditingType(null);
  };

  const handleEdit = (type: any) => {
    setFormData({
      name: type.name,
      icon: type.icon,
    });
    setEditingType(type.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de cuenta?')) {
      deleteAccountType(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Tipos de Cuenta</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Tipo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountTypes.map((type) => (
          <Card key={type.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{type.name}</h3>
                  <p className="text-sm text-white/60">
                    Creado: {new Date(type.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleEdit(type)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  onClick={() => handleDelete(type.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {accountTypes.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white/60 mb-2">No hay tipos de cuenta</h3>
          <p className="text-white/40 mb-6">Crea tu primer tipo de cuenta para comenzar</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Tipo
          </Button>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingType ? 'Editar Tipo de Cuenta' : 'Agregar Tipo de Cuenta'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Banco, Efectivo, Inversión"
            required
          />
          
          <Select
            label="Icono"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            required
          >
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingType ? 'Actualizar' : 'Agregar'}
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