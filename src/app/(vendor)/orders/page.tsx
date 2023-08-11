"use client";
import Select from "@components/radix/Select";
import { MenuFlex } from "@components/TElements";
import {
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
import { api } from "src/server/api";
import { limitText } from "@lib/helpers";
import useMediaQuery from "@lib/useMediaQuery";
import debounce from "lodash/debounce";
import { LoadingBlur } from "@components/Loading";
import { useRouter } from "next/navigation";
import TableFooter from "@components/TableFooter";
import type { OrderStatusSC, OrderStatusS } from "src/server/zod";

const Orders = () => {
  const mq = useMediaQuery("(min-width: 800px)");

  const [filter, setFilter] = useState<OrderStatusSC>();

  const { data: orders, isFetching } = api.order.many.useQuery({
    limit: 15,
    filter,
  });
  const { data: count } = api.order.count.useQuery({}, { placeholderData: 0 });

  return (
    <>
      {isFetching && <LoadingBlur />}
      <MenuFlex>
        <Select<OrderStatusSC>
          defaultSelected="pay_successful"
          triggerStyles="bg-white rounded-md w-fit min-w-[130px]"
          contentStyles="bg-white"
          selectList={[
            { item: "All Orders", value: "all" },
            { item: "Paid", value: "pay_successful" },
            { item: "Pay Cancelled", value: "pay_cancelled" },
            { item: "Pay Failed", value: "pay_failed" },
            { item: "Delivered", value: "delivered" },
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
          <LoadOrder />
        </div>

        <Link
          href={"/orders/new"}
          className="flex items-center bg-white rounded-md px-3 py-1 hover:bg-opacity-75"
        >
          <p>Add order</p>
          <PlusIcon width={20} />
        </Link>
      </MenuFlex>

      <div className="h-[95%] bg-white/40 md:rounded-lg w-full p-2">
        <div className="flex flex-col justify-between bg-white w-full rounded-lg p-2 h-full">
          {!orders || orders.length < 1 ? (
            <div className="w-full h-full flex justify-center items-center text-neutral-600 text-lg">
              Empty
            </div>
          ) : (
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
              <tbody>
                {orders &&
                  orders.map((order) => (
                    <tr key={order.id} className="text-center">
                      {mq ? (
                        <>
                          <td>{order.orderId}</td>
                          <td>{order.items.length}</td>
                          <td>{`${
                            order.shipping_details.firstName
                          } - ${order.shipping_details.email.slice(
                            0,
                            order.shipping_details.email.length - 7
                          )}...`}</td>
                          <td>{`${order.shipping_details.state} - ${order.shipping_details.location}`}</td>
                          <td>{order.status}</td>
                          <td>{`${order.shipping_option.type} - ${order.shipping_option.price}`}</td>
                          <td>{order.total}</td>
                          <td>{order.payment.method || 0}</td>
                          <td>
                            <Link
                              href={`/orders/${order.orderId}`}
                              className=" text-blue-700 hover:opacity-60"
                            >
                              view
                            </Link>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{limitText(order.orderId, 12)}</td>
                          <td>{order.items.length}</td>
                          <td>{order.id.slice(19, 25)}</td>
                          <td>{order.shipping_option.type}</td>
                          <td>{order.total}</td>
                          <td>{order.payment.method || 0}</td>
                          <td className="flex items-center justify-center">
                            <Link
                              href={`/orders/${order.id}`}
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
          )}

          <TableFooter dataLength={orders?.length} limit={15} total={count} />
        </div>
      </div>
    </>
  );
};

const LoadOrder = () => {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  const { refetch, isFetching, data } = api.order.one.useQuery(
    { orderId },
    {
      enabled: false,
      onSuccess: (data) => {
        if (!data) {
        } else router.push(`/orders/${data.orderId}`);
      },
    }
  );
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
              disabled={!(orderId.length > 20)}
              className="btn-green w-24"
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

export default Orders;
