import moment from "moment";

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};


export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};


export const prepareExpenseBarChartData = (data = []) => {
  const grouped = {};

  data.forEach(item => {
    if (item?.category && typeof item.amount === 'number') {
      grouped[item.category] = (grouped[item.category] || 0) + item.amount;
    }
  });

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
  }));
};




export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = sortedData.map((item) => ({
    month: item?.date ? moment(item.date).format('Do MMM') : 'Unknown',
    amount: item?.amount || 0,
    category: item?.category || 'Unknown',
  }));

  return chartData;
};
