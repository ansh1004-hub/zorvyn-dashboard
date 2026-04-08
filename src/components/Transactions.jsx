import React, { useState, useContext } from "react";
import { Search, Plus, Trash2, X, ArrowUpDown } from "lucide-react";
import { TransactionContext } from "../context/TransactionContext";

const Transactions = () => {
  // Grab state and updater functions from the Context Brain
  const { transactions, setTransactions, role } =
    useContext(TransactionContext);

  // Local UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    type: "Expense",
  });

  // 1. Filtering Logic
  let processedTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // 2. Sorting Logic
  processedTransactions.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Handle column header clicks
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Form Submission
  const handleAddTransaction = (e) => {
    e.preventDefault();
    const newTx = {
      id: Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount) || 0,
    };
    setTransactions([newTx, ...transactions]);
    setShowModal(false);
    setFormData({
      date: "",
      description: "",
      category: "",
      amount: "",
      type: "Expense",
    });
  };

  // Delete Transaction
  const handleDelete = (idToDelete) => {
    setTransactions(transactions.filter((t) => t.id !== idToDelete));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
      {/* HEADER CONTROLS */}
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Transactions
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search description or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>

          {role === "Admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={16} />
              <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500">
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => requestSort("description")}
              >
                <div className="flex items-center gap-1">
                  Description{" "}
                  <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => requestSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => requestSort("amount")}
              >
                <div className="flex items-center gap-1">
                  Amount <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              {role === "Admin" && (
                <th className="py-3 px-6 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {processedTransactions.length > 0 ? (
              processedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-500">{t.date}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">
                    {t.description}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-medium">
                      {t.category}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-6 text-sm font-semibold ${t.type === "Income" ? "text-emerald-600" : "text-gray-900"}`}
                  >
                    {t.type === "Income" ? "+" : "-"}$
                    {t.amount.toLocaleString()}
                  </td>
                  {role === "Admin" && (
                    <td className="py-4 px-6 text-sm text-right">
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={role === "Admin" ? 5 : 4}
                  className="py-12 text-center text-gray-500"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Add Transaction
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salary, Groceries..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Food"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
