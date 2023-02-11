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
  PlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { api } from "utils/api";

const Products = () => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { trigger } = useToastTrigger();

  const [pagn, setPagn] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sort, setSort] = useState<string>();

  const { data } = api.product.many.useQuery({ limit: 9 });

  const { data: count } = api.product.count.useQuery(
    {},
    { placeholderData: 0 }
  );

  console.log(sort);

  return (
    <>
      <div className="flex items-center justify-between w-full mt-1 mb-3">
        <Select
          defaultSelected="all"
          contentStyles=""
          triggerStyles="bg-white rounded-md"
          selectList={[{ item: "AllProducts", value: "all" }]}
          onValueChange={() => {}}
        />

        <div className="flex gap-2">
          <Select
            defaultSelected="search"
            contentStyles=""
            triggerStyles="bg-white rounded-md"
            selectList={[
              { item: "A - Z", value: "a-z" },
              { item: "Search", value: "search" },
            ]}
            onValueChange={(value) => setSort(value)}
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
      <div className=" bg-white bg-opacity-40 rounded-lg w-full p-2 h-full">
        <div className="flex flex-col justify-between bg-white w-full rounded-lg p-2 h-full">
          <table className="w-full border-spacing-2 border-separate">
            {/* <TableCaption>Showing 10 of many</TableCaption> */}
            <thead>
              <tr className="border-b border-b-neutral-300 text-center">
                <td>Product Details</td>
                <td>Category</td>
                <td>Sku</td>
                <td>Price</td>
                <td>Stock</td>
                <td>Sold</td>
                <td>Option</td>
              </tr>
            </thead>
            <tbody>
              {data?.products &&
                data?.products.map((product) => (
                  <tr key={product.id} className="text-center">
                    <td>
                      <TFlex className="items-center">
                        <div className="my-1 bg-neutral-300 mx-2 rounded-xl" />
                        <h3 className="">
                          {product.title.slice(0, 20) +
                            (product.title.length > 20 ? "..." : "")}
                        </h3>
                      </TFlex>
                    </td>
                    <td>{product.category}</td>
                    <td>{product.id.slice(19, 25)}</td>
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
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="">
            <TDivider />
            <TFlex className="justify-between p-2">
              <h3 className="px-2 text-neutral-700 text-lg">
                <span>{(pagn - 1) * 10}</span> to{" "}
                <span>{(pagn - 1) * 10 + (data?.products?.length || 0)}</span>{" "}
                of <span>{count}</span>
              </h3>

              <THStack>
                <button
                  className="bg-blue-400 rounded-xl p-1 text-white hover:bg-blue-600 disabled:opacity-50"
                  aria-label="prev"
                  disabled={pagn < 2}
                  onClick={() => setPagn(pagn - 1)}
                >
                  <ArrowLeftIcon stroke="white" width={20} />
                </button>
                <button
                  className={`${pagn > 1 ? "block" : "hidden"}`}
                  onClick={() => setPagn(pagn - 1)}
                >
                  {pagn - 1}
                </button>
                <button className="bg-blue-400 bg-opacity-75 hover:bg-blue-500 rounded-xl w-6">
                  {pagn}
                </button>
                <button
                  className="hover:bg-blue-400 w-6 rounded-xl"
                  disabled={!hasMore}
                  onClick={() => setPagn(pagn + 1)}
                >
                  {pagn + 1}
                </button>
                <button
                  className={`${
                    pagn > 1 ? "hidden" : "block"
                  } hover:bg-blue-400 w-6 rounded-xl`}
                  onClick={() => setPagn(pagn + 2)}
                >
                  {pagn + 2}
                </button>
                <button
                  className="bg-blue-400 rounded-xl p-1 text-white hover:bg-blue-500 disabled:opacity-50"
                  aria-label="next"
                  disabled={!hasMore}
                  onClick={() => setPagn(pagn + 1)}
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
  return <Layout>{page}</Layout>;
};

export default Products;
