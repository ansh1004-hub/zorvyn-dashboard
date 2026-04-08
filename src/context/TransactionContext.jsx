import React, { createContext, useState, useEffect } from "react";
import { initialTransactions, calculateSummary } from "../data/mockData";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("zorvyn_transactions");
    if (saved) return JSON.parse(saved);
    return initialTransactions;
  });

  const [role, setRole] = useState("Viewer");
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  // NEW: Global Month Filter State
  const [monthFilter, setMonthFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("zorvyn_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const editTransaction = (updatedTx) => {
    setTransactions(
      transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t)),
    );
  };

  // NEW: Extract unique months from all transactions (e.g., "2023-10")
  const uniqueMonths = [
    "All",
    ...new Set(transactions.map((t) => t.date.substring(0, 7))),
  ].sort((a, b) => b.localeCompare(a));

  // NEW: Filter data based on the selected month
  const displayedTransactions =
    monthFilter === "All"
      ? transactions
      : transactions.filter((t) => t.date.startsWith(monthFilter));

  // Calculate summary based ONLY on the filtered month!
  const summary = calculateSummary(displayedTransactions);

  return (
    <TransactionContext.Provider
      value={{
        transactions, // Raw data for adding/editing
        displayedTransactions, // Filtered data for charts/tables
        setTransactions,
        editTransaction,
        summary,
        role,
        setRole,
        isDarkMode,
        toggleDarkMode,
        monthFilter,
        setMonthFilter,
        uniqueMonths, // Exporting new filter states
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
