export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description?: string | null;
  transactionDate: string;
  userId: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  monthlyLimit: number;
  month: number;
  year: number;
  createdAt: string;
  spent?: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
}

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  categoryBreakdown: { name: string; value: number }[];
}

export type CategoryName = 
  | "Food" 
  | "Transport" 
  | "Shopping" 
  | "Bills" 
  | "Salary" 
  | "Other";
