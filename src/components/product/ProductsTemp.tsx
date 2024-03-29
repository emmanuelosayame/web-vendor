"use client";

import { LoadingBlur } from "@components/Loading";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { Product } from "@prisma/client";
import Link from "next/link";
import { api } from "src/server/api";
import { limitText } from "@lib/helpers";
import useMediaQuery from "@lib/useMediaQuery";

interface Props {
  products: Product[] | undefined;
  isLoading: boolean;
  pagn: number;
  prev: () => void;
  next: () => void;
  count: number | undefined;
  limit: number;
}

const ProductTemp = ({
  isLoading,
  products,
  pagn,
  count,
  limit,
  prev,
  next,
}: Props) => {
  const mq = useMediaQuery("(min-width: 800px)");

  // const { data: categories } = api.category.many.useQuery({ tid: 3 });

  // const getCat = (id: string) =>
  //   categories?.find((cat) => id === cat.id)?.name || id;

  return (
    <div className="overflow-y-auto h-full pb-2">
      <div className="bg-white/40 md:rounded-lg w-full p-2 md:h-[95%]">
        <div className="flex flex-col relative justify-between bg-white w-full rounded-lg p-2 h-full">
          {isLoading && <LoadingBlur position="absolute" />}
          <table className="w-full border-spacing-2 md:border-spacing-4 border-separate text-[14px] md:text-base">
            {/* <TableCaption>Showing 10 of many</TableCaption> */}
            <thead className="">
              {mq ? (
                <tr className="text-center">
                  <td>Product Details</td>
                  {/* <td>Category</td> */}
                  <td>Sku</td>
                  <td>Price</td>
                  <td>Stock</td>
                  <td>Sold</td>
                  <td>Option</td>
                </tr>
              ) : (
                <tr className="text-center">
                  <td>Details</td>
                  {/* <td>Cat.</td> */}
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
                        {/* <td>{getCat(product.category)}</td> */}
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
                        {/* <td>{limitText(getCat(product.category), 8)}</td> */}
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
            <div className="border-b" />
            <div className="flex justify-between p-2">
              <h3 className="px-2 text-neutral-700 text-lg">
                <span>{(pagn - 1) * 10}</span> to{" "}
                <span>{(pagn - 1) * 10 + (products?.length || 0)}</span> of{" "}
                <span>{count}</span>
              </h3>

              <div className="flex gap-3 items-center">
                <button
                  className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                  aria-label="prev"
                  disabled={pagn < 2}
                  onClick={prev}
                >
                  Prev
                </button>
                <p>{pagn}</p>
                <button
                  className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                  aria-label="next"
                  disabled={products && products?.length < limit}
                  onClick={next}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTemp;
