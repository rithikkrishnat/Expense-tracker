const User = require("../models/User");
const Income = require("../models/Income");
const xlsx = require('xlsx');

// ===================
// Add Income source
// ===================
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


// ===================
// get all income source
// ===================
exports.getAllIncome = async (req, res) => {
    const userId = req.user.id;

    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        res.json(income);
    } catch (error) {
        res.status(500).json({ message: "Server Error"});
    }
};
// ===================
// delete Income source
// ===================
exports.deleteIncome = async (req, res) => {


    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted succesfully"});
    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};

//download excel
// ===================
exports.downloadIncomeExcel = async (req, res) => {
    const userId = req.user.id;
    try{
        const income = await Income.find({ userId}).sort({date:-1});
        //prepare data for excel
        const data = income.map((item) => ({
            Source: item.source,
            Amount : item.amount,
            Date: item.date,
        }));
        const wb = writeXLSX.utils.book_new();
        const ws = writeXLSX.utils.json_to_sheet(data);
        writeXLSX.writeFile(wb,'income_details.xlsx');
        res.download('income_details.xlsx');

    } catch (error) {
        res.status(500).json({message: "Server Error"});
    }
};