import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Lightbulb } from "lucide-react";
import { TransactionContext } from "../context/TransactionContext";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const Overview = () => {
  // CRITICAL UPDATE: We pull 'displayedTransactions' and rename it to 'transactions' locally
  const {
    summary,
    displayedTransactions: transactions,
    isDarkMode,
  } = useContext(TransactionContext);

  const expenseData = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, curr) => {
      const existing = acc.find((item) => item.name === curr.category);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.category, value: curr.amount });
      }
      return acc;
    }, []);

  const timelineData = transactions.map((t) => ({
    date: t.date.split("-").slice(1).join("/"),
    amount: t.amount,
    type: t.type,
  }));

  const topExpense = [...expenseData].sort((a, b) => b.value - a.value)[0];
  const savingsRate =
    summary.income > 0
      ? ((summary.totalBalance / summary.income) * 100).toFixed(1)
      : 0;

  const chartTextColor = isDarkMode ? "#9ca3af" : "#6b7280";
  const gridColor = isDarkMode ? "#374151" : "#e5e7eb";

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-4 transition-all">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Total Balance
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              ${summary.totalBalance.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-4 transition-all">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Total Income
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              ${summary.income.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center space-x-4 transition-all">
          <div className="p-3 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 rounded-lg">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Total Expenses
            </p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              ${summary.expenses.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* KEY INSIGHTS */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-5 flex items-start space-x-4 shadow-sm transition-all">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg shrink-0 mt-0.5">
          <Lightbulb size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">
            AI Data Insights
          </h4>
          <ul className="text-sm text-indigo-800 dark:text-indigo-400 space-y-1">
            {topExpense && (
              <li>
                • Your highest spending category is{" "}
                <span className="font-semibold underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2">
                  {topExpense.name}
                </span>{" "}
                at <span className="font-semibold">${topExpense.value}</span>.
              </li>
            )}
            <li>
              • You are currently saving{" "}
              <span className="font-semibold underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-2">
                {savingsRate}%
              </span>{" "}
              of your total income.
            </li>
          </ul>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm lg:col-span-2 transition-all">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Cash Flow Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={gridColor}
                />
                <XAxis
                  dataKey="date"
                  stroke={chartTextColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke={chartTextColor}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    borderRadius: "8px",
                    border: "none",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Expenses by Category
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                    border: "none",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `$${value}`}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ color: chartTextColor }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
