import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart = ({ data, totalIncome }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(({ source, amount }) => ({
      name: source,
      amount,
    }));
  }, [data]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 days Income</h5>
      </div>

      {chartData.length === 0 ? (
        <p className="text-gray-500 text-sm mt-4">No income data to display.</p>
      ) : (
        <CustomPieChart
          data={chartData}
          label="Total Income"
          totalAmount={totalIncome.toLocaleString()}
          showTextAnchor
          colors={COLORS}
        />
      )}
    </div>
  );
};

RecentIncomeWithChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      source: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ),
  totalIncome: PropTypes.number,
};

RecentIncomeWithChart.defaultProps = {
  data: [],
  totalIncome: 0,
};

export default RecentIncomeWithChart;
