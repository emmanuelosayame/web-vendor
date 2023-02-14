import Header from "@components/Header";
import type { ReactNode } from "react";
import { api } from "utils/api";
import { useStore } from "store";
import { csToStyle } from "utils/helpers";
import { Loading } from "@components/Loading";
import { useSession } from "next-auth/react";
import { TDivider } from "@components/TElements";
import { setCookie } from "cookies-next";
import SelectStore from "./SelectStore";

const Layout = ({
  children,
  nopx = false,
}: {
  children: ReactNode;
  nopx?: boolean;
}) => {
  const { data: auth, status } = useSession();
  const colorScheme = useStore((state) => state.colorScheme);
  const bg = csToStyle(colorScheme).bg;

  const { data: store, isLoading, refetch } = api.store.one.useQuery({});

  if (status === "loading" || isLoading) return <Loading />;

  if (!store) return <SelectStore refetch={refetch} />;

  return (
    <>
      <div className={`inset-0 h-full w-full bg-blue-600 `}>
        <div
          className={`flex relative w-full flex-col items-center overflow-y-auto
       bg-white bg-opacity-25 pt-20 h-screen pb-4 ${nopx ? "md:px-3" : "px-3"}`}
        >
          <Header auth={auth} store={store} />
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
