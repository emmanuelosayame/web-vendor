"use client";
import Select from "@components/radix/Select";
import { MenuFlex } from "@components/TElements";
import { type NextPageWithLayout } from "t/shared";
import type { NType } from "@prisma/client";
import { api } from "@lib/api";
import { useState } from "react";
import NotificationComp from "@components/NotificationComp";

const Notifications: NextPageWithLayout = () => {
  const [ntype, setNtype] = useState<NType | "all">("all");

  const { data } = api.notification.many.useQuery({ ntype });

  return (
    <>
      <MenuFlex>
        <Select<NType | "all">
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
          triggerStyles="bg-white rounded-lg w-28 justify-between"
          onValueChange={() => {}}
          selectList={[
            { item: "Latest", value: "latest" },
            { item: "Orders", value: "orders" },
            { item: "Complaint", value: "complaint" },
            { item: "Support", value: "support" },
          ]}
        />
      </MenuFlex>
      <NotificationComp notifications={data} />
    </>
  );
};

export default Notifications;
