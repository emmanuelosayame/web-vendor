import Header from "@components/Header";
import type { ReactNode } from "react";
import { api } from "utils/api";
import { useStore } from "store";
import { csToStyle } from "utils/helpers";
import { Loading } from "@components/Loading";
import { useSession } from "next-auth/react";
import SelectStore from "../SelectStore";
import Login from "@components/Login";

const Layout = ({
  children,
  nopx = "sm",
}: {
  children: ReactNode;
  nopx?: "sm" | "lg" | "all";
}) => {
  const { data: auth, status } = useSession();
  const bg = csToStyle(useStore((state) => state.colorScheme)).bg;

  const {
    data: store,
    isLoading,
    refetch,
  } = api.store.one.useQuery({}, { enabled: !!auth?.user });

  if (status === "unauthenticated") return <Login />;
  if (status === "loading" || isLoading) return <Loading />;

  if (!store)
    return (
      <div
        className={`fixed inset-0 flex p-2 justify-center items-center ${bg}`}
      >
        <div className="w-full md:w-96 max-h-80">
          <SelectStore refetch={refetch} />
        </div>
      </div>
    );

  return (
    <div className="relative h-full ">
      <Header auth={auth} store={store} refetch={refetch} />
      <div
        className={`h-full ${bg} pt-28 md:pt-32 z-20 ${
          nopx === "sm"
            ? "md:px-3"
            : nopx === "lg"
            ? "px-3 md:px-0"
            : nopx === "all"
            ? ""
            : "px-3"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;
