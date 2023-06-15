import { SessionProvider, useSession } from "next-auth/react";
import { api } from "../../lib/api";
import font from "next/font/local";
import "../styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import Login from "@components/Login";
import { LoadingBlur } from "@components/Loading";
import type { AppPropsWithLayout } from "t/shared";

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

      <main
        className={` ${spaceGrotesk.variable} font-spaceGrotesk fixed inset-0`}
      >
        <SessionProvider session={session}>
          {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
      </main>
    </>
  );
};

const Auth = ({ children }: { children: ReactNode }) => {
  const status = useSession()?.status;
  if (status === "loading") return <LoadingBlur />;
  return <>{status !== "authenticated" ? <Login /> : { children }}</>;
};

export default api.withTRPC(MyApp);
