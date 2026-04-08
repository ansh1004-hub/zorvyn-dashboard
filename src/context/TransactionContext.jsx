import React, { createContext, useState, useEffect } from "react";
import { initialTransactions, calculateSummary } from "../data/mockData";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // 1. DATA PERSISTENCE (LocalStorage)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("zorvyn_transactions");
    if (saved) return JSON.parse(saved);
    return initialTransactions;
  });

  const [role, setRole] = useState("Viewer");

  // 2. DARK MODE STATE (Persistence)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Save transactions to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem("zorvyn_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Apply Dark Mode class to the HTML document
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

  // Edit Transaction Helper
  const editTransaction = (updatedTx) => {
    setTransactions(
      transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t)),
    );
  };

  const summary = calculateSummary(transactions);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        editTransaction,
        summary,
        role,
        setRole,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
