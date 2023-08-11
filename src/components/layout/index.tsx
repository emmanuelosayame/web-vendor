"use client";

import Header from "@components/header";
import type { ReactNode } from "react";
import { api } from "src/server/api";
import { useStore } from "store";
import { csToStyle } from "@lib/helpers";
import { Loading } from "@components/Loading";
import { useSession } from "next-auth/react";
import SelectStore from "../SelectStore";

const Layout = ({
  children,
  nopx = "sm",
}: {
  children: ReactNode;
  nopx?: "sm" | "lg" | "all";
}) => {
  const { data: auth, status } = useSession();
  const style = csToStyle(useStore((state) => state.colorScheme)).style;

  // console.log(auth);

  const {
    data: store,
    isLoading,
    refetch,
  } = api.store.one.useQuery({}, { enabled: !!auth?.user });

  // if (status === "unauthenticated") return <div>lll</div>;
  if (status === "loading" || isLoading) return <Loading />;

  if (!store)
    return (
      <div
        className={`fixed inset-0 flex p-2 justify-center items-center}`}
        style={style}
      >
        <div className="w-full md:w-96 max-h-80">
          <SelectStore refetch={refetch} />
        </div>
      </div>
    );

  return (
    <div
      className={`fixed inset-0 h-full pt-28 md:pt-32 z-20 ${
        nopx === "sm"
          ? "md:px-3"
          : nopx === "lg"
          ? "px-3 md:px-0"
          : nopx === "all"
          ? ""
          : "px-3"
      }`}
      style={style}
    >
      <Header auth={auth} store={store} refetch={refetch} />
      {children}
    </div>
  );
};

export default Layout;
