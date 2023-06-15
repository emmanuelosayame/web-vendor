import { getServerSession } from "next-auth";
import font from "next/font/local";
import RootClient from "./Client";
import { authOptions } from "src/server/auth";
import "../styles/globals.css";

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
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={` ${spaceGrotesk.variable} font-spaceGrotesk fixed inset-0`}
      >
        <RootClient session={session}>{children}</RootClient>
      </body>
    </html>
  );
}
