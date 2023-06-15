"use client";

import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { getBaseUrl } from "@lib/helpers";
import { trpc } from "@lib/api";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

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
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    })
  );

  return (
    <SessionProvider session={session}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </trpc.Provider>
    </SessionProvider>
  );
};

export default RootClient;
