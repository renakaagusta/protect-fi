// components/PieChart.tsx
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from "chart.js";
import { useTheme } from 'next-themes';
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { formatTokenAmount } from "../../../utils/token";

// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

export interface PoolData {
  label: string;
  value: number;
}

const PieChart = ({projectionShares, currentPoolShares, symbol}: {projectionShares: PoolData[], currentPoolShares: PoolData[], symbol: string}) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  // Tentukan apakah mode gelap aktif
  const isDark = resolvedTheme === 'dark';

  // Definisikan warna untuk light dan dark mode
  const lightBackgroundColors1 = ["#112", "#113"];
  const darkBackgroundColors1 = ["#112", "#113"];

  const lightBackgroundColors2 = ["#112", "#114", "#4facfe", "#4facfe"];
  const darkBackgroundColors2 = ["#112", "#114", "#4facfe", "#4facfe"];

  // Fungsi untuk menghitung total
  const calculateTotal = (data: PoolData[]) => {
    return data.reduce((acc, item) => acc + item.value, 0);
  };

  // Fungsi untuk menghitung persentase
  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(2);
  };

  const startAtPoolsTotal = calculateTotal(projectionShares);
  const currentAtPoolsTotal = calculateTotal(currentPoolShares);

  // Data Chart untuk "Start At Pools"
  const startAtPoolsData = {
    labels: projectionShares.map(item => item.label),
    datasets: [
      {
        label: "Start At Pools",
        data: projectionShares.map(item => item.value),
        backgroundColor: isDark ? darkBackgroundColors1 : lightBackgroundColors1,
        borderColor: isDark ? '#2d3748' : '#fff',
        borderWidth: 1,
      },
    ],
  };

  // Data Chart untuk "Current At Pools"
  const currentAtPoolsData = {
    labels: currentPoolShares.map(item => item.label),
    datasets: [
      {
        label: "Current At Pools",
        data: currentPoolShares.map(item => item.value),
        backgroundColor: isDark ? darkBackgroundColors2 : lightBackgroundColors2,
        borderColor: isDark ? '#2d3748' : '#fff',
        borderWidth: 1,
      },
    ],
  };

  // Opsi chart yang disesuaikan
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: isDark ? '#e2e8f0' : '#4a5568',
        },
      },
      tooltip: {
        bodyColor: isDark ? '#e2e8f0' : '#4a5568',
        titleColor: isDark ? '#e2e8f0' : '#4a5568',
      },
    },
  };

  return (
      <div className="flex flex-row gap-8 pb-10">
        <div className="flex flex-col items-center">
          <Pie data={startAtPoolsData} options={options} />
          
          <div className="flex flex-col bg-white dark:bg-[#131313] p-3 rounded-lg shadow-md mt-5">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Projection policies</p>
            {/* Data Resume */}
            <div className="mt-4 w-full">
              <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</h2>
              <ul className="space-y-1">
                {projectionShares.map((item, index) => (
                  <li key={index} className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>{item.label}</span>
                    <span>{formatTokenAmount(item.value)} {symbol} ({calculatePercentage(item.value, startAtPoolsTotal)}%)</span>
                  </li>
                ))}
                <li className="flex justify-between text-gray-800 dark:text-gray-200 font-semibold">
                  <span>Total</span>
                  <span>{formatTokenAmount(startAtPoolsTotal)} {symbol}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 w-full">
              <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Conclusion</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The majority of the pools are held by Policyholders, indicating strong trust in our decentralized insurance platform.
              </p>
            </div>
          </div>
        </div>

        {/* Current At Pools */}
        <div className="flex flex-col items-center">
          <Pie data={currentAtPoolsData} options={options} />
          
          <div className="flex flex-col bg-white dark:bg-[#131313] p-3 rounded-lg shadow-md mt-5">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">Current policies</p>
            {/* Data Resume */}
            <div className="mt-4 w-full">
              <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</h2>
              <ul className="space-y-1">
                {currentPoolShares.map((item, index) => (
                  <li key={index} className="flex justify-between text-gray-600 dark:text-gray-400 gap-5">
                    <span className="truncate max-w-[15rem]">{item.label}</span>
                    <span>{formatTokenAmount(item.value)} {symbol} ({calculatePercentage(item.value, currentAtPoolsTotal)}%)</span>
                  </li>
                ))}
                <li className="flex justify-between text-gray-800 dark:text-gray-200 font-semibold">
                  <span>Total</span>
                  <span>{formatTokenAmount(currentAtPoolsTotal)} {symbol}</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 w-full">
              <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Conclusion</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The majority of the pools are held by Policyholders, indicating strong trust in our decentralized insurance platform.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default PieChart;
