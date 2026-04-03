// src/data/mockData.js

export const initialTransactions = [
  {
    id: "1",
    date: "2023-10-01",
    amount: 5000,
    category: "Salary",
    type: "Income",
    description: "Tech Corp Inc.",
  },
  {
    id: "2",
    date: "2023-10-03",
    amount: 1200,
    category: "Housing",
    type: "Expense",
    description: "Monthly Rent",
  },
  {
    id: "3",
    date: "2023-10-05",
    amount: 150,
    category: "Food",
    type: "Expense",
    description: "Groceries",
  },
  {
    id: "4",
    date: "2023-10-08",
    amount: 60,
    category: "Utilities",
    type: "Expense",
    description: "Internet Bill",
  },
  {
    id: "5",
    date: "2023-10-12",
    amount: 300,
    category: "Freelance",
    type: "Income",
    description: "Web Design Project",
  },
  {
    id: "6",
    date: "2023-10-15",
    amount: 80,
    category: "Entertainment",
    type: "Expense",
    description: "Movie Night",
  },
  {
    id: "7",
    date: "2023-10-20",
    amount: 200,
    category: "Food",
    type: "Expense",
    description: "Dinner out",
  },
];

export const calculateSummary = (transactions) => {
  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return {
    totalBalance: income - expenses,
    income,
    expenses,
  };
};
