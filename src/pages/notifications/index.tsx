import Layout from "@components/Layout";
import Select from "@components/radix/Select";
import { EnvelopeIcon, EnvelopeOpenIcon } from "@heroicons/react/24/solid";
import { dateLocale, timeLocale } from "utils/helpers";
import { data } from "utils/mock";
import { type NextPageWithLayout } from "../_app";

const orders = data.filter((not) => not.type === "order");

const Notifications: NextPageWithLayout = () => {
  return (
    <>
      <div className="flex items-center justify-between w-full px-2 md:px-0 md:h-[10%] my-2">
        <Select
          defaultSelected="all"
          contentStyles="bg-white"
          triggerStyles="bg-white rounded-lg w-28 justify-between"
          onValueChange={() => {}}
          selectList={[
            { item: "All", value: "all" },
            { item: "Orders", value: "orders" },
            { item: "Complaint", value: "complaint" },
            { item: "Support", value: "support" },
          ]}
        />

        <Select
          defaultSelected="latest"
          contentStyles="bg-white"
          triggerStyles="bg-white rounded-lg w-28 justify-between"
          onValueChange={() => {}}
          selectList={[
            { item: "Latest", value: "latest" },
            { item: "Orders", value: "orders" },
            { item: "Complaint", value: "complaint" },
            { item: "Support", value: "support" },
          ]}
        />
      </div>

      <div className="h-[90%] bg-white/40 p-2 w-full rounded-lg">
        <div className="flex flex-col md:flex-row gap-2 h-full">
          {/* orders */}
          <div className="w-full relative rounded-lg bg-white px-2 py-2 h-full max-h-96 md:max-h-full">
            <h3 className="absolute inset-x-0 mx-2 bg-white text-center text-xl border-b border-b-neutral-300">
              Orders
            </h3>
            <div className="pt-10 space-y-1 h-full overflow-y-auto">
              {orders.map((notification) => {
                const opened = notification.status === "opened";
                return (
                  <div
                    key={notification.id}
                    className={`${
                      opened
                        ? "bg-neutral-50 ring-1 ring-neutral-300 hover:bg-neutral-300"
                        : "bg-blue-400 ring-1 ring-neutral-300 text-white hover:bg-blue-600"
                    } rounded-md cursor-pointer p-2`}
                  >
                    <div className="flex justify-between">
                      <p>{notification.title}</p>
                      <div>
                        {opened ? (
                          <EnvelopeOpenIcon
                            width={20}
                            className="text-neutral-400"
                          />
                        ) : (
                          <EnvelopeIcon width={20} className="white" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>{dateLocale(notification.on)}</p>
                      <p className="text-[12px]">
                        {timeLocale(notification.on)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="w-full relative rounded-lg bg-white px-2 h-full py-2 max-h-96 md:max-h-full">
            <h3 className="absolute inset-x-0 mx-2 bg-white text-center text-xl border-b border-b-neutral-300">
              Support/Complaints
            </h3>
            <div className="pt-10 space-y-1 h-full overflow-y-auto">
              {orders.map((notification) => {
                const opened = notification.status === "opened";
                return (
                  <div
                    key={notification.id}
                    className={`${
                      opened
                        ? "bg-neutral-50 ring-1 ring-neutral-300 hover:bg-neutral-300"
                        : "bg-blue-400 ring-1 ring-neutral-300 text-white hover:bg-blue-600"
                    } rounded-md cursor-pointer p-2`}
                  >
                    <div className="flex justify-between">
                      <p>{notification.title}</p>
                      <div>
                        {opened ? (
                          <EnvelopeOpenIcon
                            width={20}
                            className="text-neutral-400"
                          />
                        ) : (
                          <EnvelopeIcon width={20} className="white" />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>{dateLocale(notification.on)}</p>
                      <p className="text-[12px]">
                        {timeLocale(notification.on)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Notifications.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Notifications;
