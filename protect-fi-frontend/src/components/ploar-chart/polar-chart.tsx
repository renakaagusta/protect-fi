import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import ClientWrapper from "../wrapper/client-wrapper";

// Dynamically import ReactApexChart to prevent SSR issues
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const PieChart = () => {
  // Define Start At Pools Options
  const startAtPoolsOptions: ApexOptions = {
    chart: {
      type: 'pie',
      toolbar: {
        show: false,
      },
    },
    labels: ["Policyholder", "Insured"],
    colors: ["#4088EE", "#81C784"],
    responsive: [
      {
        breakpoint: 768, // md breakpoint
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    legend: {
      position: 'right',
      labels: {
        colors: '#6B7280', // Tailwind's gray-500
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
    },
  };

  const startAtPoolsSeries: number[] = [600, 200];

  // Define Current At Pools Options
  const currentAtPoolsOptions: ApexOptions = {
    chart: {
      type: 'pie',
      toolbar: {
        show: false,
      },
    },
    labels: ["Policyholder", "Insured 1", "Insured 2", "Insured 3"],
    colors: ["#4088EE", "#81C784", "#FFCA28", "#F44336"],
    responsive: [
      {
        breakpoint: 768, // md breakpoint
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    legend: {
      position: 'right',
      labels: {
        colors: '#6B7280', // Tailwind's gray-500
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#fff'],
      },
    },
  };

  const currentAtPoolsSeries: number[] = [600, 100, 50, 50];

  return (
    <ClientWrapper>
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-10">
        {/* Start At Pools */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <ReactApexChart
            options={startAtPoolsOptions}
            series={startAtPoolsSeries}
            type="pie"
            width="100%"
          />
          <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Start At Pools</p>
        </div>

        {/* Current At Pools */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <ReactApexChart
            options={currentAtPoolsOptions}
            series={currentAtPoolsSeries}
            type="pie"
            width="100%"
          />
          <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Current At Pools</p>
        </div>
      </div>
    </ClientWrapper>
  );
};

export default PieChart;
