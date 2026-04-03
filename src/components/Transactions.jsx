import React, { useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";

const Transactions = ({ transactions, role }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All"); // 'All', 'Income', 'Expense'

  // Filtering Logic (This runs instantly on every keystroke/dropdown change)
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || t.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* HEADER & CONTROLS */}
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Recent Transactions
        </h3>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Live Search Bar */}
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

          {/* Type Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expense Only</option>
          </select>

          {/* RBAC SIMULATION: Only Admins see the Add Button */}
          {role === "Admin" && (
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
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
              <th className="py-3 px-6 font-medium">Date</th>
              <th className="py-3 px-6 font-medium">Description</th>
              <th className="py-3 px-6 font-medium">Category</th>
              <th className="py-3 px-6 font-medium">Amount</th>
              {/* RBAC SIMULATION: Only Admins see the Actions column header */}
              {role === "Admin" && (
                <th className="py-3 px-6 font-medium text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
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
                  {/* RBAC SIMULATION: Only Admins see the Delete button */}
                  {role === "Admin" && (
                    <td className="py-4 px-6 text-sm text-right">
                      <button
                        className="text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Transaction"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              /* EMPTY STATE: What to show when search fails */
              <tr>
                <td
                  colSpan={role === "Admin" ? 5 : 4}
                  className="py-12 text-center text-gray-500"
                >
                  No transactions found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
