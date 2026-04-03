export type TransactionCategory = 
  | "Food & Dining" 
  | "Transportation" 
  | "Shopping" 
  | "Entertainment" 
  | "Health" 
  | "Bills & Utilities" 
  | "Investment" 
  | "Income" 
  | "Others";

export class AIService {
  private static categoryMapping: Record<string, TransactionCategory> = {
    // Food & Dining
    swiggy: "Food & Dining",
    zomato: "Food & Dining",
    starbucks: "Food & Dining",
    mcdonalds: "Food & Dining",
    kfc: "Food & Dining",
    dominos: "Food & Dining",
    restaurant: "Food & Dining",
    cafe: "Food & Dining",
    dining: "Food & Dining",
    
    // Transportation
    uber: "Transportation",
    ola: "Transportation",
    rapido: "Transportation",
    petrol: "Transportation",
    fuel: "Transportation",
    shell: "Transportation",
    irctc: "Transportation",
    railway: "Transportation",
    airline: "Transportation",
    indigo: "Transportation",
    
    // Shopping
    amazon: "Shopping",
    flipkart: "Shopping",
    myntra: "Shopping",
    nykaa: "Shopping",
    grocery: "Shopping",
    supermarket: "Shopping",
    reliance: "Shopping",
    dmart: "Shopping",
    mall: "Shopping",
    
    // Bills & Utilities
    recharge: "Bills & Utilities",
    airtel: "Bills & Utilities",
    jio: "Bills & Utilities",
    electricity: "Bills & Utilities",
    water: "Bills & Utilities",
    rent: "Bills & Utilities",
    insurance: "Bills & Utilities",
    lic: "Bills & Utilities",
    
    // Entertainment
    netflix: "Entertainment",
    hotstar: "Entertainment",
    prime: "Entertainment",
    cinema: "Entertainment",
    pvr: "Entertainment",
    bookmyshow: "Entertainment",
    gaming: "Entertainment",
    spotify: "Entertainment",
    
    // Health
    apollo: "Health",
    pharmeasy: "Health",
    hospital: "Health",
    medical: "Health",
    gym: "Health",
    fitness: "Health",
    
    // Income
    salary: "Income",
    refund: "Income",
    interest: "Income",
    dividend: "Income",
  };

  static classifyTransaction(description: string): TransactionCategory {
    const desc = description.toLowerCase();
    
    for (const [keyword, category] of Object.entries(this.categoryMapping)) {
      if (desc.includes(keyword)) {
        return category;
      }
    }
    
    return "Others";
  }

  static getCategoryIcon(category: TransactionCategory): string {
    switch (category) {
      case "Food & Dining": return "Utensils";
      case "Transportation": return "Car";
      case "Shopping": return "ShoppingBag";
      case "Entertainment": return "Film";
      case "Health": return "HeartPulse";
      case "Bills & Utilities": return "Zap";
      case "Investment": return "LineChart";
      case "Income": return "TrendingUp";
      default: return "CreditCard";
    }
  }
}
