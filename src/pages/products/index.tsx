import Layout from "@components/Layout";
import Alert from "@components/radix/Alert";
import Select from "@components/radix/Select";
import { useToastTrigger } from "@components/radix/Toast";
import {
  IconButton,
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
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type ProductSort } from "src/server/schema";
import { api } from "utils/api";
import useMediaQuery from "utils/useMediaQuery";
import { limitText } from "utils/helpers";
import { LoadingBlur } from "@components/Loading";

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

  const [pagn, setPagn] = useState(1);
  const limit = 10;

  const [sort, setSort] = useState<ProductSort>("title-asc");

  const { data: products, isLoading } = api.product.many.useQuery({
    limit,
    sort,
    pagn,
  });

  const { data: count } = api.product.count.useQuery(
    {},
    { placeholderData: 0 }
  );

  const { data: categories } = api.category.many.useQuery({ tid: 3 });

  const getCat = (id: string) =>
    categories?.find((cat) => id === cat.id)?.name || id;

  return (
    <>
      <MenuFlex>
        <Select
          // disabled
          defaultSelected="all"
          contentStyles="bg-white"
          triggerStyles="bg-white rounded-md h-fit"
          selectList={[
            { item: mq ? "All Products" : "All", value: "all" },
            { item: "Disabled", value: "disabled" },
            { item: "Incomplete", value: "incomplete" },
            { item: "In Review", value: "review" },
            { item: "Deals", value: "deal" },
          ]}
          onValueChange={() => {}}
        />

        <div className="gap-2 flex">
          <Select
            value={sort}
            contentStyles="bg-white"
            triggerStyles={`bg-white rounded-md ${
              sort === "search" ? "hidden md:flex" : ""
            }`}
            selectList={selectList}
            onValueChange={(value) => setSort(value as ProductSort)}
          />
          {sort === "search" ? (
            <div className="relative w-fit flex gap-2">
              <MagnifyingGlassIcon
                className="absolute top-1/2 left-1 -translate-y-1/2"
                width={25}
              />
              <input
                className="outline-none py-1 pl-8 pr-2 w-56 rounded-md bg-white"
                placeholder="search product"
              />
              <button
                className="md:hidden bg-neutral-100 py-1 px-3 rounded-lg"
                onClick={() => setSort("title-asc")}
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        <Link
          href={"/products/new"}
          className="flex items-center bg-white rounded-lg px-3 py-1 hover:bg-opacity-75 h-fit"
        >
          <p>{mq ? "New Product" : "New"}</p>
          <PlusIcon width={20} />
        </Link>
      </MenuFlex>

      <div className="overflow-y-auto h-full pb-2">
        <div className="bg-white/40 md:rounded-lg w-full p-2 md:h-[95%]">
          <div className="flex flex-col relative justify-between bg-white w-full rounded-lg p-2 h-full">
            {isLoading && <LoadingBlur position="absolute" />}
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
                    <td>Stk</td>
                    <td>Sold</td>
                    <td>Opt.</td>
                  </tr>
                )}
              </thead>
              <tbody>
                {products &&
                  products.map((product) => (
                    <tr key={product.id} className="text-center">
                      {mq ? (
                        <>
                          <td>{limitText(product.title, 20)}</td>
                          <td>{getCat(product.category)}</td>
                          <td hidden={!mq}>{product.id.slice(19, 25)}</td>
                          <td>{product.price}</td>
                          <td>{product.stock}</td>
                          <td>{product.sold || 0}</td>
                          <td>
                            <Link
                              href={`/products/${product.id}`}
                              className="rounded-lg bg-blue-400 px-3 py-1 text-white hover:bg-blue-600"
                            >
                              view
                            </Link>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{limitText(product.title, 12)}</td>
                          <td>{limitText(product.category, 8)}</td>
                          <td hidden={!mq}>{product.id.slice(19, 25)}</td>
                          <td>{product.stock}</td>
                          <td>{product.sold || 0}</td>
                          <td className="flex items-center justify-center">
                            <Link
                              href={`/products/${product.id}`}
                              className="drop-shadow-md
                            flex items-center justify-center w-fit"
                            >
                              <ChevronRightIcon width={25} />
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
                    onClick={() => {
                      setPagn((state) => state - 1);
                    }}
                  >
                    <ArrowLeftIcon stroke="white" width={20} />
                  </button>
                  <span
                    className={`${
                      pagn > 1 ? "block" : "hidden"
                    } w-6 text-center`}
                  >
                    {pagn - 1}
                  </span>
                  <span className="bg-blue-600 bg-opacity-75 rounded-xl w-6 text-center text-white">
                    {pagn}
                  </span>
                  <span className=" w-6 rounded-xl text-center">
                    {pagn + 1}
                  </span>
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
                    disabled={products && products?.length < limit}
                    onClick={() => {
                      setPagn((state) => state + 1);
                    }}
                  >
                    <ArrowRightIcon width={20} />
                  </button>
                </THStack>
              </TFlex>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Products.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Products;
