import React, { useState, useContext, useEffect } from "react";
import {
  Search,
  Plus,
  Trash2,
  X,
  ArrowUpDown,
  Edit2,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { TransactionContext } from "../context/TransactionContext";
import toast from "react-hot-toast";

const Transactions = () => {
  // CRITICAL UPDATE: Pulling both raw 'transactions' and filtered 'displayedTransactions'
  const {
    transactions,
    displayedTransactions,
    setTransactions,
    editTransaction,
    role,
    isDarkMode,
  } = useContext(TransactionContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Modal & Edit State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    type: "Expense",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Filter Logic (Uses displayedTransactions now!)
  let processedTransactions = displayedTransactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // Reset pagination if user searches or filters
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // 2. Sort Logic
  processedTransactions.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key])
      return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key])
      return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(processedTransactions.length / itemsPerPage);
  const paginatedTransactions = processedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  // CSV EXPORT FUNCTION
  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount", "Type"];
    const csvData = processedTransactions.map(
      (t) =>
        `${t.date},"${t.description}","${t.category}",${t.amount},${t.type}`,
    );
    const csvContent = [headers.join(","), ...csvData].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "zorvyn_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV Exported Successfully!", {
      style: {
        background: isDarkMode ? "#374151" : "#fff",
        color: isDarkMode ? "#fff" : "#333",
      },
    });
  };

  // Form Submission
  const handleSaveTransaction = (e) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount) || 0 };

    if (editingId) {
      editTransaction({ id: editingId, ...payload });
      toast.success("Transaction Updated!", {
        style: {
          background: isDarkMode ? "#374151" : "#fff",
          color: isDarkMode ? "#fff" : "#333",
        },
      });
    } else {
      setTransactions([
        { id: Date.now().toString(), ...payload },
        ...transactions,
      ]);
      toast.success("Transaction Added!", {
        style: {
          background: isDarkMode ? "#374151" : "#fff",
          color: isDarkMode ? "#fff" : "#333",
        },
      });
    }

    closeModal();
  };

  const openEditModal = (transaction) => {
    setEditingId(transaction.id);
    setFormData({ ...transaction });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      date: "",
      description: "",
      category: "",
      amount: "",
      type: "Expense",
    });
  };

  const handleDelete = (idToDelete) => {
    setTransactions(transactions.filter((t) => t.id !== idToDelete));
    toast.error("Transaction Deleted", {
      style: {
        background: isDarkMode ? "#374151" : "#fff",
        color: isDarkMode ? "#fff" : "#333",
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden relative transition-colors duration-200">
      {/* HEADER CONTROLS */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Recent Transactions
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none w-full sm:w-48"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            <Download size={16} />{" "}
            <span className="hidden sm:inline">Export</span>
          </button>

          {role === "Admin" && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={16} /> <span>Add New</span>
            </button>
          )}
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => requestSort("date")}
              >
                <div className="flex items-center gap-1">
                  Date <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => requestSort("description")}
              >
                <div className="flex items-center gap-1">
                  Description{" "}
                  <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => requestSort("category")}
              >
                <div className="flex items-center gap-1">
                  Category <ArrowUpDown size={14} className="text-gray-400" />
                </div>
              </th>
              <th
                className="py-3 px-6 font-medium cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                    {t.date}
                  </td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-white">
                    {t.description}
                  </td>
                  <td className="py-4 px-6 text-sm">
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600">
                      {t.category}
                    </span>
                  </td>
                  <td
                    className={`py-4 px-6 text-sm font-semibold ${t.type === "Income" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"}`}
                  >
                    {t.type === "Income" ? "+" : "-"}$
                    {t.amount.toLocaleString()}
                  </td>
                  {role === "Admin" && (
                    <td className="py-4 px-6 text-sm text-right space-x-3">
                      <button
                        onClick={() => openEditModal(t)}
                        className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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
                  className="py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  No transactions found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, processedTransactions.length)}{" "}
            of {processedTransactions.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {editingId ? "Edit Transaction" : "Add Transaction"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                  {editingId ? "Update" : "Save"}
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
