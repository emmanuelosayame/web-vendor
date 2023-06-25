"use client";

import Header from "@components/header/Admin";
import { useEffect, type ReactNode } from "react";
import { useStore } from "store";
import { csToStyle } from "@lib/helpers";
import { Loading } from "@components/Loading";
import { useSession } from "next-auth/react";
import ErrorScreen from "@components/ErrorScreen";
import { useRouter } from "next/navigation";

const LayoutA = ({
  children,
  nopx = "sm",
}: {
  children: ReactNode;
  nopx?: "sm" | "lg" | "all";
}) => {
  const router = useRouter();
  const { data: auth, status } = useSession();

  const style = csToStyle(useStore((state) => state.colorScheme)).style;

  useEffect(() => {
    if (auth?.user.role !== "admin") router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.user.role]);

  if (status === "loading") return <Loading />;

  if (auth?.user.role !== "admin")
    return (
      <ErrorScreen description="you probably aren't an admin" style={style} />
    );

  return (
    <div className="relative h-full">
      <Header auth={auth} />
      <div
        className={`fixed inset-0 h-full pt-32 ${
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
        {children}
      </div>
    </div>
  );
};

export default LayoutA;
