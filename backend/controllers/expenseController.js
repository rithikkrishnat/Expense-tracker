const User = require("../models/User");
const Expense = require("../models/Expense");
const xlsx = require("xlsx"); // ✅ Correct import for Excel

// ===================
// Add Expense
// ===================
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ===================
// Get All Expenses
// ===================
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ===================
// Delete Expense by ID
// ===================
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ===================
// Download Excel
// ===================
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });

    // ✅ FIX 1: You were using item.source, but there's no "source" in Expense. Use "category".
    const data = expenses.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date.toISOString().split("T")[0], // Format date as YYYY-MM-DD
    }));

    // ✅ FIX 2: You were using writeXLSX which is undefined. Use `xlsx` directly.
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Expenses");

    const filePath = "Expense_details.xlsx";
    xlsx.writeFile(wb, filePath);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
