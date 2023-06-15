"use client";

import AlertDialog from "@components/radix/Alert";
import RadioGroup from "@components/radix/RadioGroup";
import {
  IconBack,
  IconButton,
  MenuFlex,
  TDivider,
  TFlex,
} from "@components/TElements";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { type OrderStatus } from "src/server/routers/order";
import { api } from "@lib/api";
import { dateTimeLocale, limitText } from "@lib/helpers";

const Sale = () => {
  const router = useRouter();
  const orderId = useParams()?.id?.toString();

  const { data } = api.order.one.useQuery({ orderId }, { enabled: !!orderId });

  return (
    <>
      <MenuFlex>
        <IconBack>Back</IconBack>
        <IconButton>
          <p>Edit</p>
          <PencilSquareIcon width={20} />
        </IconButton>
      </MenuFlex>

      <div className="bg-white/40 p-2 rounded-lg h-full md:h-[95%] overflow-y-auto w-full">
        <div className="bg-white rounded-lg p-2 ">
          <div className="flex flex-col md:flex-row items-center w-full justify-center gap-3">
            <h3 className="text-lg md:text-xl">{data?.orderId}</h3>
            <div
              className="border-b-2 md:border-r-2 rounded-xl border-r-neutral-300
             md:border-r-neutral-300 h-1 md:h-6 w-full md:w-1"
            />
            <p
              className={`text-xl ${
                data?.status === "cancelled" ? "text-red-400" : ""
              }`}
            >
              {data?.status}
            </p>
            <ChangeStatus orderId={orderId} />
          </div>
          <div className=" w-11/12 mx-auto">
            <div className="w-full">
              <p>Items: {data?.items.length}</p>
              <div className="flex gap-3 p-1 overflow-x-auto">
                {data?.items.map((item, index) => (
                  <div key={index}>
                    <div
                      className="p-3 ring-1 ring-neutral-200
                     rounded-lg w-52 h-56 flex flex-col text-sm"
                    >
                      <p className="leading-4 flex-1 pb-1">{item.title}</p>
                      <div>
                        <div className="bg-black/80 w-36 h-32 rounded-lg mx-auto" />
                      </div>
                      <p>Brand: {item.brand}</p>
                      <TFlex className="justify-between">
                        <p>Price: {item.price}</p>
                        <p>Qty: {item.quantity}</p>
                      </TFlex>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TDivider className="my-4" />

            <div className=" md:flex gap-4">
              <div>
                <h3 className="border-b border-b-neutral-300">Order Info</h3>
                <p>Date: {dateTimeLocale(data?.dateTime || "")}</p>
                <p>SubTotal: {data?.subTotal}</p>
                <p>Total: {data?.total}</p>
              </div>

              <div>
                <h3 className="border-b border-b-neutral-300">Payment Info</h3>
                <p>
                  Date:{" "}
                  {data?.payment.date
                    ? dateTimeLocale(data?.payment.date)
                    : "not paid"}
                </p>
                <p>Method: {data?.payment.method}</p>
              </div>

              <div>
                <h3 className="border-b border-b-neutral-300">Shipping Info</h3>
                <p>Option: {data?.shipping_option.type}</p>
                <p>Price: {data?.shipping_option.price}</p>
              </div>

              <div>
                <h3 className="border-b border-b-neutral-300">Customer Info</h3>
                <p>
                  Name:{" "}
                  {`${data?.shipping_details.firstName} ${data?.shipping_details.lastName}`}
                </p>
                <p>Email:{data?.shipping_details.email}</p>
                <p>Phone: {data?.shipping_details.phone}</p>
                <p>
                  Address: {data?.shipping_details.address}
                  {", "}
                  {data?.shipping_details.location}
                </p>
                <p>State: {data?.shipping_details.state}</p>
              </div>

              <div>
                <p>Note: {data?.shipping_details.notes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

interface CSProps {
  orderId?: string;
}

const ChangeStatus = ({ orderId }: CSProps) => {
  const [selected, setSelected] = useState<OrderStatus | undefined>();
  const qc = api.useContext();
  const { mutate } = api.order.update.useMutation({
    onSuccess: () => {
      qc.order.one.refetch();
    },
  });
  return (
    <AlertDialog
      title="Are you sure you want to change the order status?"
      action="Change"
      trigger="change status"
      triggerStyles="py-1 px-3 rounded-lg bg-blue-400 hover:bg-blue-500
             text-white drop-shadow-md"
      onClickConfirm={() => selected && mutate({ orderId, status: selected })}
    >
      <RadioGroup<OrderStatus>
        itemStyles="w-6 h-6"
        defaultValue="fulfilled"
        items={[
          { display: "Fulfilled", value: "fulfilled" },
          { display: "Successful", value: "successful" },
          { display: "Cancelled", value: "cancelled" },
        ]}
        onValueChange={(e) => setSelected(e)}
      />
    </AlertDialog>
  );
};

export default Sale;
