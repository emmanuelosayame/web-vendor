"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { getBaseUrl } from "@lib/helpers";
import { api } from "@lib/api";
import superjson from "superjson";
import { SessionProvider, useSession } from "next-auth/react";
import { type Session } from "next-auth";
import Login from "@components/Login";
import { Loading } from "@components/Loading";

const RootClient = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            networkMode: "offlineFirst",
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  if (session === undefined) return <Loading />;

  return (
    <SessionProvider session={session}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {!session ? <Login /> : <> {children}</>}
        </QueryClientProvider>
      </api.Provider>
    </SessionProvider>
  );
};

// const Auth = ({ children }: { children: ReactNode }) => {
//   const status = useSession()?.status;
//   if (status === "loading") return <LoadingBlur />;
//   return <>{status !== "authenticated" ? <Login /> : { children }}</>;
// };

export default RootClient;
