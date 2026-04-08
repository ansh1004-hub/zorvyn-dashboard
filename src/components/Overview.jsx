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
  // Grab data directly from the Context Brain (No props needed!)
  const { summary, transactions } = useContext(TransactionContext);

  // Process data for the Expense Pie Chart
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

  // Process data for the Line Chart
  const timelineData = transactions.map((t) => ({
    date: t.date.split("-").slice(1).join("/"),
    amount: t.amount,
    type: t.type,
  }));

  // CALCULATE QUICK INSIGHTS
  const topExpense = [...expenseData].sort((a, b) => b.value - a.value)[0];
  const savingsRate =
    summary.income > 0
      ? ((summary.totalBalance / summary.income) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Balance</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${summary.totalBalance.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Income</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${summary.income.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Expenses</p>
            <h3 className="text-2xl font-bold text-gray-900">
              ${summary.expenses.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* KEY INSIGHTS BANNER */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 flex items-start space-x-4 shadow-sm">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0 mt-0.5">
          <Lightbulb size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-900 mb-1">
            AI Data Insights
          </h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            {topExpense && (
              <li>
                • Your highest spending category is{" "}
                <span className="font-semibold underline decoration-indigo-300 underline-offset-2">
                  {topExpense.name}
                </span>{" "}
                at <span className="font-semibold">${topExpense.value}</span>.
              </li>
            )}
            <li>
              • You are currently saving{" "}
              <span className="font-semibold underline decoration-indigo-300 underline-offset-2">
                {savingsRate}%
              </span>{" "}
              of your total income.
            </li>
          </ul>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Cash Flow Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e7eb"
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
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

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
