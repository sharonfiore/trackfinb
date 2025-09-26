import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { AccountTypeManager } from './components/accounts/AccountTypeManager';
import { AccountManager } from './components/accounts/AccountManager';
import { SavingsGoalManager } from './components/savings/SavingsGoalManager';
import { TransactionManager } from './components/transactions/TransactionManager';
import { Settings } from './components/settings/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'account-types':
        return <AccountTypeManager />;
      case 'accounts':
        return <AccountManager />;
      case 'savings':
        return <SavingsGoalManager />;
      case 'transactions':
        return <TransactionManager />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="flex">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 p-8">
            {renderContent()}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;