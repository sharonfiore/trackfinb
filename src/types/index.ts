export interface AccountType {
  id: string;
  name: string;
  icon: string;
  createdAt: string;
}

export interface Account {
  id: string;
  name: string;
  typeId: string;
  balance: number;
  creditLimit?: number;
  isCredit: boolean;
  createdAt: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  accountId: string;
  targetDate: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  accountId: string;
  date: string;
  isDeferred?: boolean; // Para gastos de tarjeta diferidos
  deferredMonth?: string; // Mes al que se difiere el gasto
  createdAt: string;
}

export interface AppState {
  accountTypes: AccountType[];
  accounts: Account[];
  savingsGoals: SavingsGoal[];
  transactions: Transaction[];
  hideAmounts: boolean;
}