import React, { createContext, useState } from "react";
import { initialTransactions, calculateSummary } from "../data/mockData";

// 1. Create the Context (The Brain)
export const TransactionContext = createContext();

// 2. Create the Provider (The Wrapper that holds the state)
export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole] = useState("Viewer"); // Global role state

  // We calculate the summary here so EVERY component has access to the latest numbers
  const summary = calculateSummary(transactions);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        setTransactions,
        summary,
        role,
        setRole,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
