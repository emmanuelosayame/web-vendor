import type { NextPage } from "next";
import { type AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { type Session } from "next-auth";

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout;
};

export type CSNames =
  | "montery"
  | "sierra"
  | "alice"
  | "greenade"
  | "purpleIsle"
  | "yellowmine";

export interface ColorScheme {
  name: CSNames;
  bg: string;
  color: string;
}

export interface ColorSchemeSlice {
  colorScheme: CSNames;
  setColorScheme: (name?: CSNames) => void;
}
