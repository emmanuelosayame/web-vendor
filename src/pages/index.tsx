import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../../utils/api";
import {
  BanknotesIcon,
  ChevronDownIcon,
  EyeIcon,
  PresentationChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { Card1 } from "../components/Card";
import { LineChart, PieChart } from "../components/Charts";
import { TFlex } from "@components/TElements";
import Layout from "@components/Layout";
import type { NextPageWithLayout } from "./_app";

const mockdata = {
  labels: [
    "Red",
    "Blue",
    "Yellow",
    "Green",
    "Purple",
    "Orange",
    "Green",
    "Purple",
  ],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 9, 3, 5, 20, 5, 30, 50],
      backgroundColor: [
        "rgba(255, 99, 132, 0.75)",
        "rgba(54, 162, 235, 0.75)",
        "rgba(255, 206, 86, 0.75)",
        "rgba(75, 192, 192, 0.75)",
        "rgba(153, 102, 255, 0.75)",
        "rgba(255, 159, 64, 0.75)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 0.85)",
        "rgba(54, 162, 235, 0.85)",
        "rgba(255, 206, 86, 0.85)",
        "rgba(75, 192, 192, 0.85)",
        "rgba(153, 102, 255, 0.85)",
        "rgba(255, 159, 64, 0.85)",
      ],
      borderWidth: 2,
      hoverOffset: 4,
    },
  ],
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 9, 3, 5, 20, 5, 30, 50],
      backgroundColor: [
        "rgba(255, 99, 132, 0.75)",
        "rgba(54, 162, 235, 0.75)",
        "rgba(255, 206, 86, 0.75)",
        "rgba(75, 192, 192, 0.75)",
        "rgba(153, 102, 255, 0.75)",
        "rgba(255, 159, 64, 0.75)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 0.85)",
        "rgba(54, 162, 235, 0.85)",
        "rgba(255, 206, 86, 0.85)",
        "rgba(75, 192, 192, 0.85)",
        "rgba(153, 102, 255, 0.85)",
        "rgba(255, 159, 64, 0.85)",
      ],
      borderWidth: 2,
      hoverOffset: 4,
    },
  ],
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const Home: NextPageWithLayout = () => {
  return (
    <>
      <div className="absolute inset-x-0 top-20 z-30 bg-blue-600">
        <div className="gap-2 px-2 py-2 md:p-4 flex overflow-x-auto md:justify-center">
          <Card1 text="customers" value="5k">
            <UserGroupIcon width={22} color="rgba(255.0, 204.0, 0.0, 0.7)" />
          </Card1>
          <Card1 text="visitors" value="8k">
            <EyeIcon width={22} color="rgba(90.0, 200.0, 250.0, 0.75)" />
          </Card1>
          <Card1 text="weekly sales" value="22k">
            <PresentationChartBarIcon
              width={22}
              color="rgba(175.0, 82.0, 222.0, 0.75)"
            />
          </Card1>
          <Card1 text="weekly income" value="N500k">
            <BanknotesIcon width={22} color="rgba(52.0, 199.0, 89.0, 0.7)" />
          </Card1>
        </div>

        <TFlex className="bg-white bg-opacity-60 ">
          <button
            className="flex h-7 items-center bg-white px-1
           text-base text-gray-500 drop-shadow-lg"
          >
            <span>Monthly</span>
            <ChevronDownIcon width={20} />
          </button>
        </TFlex>
      </div>

      <div className="w-full overflow-y-auto h-full pt-12 pb-2">
        <div
          className="flex flex-col gap-2 md:gap-3 mt-7 items-center justify-between
         md:rounded-lg bg-white/40 p-2 md:flex-row md:mx-2"
        >
          <div className="h-full rounded-2xl bg-white p-3 w-full">
            <p className="text-center">Sales Statistics</p>
            <div className="h-52 md:h-96 w-full md:w-96">
              {mockdata && <LineChart data={salesData} />}
            </div>
          </div>
          <div className="h-full rounded-2xl bg-white p-3 w-full">
            <p className="text-center">Items & Categories</p>
            <div className="h-52 md:h-96 w-full md:w-96">
              {mockdata && <PieChart data={mockdata} />}
            </div>
          </div>
          <div className="h-full rounded-2xl bg-white p-3 w-full">
            <p className="text-center">Product Sales</p>
            <div className="h-52 md:h-96 w-full md:w-96">
              {mockdata && <PieChart data={mockdata} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page) {
  return <Layout nopx="all">{page}</Layout>;
};
