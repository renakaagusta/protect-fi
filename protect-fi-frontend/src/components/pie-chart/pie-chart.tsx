// components/PieChart.tsx
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ClientWrapper from "../wrapper/client-wrapper";
import { useTheme } from 'next-themes';
import { BorderBeam } from "../ui/border-beam";

// Register required elements
ChartJS.register(ArcElement, Tooltip, Legend);

interface PoolData {
  label: string;
  value: number;
}

const PieChart = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevents hydration mismatch

  // Tentukan apakah mode gelap aktif
  const isDark = resolvedTheme === 'dark';

  // Definisikan warna untuk light dan dark mode
  const lightBackgroundColors1 = ["#4088EE", "#81C784"];
  const darkBackgroundColors1 = ["#90CAF9", "#A5D6A7"];

  const lightBackgroundColors2 = ["#4088EE", "#81C784", "#FFCA28", "#F44336"];
  const darkBackgroundColors2 = ["#90CAF9", "#A5D6A7", "#FFE082", "#EF9A9A"];

  // Data untuk "Start At Pools"
  const startAtPoolsDataArray: PoolData[] = [
    { label: "Policyholder", value: 600 },
    { label: "Insured", value: 200 },
  ];

  // Data untuk "Current At Pools"
  const currentAtPoolsDataArray: PoolData[] = [
    { label: "Policyholder", value: 600 },
    { label: "Insured 1", value: 100 },
    { label: "Insured 2", value: 50 },
    { label: "Insured 3", value: 50 },
  ];

  // Fungsi untuk menghitung total
  const calculateTotal = (data: PoolData[]) => {
    return data.reduce((acc, item) => acc + item.value, 0);
  };

  // Fungsi untuk menghitung persentase
  const calculatePercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(2);
  };

  const startAtPoolsTotal = calculateTotal(startAtPoolsDataArray);
  const currentAtPoolsTotal = calculateTotal(currentAtPoolsDataArray);

  // Data Chart untuk "Start At Pools"
  const startAtPoolsData = {
    labels: startAtPoolsDataArray.map(item => item.label),
    datasets: [
      {
        label: "Start At Pools",
        data: startAtPoolsDataArray.map(item => item.value),
        backgroundColor: isDark ? darkBackgroundColors1 : lightBackgroundColors1,
        borderColor: isDark ? '#2d3748' : '#fff',
        borderWidth: 1,
      },
    ],
  };

  // Data Chart untuk "Current At Pools"
  const currentAtPoolsData = {
    labels: currentAtPoolsDataArray.map(item => item.label),
    datasets: [
      {
        label: "Current At Pools",
        data: currentAtPoolsDataArray.map(item => item.value),
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
    <ClientWrapper>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        {/* Start At Pools */}
        <div className="relative overflow-hidden flex flex-col items-center bg-white dark:bg-background border p-6 rounded-lg shadow-md">
          <Pie data={startAtPoolsData} options={options} />
          <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Start At Pools</p>
          <BorderBeam size={200} duration={12} delay={9} />
        </div>

        {/* Current At Pools */}
        <div className="relative overflow-hidden flex flex-col items-center bg-white dark:bg-background border p-6 rounded-lg shadow-md">
          <Pie data={currentAtPoolsData} options={options} />
          <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Current At Pools</p>
          <BorderBeam size={200} duration={12} delay={9} />
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
        {/* Data Resume */}
        <div className="mt-4 w-full relative overflow-hidden p-4 rounded-lg border bg-background md:shadow-xl">
          {/* <div className="relative flex  w-full overflow-hidden rounded-lg border bg-background md:shadow-xl"> */}
          <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</h2>
          <ul className="space-y-1">
            {startAtPoolsDataArray.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{item.label}</span>
                <span>{item.value} ({calculatePercentage(item.value, startAtPoolsTotal)}%)</span>
              </li>
            ))}
            <li className="flex justify-between text-gray-800 dark:text-gray-200 font-semibold">
              <span>Total</span>
              <span>{startAtPoolsTotal}</span>
            </li>

            <BorderBeam size={100} duration={12} delay={9} />
          </ul>
          {/* </div> */}
          {/* Kesimpulan (Opsional) */}
          <div className="mt-4 w-full relative overflow-hidden p-4 rounded-lg border bg-background md:shadow-xl">
            <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Conclusion</h2>
            <p className="text-gray-600 dark:text-gray-400">
              The majority of the pools are held by Policyholders, indicating strong trust in our decentralized insurance platform.
            </p>
            <BorderBeam size={100} duration={12} delay={9} />
          </div>
        </div>

        {/* Data Resume */}
        <div className="mt-4 w-full relative overflow-hidden p-4 rounded-lg border bg-background md:shadow-xl">
          <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Summary</h2>
          <ul className="space-y-1">
            {currentAtPoolsDataArray.map((item, index) => (
              <li key={index} className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{item.label}</span>
                <span>{item.value} ({calculatePercentage(item.value, currentAtPoolsTotal)}%)</span>
              </li>
            ))}
            <li className="flex justify-between text-gray-800 dark:text-gray-200 font-semibold">
              <span>Total</span>
              <span>{currentAtPoolsTotal}</span>
            </li>
            <BorderBeam size={100} duration={12} delay={9} />
          </ul>
          {/* Kesimpulan (Opsional) */}
          <div className="mt-4 w-full relative overflow-hidden p-4 rounded-lg border bg-background md:shadow-xl">
            <h2 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">Conclusion</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Policyholders continue to hold the majority of pools, ensuring stability and trust in our current offerings.
            </p>
            <BorderBeam size={100} duration={12} delay={9} />
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
};

export default PieChart;
