import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import {
  Chart as Chartjs,
  BarElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

Chartjs.register(
  BarElement,
  LinearScale,
  CategoryScale,
  ArcElement,
  PointElement,
  LineElement
);

const options = {
  maintainAspectRatio: false,
  // animation: false,
  legend: {
    labels: {
      fontSize: 10,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

export const LineChart = ({ data }: { data: any }) => {
  return <Line data={data} options={options} />;
};

export const PieChart = ({ data }: { data: any }) => {
  return <Doughnut data={data} options={options} />;
};
