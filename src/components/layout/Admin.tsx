"use client";

import Header from "@components/header/Admin";
import type { ReactNode } from "react";
import { useStore } from "store";
import { csToStyle } from "@lib/helpers";
import { Loading } from "@components/Loading";
import { useSession } from "next-auth/react";
import Login from "@components/Login";
import ErrorScreen from "@components/ErrorScreen";

const LayoutA = ({
  children,
  nopx = "sm",
}: {
  children: ReactNode;
  nopx?: "sm" | "lg" | "all";
}) => {
  const { data: auth, status } = useSession();

  const style = csToStyle(useStore((state) => state.colorScheme)).style;

  if (status === "unauthenticated") return <Login />;
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
