import font from "next/font/local";
import RootClient from "./RootClient";
import "../styles/globals.css";
// import { cookies } from "next/headers";
import type { ReactNode } from "react";
// import { getServerSession } from "next-auth/next";

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

export const metadata = {
  title: "vendor@delorand",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // const session = await getServerSession();

  // const tokens = cookies().getAll();
  // console.log(session);

  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable}  font-spaceGrotesk `}>
        <RootClient session={null}>{children}</RootClient>
      </body>
    </html>
  );
}

export const dynamic = "force-static";
