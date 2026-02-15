import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({
  data,
  label,
  totalAmount,
  colors,
  showTextAnchor,
}) => {
  // Defensive checks
  if (!Array.isArray(data) || !Array.isArray(colors)) {
    console.warn("CustomPieChart: Invalid props", { data, colors });
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={380}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colors[index % colors.length] || "#ccc"} // fallback color
            />
          ))}
        </Pie>
        <Tooltip content={CustomTooltip} />
        <Legend content={CustomLegend} />

        {showTextAnchor && (
          <g>
            <text
              x="50%"
              y="50%"
              dy={-10}
              textAnchor="middle"
              fill="#666"
              fontSize="14px"
            >
              {label}
            </text>
            <text
              x="50%"
              y="50%"
              dy={20}
              textAnchor="middle"
              fill="#333"
              fontSize="24px"
              fontWeight="600"
            >
              {totalAmount}
            </text>
          </g>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};

// Optional: default values for safety
CustomPieChart.defaultProps = {
  data: [],
  colors: ["#8884d8", "#82ca9d", "#ffc658"],
  totalAmount: "",
  label: "",
  showTextAnchor: false,
};

export default CustomPieChart;
