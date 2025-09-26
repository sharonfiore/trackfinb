import React from 'react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  ArrowUpDown, 
  Settings,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'accounts', label: 'Cuentas', icon: CreditCard },
  { id: 'account-types', label: 'Tipos de Cuenta', icon: Building2 },
  { id: 'savings', label: 'Metas de Ahorro', icon: Target },
  { id: 'transactions', label: 'Transacciones', icon: ArrowUpDown },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <div className="w-64 min-h-screen bg-white/5 backdrop-blur-lg border-r border-white/10">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <CreditCard className="w-8 h-8 text-blue-400" />
          FinanceApp
        </h1>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 text-left
                  ${isActive 
                    ? 'bg-blue-500/20 text-blue-100 border border-blue-500/30' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}