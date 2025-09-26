import React, { createContext, useContext, ReactNode } from 'react';
import { AppState, AccountType, Account, SavingsGoal, Transaction } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { GoogleSheetsService } from '../services/googleSheets';

interface AppContextType extends AppState {
  // Account Types
  addAccountType: (accountType: Omit<AccountType, 'id' | 'createdAt'>) => void;
  updateAccountType: (id: string, accountType: Partial<AccountType>) => void;
  deleteAccountType: (id: string) => void;
  
  // Accounts
  addAccount: (account: Omit<Account, 'id' | 'createdAt'>) => void;
  updateAccount: (id: string, account: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  // Savings Goals
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void;
  updateSavingsGoal: (id: string, goal: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  
  // Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // UI
  toggleHideAmounts: () => void;
  getTotalBalance: () => number;
  getAccountBalance: (accountId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  accountTypes: [
    { id: '1', name: 'Banco', icon: 'Building2', createdAt: new Date().toISOString() },
    { id: '2', name: 'Efectivo', icon: 'Wallet', createdAt: new Date().toISOString() },
    { id: '3', name: 'Inversión', icon: 'TrendingUp', createdAt: new Date().toISOString() },
  ],
  accounts: [
    { id: '1', name: 'Cuenta Principal', typeId: '1', balance: 5000, isCredit: false, createdAt: new Date().toISOString() },
    { id: '2', name: 'Tarjeta de Crédito', typeId: '1', balance: 0, creditLimit: 10000, isCredit: true, createdAt: new Date().toISOString() },
  ],
  savingsGoals: [
    { id: '1', name: 'Vacaciones', targetAmount: 3000, currentAmount: 1200, accountId: '1', targetDate: '2025-06-01', createdAt: new Date().toISOString() },
  ],
  transactions: [
    { id: '1', type: 'income', amount: 5000, description: 'Salario', category: 'Trabajo', accountId: '1', date: '2025-01-01', createdAt: new Date().toISOString() },
    { id: '2', type: 'expense', amount: 50, description: 'Supermercado', category: 'Alimentación', accountId: '1', date: '2025-01-02', createdAt: new Date().toISOString() },
  ],
  hideAmounts: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useLocalStorage<AppState>('financeApp', initialState);
  const googleSheets = GoogleSheetsService.getInstance();

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const addAccountType = (accountType: Omit<AccountType, 'id' | 'createdAt'>) => {
    const newAccountType: AccountType = {
      ...accountType,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedState = {
      ...state,
      accountTypes: [...state.accountTypes, newAccountType],
    };
    setState(updatedState);
    googleSheets.syncData('accountTypes', updatedState.accountTypes);
  };

  const updateAccountType = (id: string, accountType: Partial<AccountType>) => {
    const updatedState = {
      ...state,
      accountTypes: state.accountTypes.map(item =>
        item.id === id ? { ...item, ...accountType } : item
      ),
    };
    setState(updatedState);
    googleSheets.syncData('accountTypes', updatedState.accountTypes);
  };

  const deleteAccountType = (id: string) => {
    const updatedState = {
      ...state,
      accountTypes: state.accountTypes.filter(item => item.id !== id),
    };
    setState(updatedState);
    googleSheets.syncData('accountTypes', updatedState.accountTypes);
  };

  const addAccount = (account: Omit<Account, 'id' | 'createdAt'>) => {
    const newAccount: Account = {
      ...account,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedState = {
      ...state,
      accounts: [...state.accounts, newAccount],
    };
    setState(updatedState);
    googleSheets.syncData('accounts', updatedState.accounts);
  };

  const updateAccount = (id: string, account: Partial<Account>) => {
    const updatedState = {
      ...state,
      accounts: state.accounts.map(item =>
        item.id === id ? { ...item, ...account } : item
      ),
    };
    setState(updatedState);
    googleSheets.syncData('accounts', updatedState.accounts);
  };

  const deleteAccount = (id: string) => {
    const updatedState = {
      ...state,
      accounts: state.accounts.filter(item => item.id !== id),
    };
    setState(updatedState);
    googleSheets.syncData('accounts', updatedState.accounts);
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updatedState = {
      ...state,
      savingsGoals: [...state.savingsGoals, newGoal],
    };
    setState(updatedState);
    googleSheets.syncData('savingsGoals', updatedState.savingsGoals);
  };

  const updateSavingsGoal = (id: string, goal: Partial<SavingsGoal>) => {
    const updatedState = {
      ...state,
      savingsGoals: state.savingsGoals.map(item =>
        item.id === id ? { ...item, ...goal } : item
      ),
    };
    setState(updatedState);
    googleSheets.syncData('savingsGoals', updatedState.savingsGoals);
  };

  const deleteSavingsGoal = (id: string) => {
    const updatedState = {
      ...state,
      savingsGoals: state.savingsGoals.filter(item => item.id !== id),
    };
    setState(updatedState);
    googleSheets.syncData('savingsGoals', updatedState.savingsGoals);
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    // Actualizar balance de la cuenta
    const updatedAccounts = state.accounts.map(account => {
      if (account.id === transaction.accountId) {
        const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        return { ...account, balance: account.balance + balanceChange };
      }
      return account;
    });

    const updatedState = {
      ...state,
      transactions: [...state.transactions, newTransaction],
      accounts: updatedAccounts,
    };
    setState(updatedState);
    googleSheets.syncData('transactions', updatedState.transactions);
    googleSheets.syncData('accounts', updatedState.accounts);
  };

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    const updatedState = {
      ...state,
      transactions: state.transactions.map(item =>
        item.id === id ? { ...item, ...transaction } : item
      ),
    };
    setState(updatedState);
    googleSheets.syncData('transactions', updatedState.transactions);
  };

  const deleteTransaction = (id: string) => {
    const transactionToDelete = state.transactions.find(t => t.id === id);
    if (transactionToDelete) {
      // Revertir el balance de la cuenta
      const updatedAccounts = state.accounts.map(account => {
        if (account.id === transactionToDelete.accountId) {
          const balanceChange = transactionToDelete.type === 'income' ? -transactionToDelete.amount : transactionToDelete.amount;
          return { ...account, balance: account.balance + balanceChange };
        }
        return account;
      });

      const updatedState = {
        ...state,
        transactions: state.transactions.filter(item => item.id !== id),
        accounts: updatedAccounts,
      };
      setState(updatedState);
      googleSheets.syncData('transactions', updatedState.transactions);
      googleSheets.syncData('accounts', updatedState.accounts);
    }
  };

  const toggleHideAmounts = () => {
    setState({ ...state, hideAmounts: !state.hideAmounts });
  };

  const getTotalBalance = () => {
    return state.accounts.reduce((total, account) => {
      return total + (account.isCredit ? 0 : account.balance);
    }, 0);
  };

  const getAccountBalance = (accountId: string) => {
    const account = state.accounts.find(a => a.id === accountId);
    return account ? account.balance : 0;
  };

  const value: AppContextType = {
    ...state,
    addAccountType,
    updateAccountType,
    deleteAccountType,
    addAccount,
    updateAccount,
    deleteAccount,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    toggleHideAmounts,
    getTotalBalance,
    getAccountBalance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};