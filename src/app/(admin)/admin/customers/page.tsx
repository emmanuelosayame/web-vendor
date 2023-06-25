"use client";

import Alert from "@components/radix/Alert";
import Select from "@components/radix/Select";
import { useToastTrigger } from "@components/radix/Toast";
import {
  MenuFlex,
  TDivider,
  TFlex,
  THStack,
  TStack,
} from "@components/TElements";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { type ProductSort } from "src/server/zod";
import { api } from "@lib/api";
import useMediaQuery from "@lib/useMediaQuery";
import { limitText } from "@lib/helpers";
import { LoadingBlur } from "@components/Loading";

const selectList = [
  { item: "A - Z", value: "title-asc" },
  { item: "Z - A", value: "title-desc" },
  { item: "Search", value: "search" },
  { item: "Orders up", value: "orders-desc" },
  { item: "Orders down", value: "orders-asc" },
  { item: "Active Today", value: "active-t" },
  { item: "Active", value: "active-s" },
];

const Customers = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { trigger } = useToastTrigger();

  const mq = useMediaQuery("(min-width: 800px)");

  const [pagn, setPagn] = useState(1);

  const [sort, setSort] = useState<ProductSort>();

  const { data: customers, isLoading } = api.customer.many.useQuery({
    limit: 10,
  });

  const { data: count } = api.customer.count.useQuery(
    {},
    { placeholderData: 0 }
  );

  return (
    <>
      <MenuFlex>
        <Select
          defaultSelected="all"
          triggerStyles="bg-white rounded-lg min-w-[100px]"
          selectList={[
            { item: "All", value: "all" },
            { item: "Purchased", value: "purchased" },
          ]}
          onValueChange={() => {}}
        />

        <div className=" gap-2 hidden md:flex">
          <Select
            defaultSelected="title-asc"
            contentStyles="bg-white"
            triggerStyles="bg-white rounded-md"
            selectList={selectList}
            onValueChange={(value) => setSort(value as ProductSort)}
          />
          {sort === "search" ? (
            <div className="relative w-40">
              <MagnifyingGlassIcon
                className="absolute top-1/2 left-1 -translate-y-1/2"
                width={25}
              />
              <input
                className="outline-none py-1 pl-8 pr-2 rounded-md bg-white"
                placeholder="search customer"
              />
            </div>
          ) : null}
        </div>

        <Link
          href={"/admin/customers/new"}
          className="flex items-center bg-white rounded-lg px-3 py-1 hover:bg-opacity-75"
        >
          <p>New Customer</p>
          <PlusIcon width={20} />
        </Link>
      </MenuFlex>

      <div className="bg-white/40 md:rounded-lg w-full p-2 h-[90%]">
        <div className="flex flex-col relative justify-between bg-white w-full rounded-lg p-2 h-full">
          {isLoading && <LoadingBlur position="absolute" />}
          <table className="w-full border-spacing-2 border-separate text-[14px] md:text-base">
            {/* <TableCaption>Showing 10 of many</TableCaption> */}
            <thead className="">
              {mq ? (
                <tr className="text-center">
                  <td>Customer Name</td>
                  <td>Email</td>
                  <td>Phone No.</td>
                  <td>Type</td>
                  <td>Purchases</td>
                  <td>Option</td>
                </tr>
              ) : (
                <tr className="text-center">
                  <td>Name</td>
                  <td>Email</td>
                  <td>Opt</td>
                </tr>
              )}
            </thead>
            <TDivider className="w-full" />
            <tbody>
              {customers &&
                customers.map((customer) => (
                  <tr key={customer.id} className="text-center">
                    {mq ? (
                      <>
                        <td>
                          {limitText(
                            `${customer.firstName} ${customer.lastName}`,
                            20
                          )}
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.type}</td>
                        <td>{10}</td>
                        <td>
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="rounded-lg bg-blue-400 px-3 py-1 text-white hover:bg-blue-600"
                          >
                            view
                          </Link>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>
                          {limitText(
                            `${customer.firstName} ${customer.lastName}`,
                            8
                          )}
                        </td>
                        <td>{limitText(customer.email, 18)}</td>
                        <td className="flex items-center justify-center">
                          <Link
                            href={`/admin/customers/${customer.id}`}
                            className="rounded-md bg-neutral-50 p-1 drop-shadow-sm
                            flex items-center justify-center w-fit text-black hover:text-white hover:bg-blue-300"
                          >
                            <ChevronRightIcon width={20} />
                          </Link>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="">
            <TDivider />
            <TFlex className="justify-between p-2">
              <h3 className="px-2 text-neutral-700 text-lg">
                <span>{(pagn - 1) * 10}</span> to{" "}
                <span>{(pagn - 1) * 10 + (customers?.length || 0)}</span> of{" "}
                <span>{count}</span>
              </h3>

              <THStack>
                <button
                  className="bg-blue-400 rounded-xl p-1 text-white hover:bg-blue-600 disabled:opacity-50"
                  aria-label="prev"
                  disabled={pagn < 2}
                  onClick={() => {}}
                >
                  <ArrowLeftIcon stroke="white" width={20} />
                </button>
                <span
                  className={`${pagn > 1 ? "block" : "hidden"} w-6 text-center`}
                >
                  {pagn - 1}
                </span>
                <span className="bg-blue-600 bg-opacity-75 rounded-xl w-6 text-center">
                  {pagn}
                </span>
                <span className=" w-6 rounded-xl text-center">{pagn + 1}</span>
                <span
                  className={`${
                    pagn > 1 ? "hidden" : "block"
                  }  w-6 rounded-xl text-center`}
                >
                  {pagn + 2}
                </span>
                <button
                  className="bg-blue-400 rounded-xl p-1 text-white hover:bg-blue-500 disabled:opacity-50"
                  aria-label="next"
                  disabled={false}
                  onClick={() => {}}
                >
                  <ArrowRightIcon width={20} />
                </button>
              </THStack>
            </TFlex>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customers;
