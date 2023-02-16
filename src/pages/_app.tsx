import type { AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { api } from "../../utils/api";
import font from "@next/font/local";

import "../styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import Login from "@components/Login";
import { LoadingBlur } from "@components/Loading";

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

const spaceGrotesk = font({
  src: [
    {
      path: "../../public/fonts/SpaceGrotesk-Regular.ttf",
      style: "normal",
      weight: "500",
    },
  ],
  variable: "--font-spaceGrotesk",
});

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page: ReactElement) => page);
  return (
    <>
      <style jsx global>
        {`
          html {
            font-family: ${spaceGrotesk.style.fontFamily};
          }
        `}
      </style>

      <main className={` ${spaceGrotesk.variable} font-spaceGrotesk h-screen`}>
        <SessionProvider session={session}>
          <Auth page={getLayout(<Component {...pageProps} />)} />
        </SessionProvider>
      </main>
    </>
  );
};

const Auth = ({ page }: { page: ReactNode }) => {
  const status = useSession()?.status;
  if (status === "loading") return <LoadingBlur />;
  return <>{status !== "authenticated" ? <Login /> : <>{page}</>}</>;
};

export default api.withTRPC(MyApp);
