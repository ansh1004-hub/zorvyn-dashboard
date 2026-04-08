import React, { useState, useContext } from "react";
import { LayoutDashboard, ArrowLeftRight, Moon, Sun } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Overview from "./components/Overview";
import Transactions from "./components/Transactions";
import { TransactionContext } from "./context/TransactionContext";

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const { role, setRole, isDarkMode, toggleDarkMode } =
    useContext(TransactionContext);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900 font-sans transition-colors duration-200">
      <Toaster position="bottom-right" />{" "}
      {/* The Toast Notification Container */}
      {/* SIDEBAR */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm hidden md:flex flex-col transition-colors duration-200">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ZorvynDash
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "overview" ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
          >
            <LayoutDashboard size={20} />{" "}
            <span className="font-medium">Overview</span>
          </button>
          <button
            onClick={() => setActiveTab("transactions")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === "transactions" ? "bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
          >
            <ArrowLeftRight size={20} />{" "}
            <span className="font-medium">Transactions</span>
          </button>
        </nav>
      </aside>
      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* HEADER */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white capitalize">
            {activeTab}
          </h2>

          <div className="flex items-center space-x-6">
            {/* DARK MODE TOGGLE */}
            <button
              onClick={toggleDarkMode}
              className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Role:
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 outline-none p-2 cursor-pointer"
              >
                <option value="Viewer">Viewer</option>
                <option value="Admin">Admin</option>
              </select>
              <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800">
                {role.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD PLUG-IN */}
        <div className="p-8">
          {activeTab === "overview" ? <Overview /> : <Transactions />}
        </div>
      </main>
    </div>
  );
}

export default App;
