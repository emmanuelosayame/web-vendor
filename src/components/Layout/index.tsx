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
  nopx = "sm",
}: {
  children: ReactNode;
  nopx?: "sm" | "lg" | "all";
}) => {
  const { data: auth, status } = useSession();
  const colorScheme = useStore((state) => state.colorScheme);
  const bg = csToStyle(colorScheme).bg;

  const { data: store, isLoading, refetch } = api.store.one.useQuery({});

  if (status === "loading" || isLoading) return <Loading />;

  if (!store) return <SelectStore refetch={refetch} />;

  return (
    <>
      <Header auth={auth} store={store} />
      <div
        className={`h-full bg-blue-600 ${
          nopx === "sm"
            ? "md:px-3"
            : nopx === "lg"
            ? "px-3 md:px-0"
            : nopx === "all"
            ? ""
            : "px-3"
        }`}
      >
        <div className="pt-20 pb-4 h-full">{children}</div>
      </div>
    </>
  );
};

export default Layout;
