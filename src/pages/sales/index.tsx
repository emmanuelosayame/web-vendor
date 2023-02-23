import Layout from "@components/Layout";
import Select from "@components/radix/Select";
import {
  IconButton,
  MenuFlex,
  TDivider,
  TFlex,
  THStack,
} from "@components/TElements";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  PlusIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import {
  Content,
  Overlay,
  Portal,
  Root,
  Trigger,
} from "@radix-ui/react-dialog";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";
import { api } from "utils/api";
import { limitText } from "utils/helpers";
import useMediaQuery from "utils/useMediaQuery";
import debounce from "lodash/debounce";
import { type NextPageWithLayout } from "../_app";
import { useRouter } from "next/router";
import { type Filter } from "src/server/routers/order";
import { LoadingBlur } from "@components/Loading";
import type { Order } from "@prisma/client";

const Sales: NextPageWithLayout = () => {
  const mq = useMediaQuery("(min-width: 800px)");
  const router = useRouter();

  const [pagn, setPagn] = useState(1);

  const [filter, setFilter] = useState<Filter>();

  const { data: sales } = api.order.many.useQuery({ limit: 10, filter });
  const { data: count } = api.order.count.useQuery({}, { placeholderData: 0 });

  const [orderId, setOrderId] = useState("");

  const { refetch, isFetching, data } = api.order.one.useQuery(
    { orderId },
    {
      enabled: false,
      onSuccess: (data) => {
        if (!data) {
        } else router.push(`/sales/${data.orderId}`);
      },
    }
  );

  return (
    <>
      {isFetching && <LoadingBlur />}
      <MenuFlex>
        <Select<Filter>
          defaultSelected="successful"
          triggerStyles="bg-white rounded-md w-32"
          contentStyles="bg-white"
          selectList={[
            { item: "All Sales", value: "all" },
            { item: "Successful", value: "successful" },
            { item: "Canceled", value: "cancelled" },
            { item: "Failed", value: "failed" },
          ]}
          onValueChange={setFilter}
        />

        <div className=" gap-2 hidden md:flex">
          <Select<any>
            defaultSelected="latest"
            contentStyles="bg-white"
            triggerStyles="bg-white rounded-md"
            selectList={[{ item: "Latest", value: "latest" }]}
            onValueChange={(value) => {}}
          />
          <LoadOrder setOrderId={setOrderId} refetch={refetch} data={data} />
        </div>

        <Link
          href={"/sales/new"}
          className="flex items-center bg-white rounded-md px-3 py-1 hover:bg-opacity-75"
        >
          <p>Add Sale</p>
          <PlusIcon width={20} />
        </Link>
      </MenuFlex>

      <div className="h-[95%] bg-white/40 md:rounded-lg w-full p-2">
        <div className="flex flex-col justify-between bg-white w-full rounded-lg p-2 h-full">
          <table className="w-full border-spacing-2 border-separate text-[14px] md:text-base">
            {/* <TableCaption>Showing 10 of many</TableCaption> */}
            <thead className="">
              {mq ? (
                <tr className="text-center">
                  <td>Order Id</td>
                  <td>Items</td>
                  <td>Customer</td>
                  <td>Location</td>
                  <td>Status</td>
                  <td>Shipping</td>
                  <td>Total</td>
                  <td>Pay</td>
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
              {sales &&
                sales.map((sale) => (
                  <tr key={sale.id} className="text-center">
                    {mq ? (
                      <>
                        <td>{sale.orderId}</td>
                        <td>{sale.items.length}</td>
                        <td>{`${
                          sale.shipping_details.firstName
                        } - ${sale.shipping_details.email.slice(
                          0,
                          sale.shipping_details.email.length - 7
                        )}...`}</td>
                        <td>{`${sale.shipping_details.state} - ${sale.shipping_details.location}`}</td>
                        <td>{sale.status}</td>
                        <td>{`${sale.shipping_option.type} - ${sale.shipping_option.price}`}</td>
                        <td>{sale.total}</td>
                        <td>{sale.payment.method || 0}</td>
                        <td>
                          <Link
                            href={`/sales/${sale.orderId}`}
                            className="rounded-lg bg-blue-400 px-3 py-1 text-white hover:bg-blue-600"
                          >
                            view
                          </Link>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{limitText(sale.orderId, 12)}</td>
                        <td>{sale.items.length}</td>
                        <td>{sale.id.slice(19, 25)}</td>
                        <td>{sale.shipping_option.type}</td>
                        <td>{sale.total}</td>
                        <td>{sale.payment.method || 0}</td>
                        <td className="flex items-center justify-center">
                          <Link
                            href={`/sales/${sale.id}`}
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
                <span>{(pagn - 1) * 10 + (sales?.length || 0)}</span> of{" "}
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

const LoadOrder = ({
  refetch,
  setOrderId,
  data,
}: {
  refetch: () => void;
  setOrderId: Dispatch<SetStateAction<string>>;
  data: Order | null | undefined;
}) => {
  return (
    <Root>
      <Trigger className="bg-white rounded-md py-1 px-3 hover:bg-opacity-70">
        Load Order
      </Trigger>
      <Portal>
        <Overlay className=" bg-gray-500 z-20 opacity-50 inset-0 fixed" />
        <Content
          className="fixed z-30 left-1/2 -translate-x-1/2 top-1/4 w-11/12 max-h-96 p-4
                 overflow-auto rounded-lg border-t
           border-gray-200 bg-white shadow-md shadow-gray-500 transition-all
            sm:my-8 sm:w-full sm:max-w-sm"
        >
          <div className="flex items-center gap-2">
            <div className="relative w-full mx-auto">
              <ShoppingCartIcon
                width={25}
                className="absolute top-1/2 -translate-y-1/2 left-2 text-red-400"
              />
              <input
                placeholder="enter order id or txt ref"
                className="w-full bg-white rounded-md py-2 pl-10 outline-none
                     ring-1 ring-neutral-300"
                onChange={debounce((e) => setOrderId(e.target.value), 600)}
              />
            </div>
            <button
              className="py-1 px-4 h-fit rounded-lg bg-green-400 hover:bg-green-500
                 text-white drop-shadow-md"
              onClick={() => refetch()}
            >
              Load
            </button>
          </div>
          {data === null && (
            <p className="text-center pt-2 text-neutral-600">
              No Order with that id
            </p>
          )}
        </Content>
      </Portal>
    </Root>
  );
};

Sales.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
export default Sales;
