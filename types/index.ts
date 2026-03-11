export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  description?: string;
  transactionDate: Date;
  categoryId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
  userId: string;
}
