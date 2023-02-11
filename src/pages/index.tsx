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
import { TFlex, THStack, TStack } from "@components/TElements";
import Layout from "@components/Layout";
import type { NextPageWithLayout } from "./_app";

const data = {
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
      <div className="grid grid-cols-2 gap-2 p-4 md:flex">
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
      <div className="h-5 w-full bg-white" />

      <div className="w-full overscroll-y-auto">
        <TFlex className="bg-white bg-opacity-60 ">
          <button
            className="flex h-8 items-center bg-white px-1
           text-base text-gray-500 drop-shadow-sm"
          >
            <span>Monthly</span>
            <ChevronDownIcon width={20} />
          </button>
        </TFlex>

        <div
          className="grid grid-cols-2 md:flex gap-2 md:gap-3 mt-10 flex-col items-center justify-between
         md:rounded-lg bg-white bg-opacity-60 p-2 md:p-3 md:flex-row"
        >
          <div className="h-full rounded-2xl bg-white p-3 w-full">
            <p className="text-center">Sales Statistics</p>
            <div className="h-40 md:h-96 w-full md:w-96">
              {data && <LineChart data={salesData} />}
            </div>
          </div>
          <div className="h-full rounded-2xl bg-white p-3 w-full">
            <p className="text-center">Items & Categories</p>
            <div className="h-40 md:h-96 w-full md:w-96">
              {data && <PieChart data={data} />}
            </div>
          </div>
          <div className="h-full rounded-2xl bg-white p-3 w-full">
            <p className="text-center">Product Sales</p>
            <div className="h-40 md:h-96 w-full md:w-96">
              {data && <PieChart data={data} />}
            </div>
          </div>
        </div>
        {/* <Box bgColor='white' p={3} px={5} m={4} h={1000} rounded='2xl' /> */}
      </div>
    </>
  );
};

export default Home;

Home.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
