const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");

// ===================
// Get Dashboard Data
// ===================
exports.getDashboardData = async (req, res) => {
  try {
    // 1️⃣ Get the logged-in user's ID (set by your auth middleware)
    const userId = req.user.id;

    // 2️⃣ Convert the string ID to a Mongoose ObjectId
    const userObjectId = new Types.ObjectId(String(userId));

    // 3️⃣ Calculate total income (aggregates all amounts)
    const totalIncomeArr = await Income.aggregate([
      { $match: { userId: userObjectId } },              // Filter by this user
      { $group: { _id: null, total: { $sum: "$amount" } } } // Sum the "amount" field
    ]);
    const totalIncome = totalIncomeArr[0]?.total || 0;    // Use 0 if no records

    // 4️⃣ Calculate total expenses
    const totalExpenseArr = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalExpense = totalExpenseArr[0]?.total || 0;

    // 5️⃣ Last 60 days income transactions
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
    const last60IncomeTxns = await Income.find({
      userId,
      date: { $gte: sixtyDaysAgo }
    }).sort({ date: -1 });

    // 6️⃣ Sum those 60-day income transactions
    const incomeLast60Days = last60IncomeTxns.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    // 7️⃣ Last 30 days expense transactions
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const last30ExpenseTxns = await Expense.find({
      userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: -1 });

    // 8️⃣ Sum those 30-day expense transactions
    const expensesLast30Days = last30ExpenseTxns.reduce(
      (sum, txn) => sum + txn.amount,
      0
    );

    // 9️⃣ Fetch the most recent 5 income and 5 expense records
    const recentIncome = await Income.find({ userId })
      .sort({ date: -1 })
      .limit(5);
    const recentExpense = await Expense.find({ userId })
      .sort({ date: -1 })
      .limit(5);

    // 🔟 Combine and tag them, then sort by date (newest first)
    const recentTransactions = [
      ...recentIncome.map(txn => ({ ...txn.toObject(), type: "income" })),
      ...recentExpense.map(txn => ({ ...txn.toObject(), type: "expense" })),
    ].sort((a, b) => b.date - a.date);

    // 1️⃣1️⃣ Send back all dashboard data in one JSON object
    return res.json({
      totalBalance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      last30DaysExpenses: {
        total: expensesLast30Days,
        transactions: last30ExpenseTxns
      },
      last60DaysIncome: {
        total: incomeLast60Days,
        transactions: last60IncomeTxns
      },
      recentTransactions
    });
  } catch (error) {
    // 1️⃣2️⃣ If anything fails, catch it and send a 500 error
    console.error(error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
