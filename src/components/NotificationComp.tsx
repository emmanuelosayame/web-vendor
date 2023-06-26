import {
  ChevronLeftIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
} from "@heroicons/react/24/outline";
import type { Notification, NType } from "@prisma/client";
import { useState } from "react";
import { api } from "@lib/api";
import { dateLocale, timeLocale } from "@lib/helpers";
import { LoadingBlur } from "./Loading";

interface Props {
  notifications: Notification[] | undefined;
}

const NotificationComp = ({ notifications }: Props) => {
  const [active, setActive] = useState<string | undefined>();
  const activeN = notifications?.find((n) => active === n.id);

  return (
    <div className="h-[97%] bg-white/40 p-2 w-full rounded-lg">
      <div className="w-full rounded-lg flex gap-2 bg-white h-full overflow-y-auto py-2 px-3">
        <div
          className={`w-full ${
            notifications && notifications.length > 0
              ? "md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-2"
              : ""
          }  ${!!activeN ? "hidden md:grid" : ""}`}
        >
          {notifications && notifications.length > 0 ? (
            <>
              {notifications.map((n) => (
                <NContainer key={n.id} notification={n} setActive={setActive} />
              ))}
            </>
          ) : (
            <div className="flex justify-center items-center w-full h-full">
              <p className="text-lg text-center">No notification yet</p>
            </div>
          )}
        </div>

        <div className="border-r border-r-neutral-300 hidden md:block" />

        {notifications && notifications?.length > 0 && (
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
                  <p className="text-lg">{dateLocale(activeN.sent)}</p>
                  <p className="">{timeLocale(activeN.sent)}</p>
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
        )}
      </div>
    </div>
  );
};

interface ContainerProps {
  notification: Notification;
  setActive: (id: string) => void;
}

const NContainer = ({ notification, setActive }: ContainerProps) => {
  const opened = notification.status === "opened";

  const qc = api.useContext();

  const { mutateAsync, isLoading } = api.notification.open.useMutation({
    onSuccess: () => {
      qc.notification.many.refetch();
    },
  });

  return (
    <div
      className={`${
        opened
          ? "bg-neutral-50 border border-neutral-300 hover:bg-neutral-200 drop-shadow-sm"
          : "bg-neutral-200 border border-neutral-200 text-neutral-800 hover:bg-neutral-300 drop-shadow-sm"
      } rounded-lg cursor-pointer py-2 px-4 h-fit relative`}
      onClick={async () => {
        !opened && (await mutateAsync(notification.id));
        setActive(notification.id);
      }}
    >
      {isLoading && <LoadingBlur position="absolute" />}
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
        <p>{dateLocale(notification.sent)}</p>
        <p className="text-[12px]">{timeLocale(notification.sent)}</p>
      </div>
    </div>
  );
};

export default NotificationComp;
