import Header from "@components/Header/Admin";
import type { ReactNode } from "react";
import { api } from "utils/api";
import { useStore } from "store";
import { csToStyle } from "utils/helpers";
import { Loading } from "@components/Loading";
import { useSession } from "next-auth/react";
import Login from "@components/Login";

const LayoutA = ({
  children,
  nopx = "sm",
}: {
  children: ReactNode;
  nopx?: "sm" | "lg" | "all";
}) => {
  const { data: auth, status } = useSession();
  const colorScheme = useStore((state) => state.colorScheme);
  const bg = csToStyle(colorScheme).bg;

  if (status === "unauthenticated") return <Login />;
  if (status === "loading") return <Loading />;

  if (auth?.user.role !== "admin")
    return (
      <div
        className={`${bg} h-screen w-screen flex justify-center items-center`}
      >
        <div className="p-3 rounded-lg bg-neutral-100 text-neutral-500 text-center">
          <h3>Access Denied !</h3>
          <p className="text-sm">{"you probably aren't an admin"}</p>
        </div>
      </div>
    );

  return (
    <div className="relative h-full">
      <Header auth={auth} />
      <div
        className={`h-full ${bg} pt-32 ${
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

export default LayoutA;
