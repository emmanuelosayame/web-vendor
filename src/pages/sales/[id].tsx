import Layout from "@components/Layout";
import { IconBack, IconButton, MenuFlex, TFlex } from "@components/TElements";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { api } from "utils/api";
import { dateTimeLocale, limitText } from "utils/helpers";

const Sale = () => {
  const router = useRouter();
  const orderId = router.query?.id?.toString();

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

      <div className="bg-white/40 p-2 rounded-lg h-[95%]">
        <div className="bg-white rounded-lg p-2 h-full">
          <h3 className="text-xl text-center">Order Id: {data?.orderId}</h3>
          <div className=" w-11/12 mx-auto">
            <div className="w-full">
              <p>Items: {data?.items.length}</p>
              <div className="flex gap-3 ">
                {data?.items.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 ring-1 ring-neutral-200
                     rounded-lg w-52 h-64 flex flex-col"
                  >
                    <p className="leading-4 flex-1 pb-1">{item.title}</p>
                    <div>
                      <div className="bg-black/80 w-36 h-32 rounded-lg mx-auto" />
                    </div>
                    <p>Brand: {item.brand}</p>
                    <p>Price: {item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 md:flex gap-4">
              <div>
                <h3 className="border-b border-b-neutral-300">Order Info</h3>
                <p>Date: {dateTimeLocale(data?.dateTime || "")}</p>
                <p>SubTotal: {data?.subTotal}</p>
                <p>Total: {data?.total}</p>
              </div>

              <div>
                <h3 className="border-b border-b-neutral-300">Payment Info</h3>
                <p>Date: {dateTimeLocale(data?.payment.date || "")}</p>
                <p>Total: {data?.total}</p>
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

Sale.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Sale;
