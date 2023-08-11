"use client";
import Select from "@components/radix/Select";
import { MenuFlex } from "@components/TElements";
import type { NotificationType } from "@prisma/client";
import { api } from "src/server/api";
import { useState } from "react";
import NotificationComp from "@components/NotificationComp";
import { LoadingBlur } from "@components/Loading";

const Notifications = () => {
  const [ntype, setNtype] = useState<NotificationType | "all">("all");

  const { data, isLoading } = api.notification.many.useQuery({ ntype });

  return (
    <>
      {isLoading && <LoadingBlur />}
      <MenuFlex>
        <Select<NotificationType | "all">
          defaultSelected="all"
          contentStyles="bg-white"
          triggerStyles="bg-white rounded-lg w-32 justify-between"
          value={ntype}
          onValueChange={(e) => setNtype(e)}
          selectList={[
            { item: "All", value: "all" },
            { item: "Orders", value: "order" },
            { item: "Complaint", value: "complaint" },
            { item: "Support", value: "support" },
          ]}
        />

        {/* <h3 className=" inset-x-0 bg-white text-center text-xl rounded-lg px-3">
          Orders
        </h3> */}

        <Select
          defaultSelected="latest"
          contentStyles="bg-white"
          triggerStyles="bg-white rounded-lg min-w-28 justify-between"
          onValueChange={() => {}}
          selectList={[
            { item: "Latest", value: "latest" },
            { item: "Orders", value: "orders" },
            { item: "Complaint", value: "complaint" },
            { item: "Support", value: "support" },
          ]}
        />
      </MenuFlex>
      <NotificationComp notifications={(data || []) as any} />
    </>
  );
};

export default Notifications;
