import Layout from "@components/Layout";
import Select from "@components/radix/Select";
import { useToastTrigger } from "@components/radix/Toast";
import { MenuFlex } from "@components/TElements";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type ProductSort } from "src/server/schema";
import { api } from "utils/api";
import useMediaQuery from "utils/useMediaQuery";
import { useStore } from "store";
import ProductTemp from "@components/product/ProductsTemp";

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

  const { pagn, setPagn } = useStore((state) => ({
    pagn: state.product.pagn,
    setPagn: state.setPagn,
  }));

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

      <ProductTemp
        pagn={pagn}
        count={count}
        isLoading={isLoading}
        products={products}
        setPagn={setPagn}
        limit={limit}
      />
    </>
  );
};

Products.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Products;
