import {
  ChevronLeftIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";
import type { Notification, NType } from "@prisma/client";
import { useState } from "react";
import { api } from "utils/api";
import { dateLocale, timeLocale } from "utils/helpers";
import { data } from "utils/mock";

const orders = data.filter((not) => not.type === "order");

const NotificationComp = ({}: {}) => {
  const [active, setActive] = useState<string | undefined>();
  const activeN = orders.find((n) => active === n.id);

  return (
    <div className="h-[97%] bg-white/40 p-2 w-full rounded-lg">
      <div className="w-full rounded-lg flex gap-2 bg-white h-full overflow-y-auto py-2 px-3">
        <div
          className={`w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-2 ${
            !!activeN ? "hidden md:grid" : ""
          }`}
        >
          {orders.map((n) => (
            <NContainer key={n.id} notification={n} setActive={setActive} />
          ))}
        </div>

        <div
          className={`w-full md:w-1/2 py-3 px-2 md:px-6 md:block ${
            !!activeN ? "block" : "hidden"
          }`}
        >
          {activeN ? (
            <>
              <div className="flex justify-between">
                <button
                  className="md:hidden"
                  onClick={() => setActive(undefined)}
                >
                  <ChevronLeftIcon width={30} />
                </button>
                <p className="text-lg">{dateLocale(activeN.on)}</p>
                <p className="">{timeLocale(activeN.on)}</p>
              </div>
              <h3 className="text-center text-xl md:text-2xl">
                {activeN.title}
              </h3>
              <p>{activeN.body}</p>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-xl text-center text-neutral-500">
                Select notification to view
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  notification: Notification;
  setActive: (id: string) => void;
}

const NContainer = ({ notification, setActive }: Props) => {
  const opened = notification.status === "opened";

  return (
    <div
      className={`${
        opened
          ? "bg-neutral-50 border border-neutral-300 hover:bg-neutral-200 drop-shadow-sm"
          : "bg-neutral-200 border border-neutral-200 text-neutral-800 hover:bg-neutral-300 drop-shadow-sm"
      } rounded-lg cursor-pointer py-2 px-4`}
      onClick={() => setActive(notification.id)}
    >
      <div className="flex justify-between">
        <p>{notification.title}</p>
        <div>
          {opened ? (
            <EnvelopeOpenIcon width={20} className="text-neutral-400" />
          ) : (
            <EnvelopeIcon width={20} className="white" />
          )}
        </div>
      </div>
      <div className="flex justify-between text-sm">
        <p>{dateLocale(notification.on)}</p>
        <p className="text-[12px]">{timeLocale(notification.on)}</p>
      </div>
    </div>
  );
};

export default NotificationComp;
