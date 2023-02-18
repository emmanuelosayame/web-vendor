import Layout from "@components/Layout";
import Select from "@components/radix/Select";
import { TDivider, TFlex, THStack } from "@components/TElements";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import { api } from "utils/api";
import { limitText } from "utils/helpers";
import useMediaQuery from "utils/useMediaQuery";
import { type NextPageWithLayout } from "../_app";

const selectList = [
  { item: "A - Z", value: "title-asc" },
  { item: "Z - A", value: "title-desc" },
  { item: "Search", value: "search" },
  { item: "Price up", value: "price-desc" },
  { item: "Price down", value: "price-asc" },
  { item: "Sold up", value: "sold-desc" },
  { item: "Sold down", value: "sold-asc" },
  { item: "Stock up", value: "stock-desc" },
  { item: "Stock down", value: "stock-asc" },
];

const Sales: NextPageWithLayout = () => {
  const mq = useMediaQuery("(min-width: 800px)");

  const [pagn, setPagn] = useState(1);

  const { data: products } = api.product.many.useQuery({ limit: 10 });
  const { data: count } = api.product.count.useQuery(
    {},
    { placeholderData: 0 }
  );

  return (
    <>
      <div className="flex items-center justify-between w-full p-3 md:pt-1 md:pb-3">
        <Select
          defaultSelected="all"
          triggerStyles="bg-white rounded-md w-32"
          contentStyles="bg-white"
          selectList={[
            { item: "All Sales", value: "all" },
            { item: "Successful", value: "successful" },
            { item: "Canceled", value: "cancelled" },
            { item: "Failed", value: "failed" },
          ]}
          onValueChange={() => {}}
        />

        <div className=" gap-2 hidden md:flex">
          {/* <Select
            defaultSelected="title-asc"
            contentStyles="bg-white"
            triggerStyles="bg-white rounded-md"
            selectList={selectList}
            onValueChange={(value) => {}}
          /> */}
          <div className="relative w-96 mx-auto mt-5">
            <ShoppingCartIcon
              width={25}
              className="absolute top-1/2 -translate-y-1/2 left-2 text-red-400"
            />
            <input
              placeholder="enter order id or txt ref"
              className="w-full bg-white rounded-lg py-2 pl-10 outline-none"
            />
          </div>
        </div>

        <Link
          href={"/products/new"}
          className="flex items-center bg-white rounded-lg px-3 py-1 hover:bg-opacity-75"
        >
          <p>New Product</p>
          <PlusIcon width={20} />
        </Link>
      </div>

      <div className=" bg-white/40 md:rounded-lg w-full p-2">
        <div className="flex flex-col justify-between bg-white w-full rounded-lg p-2 h-full">
          <table className="w-full border-spacing-2 border-separate text-[14px] md:text-base">
            {/* <TableCaption>Showing 10 of many</TableCaption> */}
            <thead className="">
              {mq ? (
                <tr className="text-center">
                  <td>Product Details</td>
                  <td>Category</td>
                  <td>Sku</td>
                  <td>Price</td>
                  <td>Stock</td>
                  <td>Sold</td>
                  <td>Option</td>
                </tr>
              ) : (
                <tr className="text-center">
                  <td>Details</td>
                  <td>Cat.</td>
                  <td>Price</td>
                  <td>Stk</td>
                  <td>Sold</td>
                  <td>Opt.</td>
                </tr>
              )}
            </thead>
            <TDivider className="w-full" />
            <tbody>
              {products &&
                products.map((product) => (
                  <tr key={product.id} className="text-center">
                    {mq ? (
                      <>
                        <td>{limitText(product.title, 20)}</td>
                        <td>{product.category}</td>
                        <td hidden={!mq}>{product.id.slice(19, 25)}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>{product.sold || 0}</td>
                        <td>
                          <Link
                            href={`/products/${product.id}`}
                            className="rounded-lg bg-blue-400 px-3 py-1 text-white hover:bg-blue-600"
                          >
                            edit
                          </Link>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{limitText(product.title, 12)}</td>
                        <td>{limitText(product.category, 10)}</td>
                        <td hidden={!mq}>{product.id.slice(19, 25)}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td>{product.sold || 0}</td>
                        <td className="flex items-center justify-center">
                          <Link
                            href={`/products/${product.id}`}
                            className="rounded-xl bg-neutral-100 p-1 drop-shadow-md
                            flex items-center justify-center w-fit text-blue-500 hover:bg-blue-600"
                          >
                            <PencilSquareIcon width={20} />
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
                <span>{(pagn - 1) * 10 + (products?.length || 0)}</span> of{" "}
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
Sales.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
export default Sales;
