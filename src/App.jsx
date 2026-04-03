import React, { useState } from "react";
import { initialTransactions, calculateSummary } from "./data/mockData";
import { LayoutDashboard, ArrowLeftRight } from "lucide-react";
import Overview from "./components/Overview";
import Transactions from "./components/Transactions";

function App() {
  // Global State
  const [transactions, setTransactions] = useState(initialTransactions);
  const [role, setRole] = useState("Viewer"); // 'Viewer' or 'Admin'
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' or 'transactions'

  const summary = calculateSummary(transactions);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">ZorvynDash</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "overview" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "transactions" ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <ArrowLeftRight size={20} />
            <span className="font-medium">Transactions</span>
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 capitalize">
            {activeTab}
          </h2>

          {/* Role Toggle Simulation */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer"
            >
              <option value="Viewer">Viewer</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              {role.charAt(0)}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT PLUG-IN POINT */}
        <div className="p-8">
          {activeTab === "overview" ? (
            <Overview summary={summary} transactions={transactions} />
          ) : (
            <Transactions
              transactions={transactions}
              setTransactions={setTransactions}
              role={role}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
