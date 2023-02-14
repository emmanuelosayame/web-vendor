import Layout from "@components/Layout";
import Alert from "@components/radix/Alert";
import Select from "@components/radix/Select";
import { useToastTrigger } from "@components/radix/Toast";
import {
  IconButton,
  TDivider,
  TFlex,
  THStack,
  TStack,
} from "@components/TElements";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type ProductSort } from "src/server/routers/product";
import { api } from "utils/api";
import useMediaQuery from "utils/useMediaQuery";
import { limitText } from "utils/helpers";

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

const Products = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { trigger } = useToastTrigger();

  const mq = useMediaQuery("(min-width: 800px)");

  const [sort, setSort] = useState<ProductSort>();

  const {
    data,
    fetchPreviousPage,
    fetchNextPage,
    hasPreviousPage,
    hasNextPage,
  } = api.product.many.useInfiniteQuery(
    { limit: 9, sort },
    {
      getPreviousPageParam: (lastPage) =>
        lastPage?.cursor.prevCursor && {
          id: lastPage?.cursor.prevCursor,
          direction: "asc",
        },
      getNextPageParam: (lastPage) =>
        lastPage?.cursor.nextCursor && {
          id: lastPage?.cursor.nextCursor,
          direction: "desc",
        },
    }
  );

  const { data: count } = api.product.count.useQuery(
    {},
    { placeholderData: 0 }
  );

  const pagn = data ? data?.pages?.length : 1;

  const products = data?.pages[pagn - 1]?.products;

  return (
    <>
      <div className="flex items-center justify-between w-full p-3 md:pt-1 md:pb-3">
        <Select
          defaultSelected="all"
          contentStyles=""
          triggerStyles="bg-white rounded-md"
          selectList={[{ item: "AllProducts", value: "all" }]}
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
                placeholder="search product"
              />
            </div>
          ) : null}
        </div>

        <Link
          href={"/products/new"}
          className="flex items-center bg-white rounded-lg px-3 py-1 hover:bg-opacity-75"
        >
          <p>New Product</p>
          <PlusIcon width={20} />
        </Link>
      </div>
      <div className=" bg-white bg-opacity-40 md:rounded-lg w-full p-2">
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
                  onClick={() => fetchPreviousPage()}
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
                  disabled={!hasNextPage}
                  onClick={() => fetchNextPage()}
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

Products.getLayout = function getLayout(page: any) {
  return <Layout nopx>{page}</Layout>;
};

export default Products;
