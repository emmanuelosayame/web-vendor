"use client";

import { type ReactNode, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { getBaseUrl } from "@lib/helpers";
import { api } from "@lib/api";
import superjson from "superjson";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { type Session } from "next-auth";
import { Loading } from "@components/Loading";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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

  return (
    <SessionProvider session={session}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <Auth>{children}</Auth>
        </QueryClientProvider>
      </api.Provider>
    </SessionProvider>
  );
};

const Auth = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const publicRoute = !!(pathname.split("/")[1] === "auth");

  const searchParams = useSearchParams();

  const status = useSession()?.status;

  useEffect(() => {
    if (pathname === "/auth/signin" || pathname === "/signin") return;
    if (status === "unauthenticated") {
      router.replace(
        `/auth/signin${
          !searchParams.get("redirect_url") && `?callbackUrl=${location.href}`
        }`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status === "authenticated" || publicRoute) return <>{children}</>;
  return <Loading />;
};

export default RootClient;
