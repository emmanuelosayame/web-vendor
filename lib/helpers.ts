import { Store } from "@prisma/client";
import { type CSSProperties } from "react";
import type { CSNames } from "t/shared";

export const limitText = (sentence?: string | null, limit?: number) =>
  limit
    ? sentence && sentence.length > limit
      ? sentence.slice(0, limit) + "..."
      : sentence
    : sentence;

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

interface CSStyles {
  bg: string;
  text: string;
  style?: CSSProperties;
  textStyle?: CSSProperties;
}

export const csToStyle: (colorScheme: CSNames, hover?: boolean) => CSStyles = (
  colorScheme,
  hover = false
) => {
  switch (colorScheme) {
    case "alice":
      return {
        bg: `bg-blue-500 ${hover ? "hover:bg-blue-600" : ""}`,
        text: "text-amber-500",
        style: {
          background: `linear-gradient(135deg,  #8BC6EC 0%,#9599E2 100%)`,
        },
        textStyle: { color: "lightblue" },
      };
    case "greenade":
      return {
        bg: `bg-green-400 ${hover ? "hover:bg-green-600" : ""}`,
        text: "text-green-500",
        style: {
          background: `linear-gradient(45deg,  #85FFBD 0%,#FFFB7D 100%)`,
        },
        textStyle: { color: "green" },
      };
    case "purpleIsle":
      return {
        bg: `bg-green-400 ${hover ? "hover:bg-green-600" : ""}`,
        text: "text-green-500",
        style: {
          background: `linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)`,
        },
        textStyle: { color: "purple" },
      };
    case "sierra":
      return {
        bg: `bg-green-400 ${hover ? "hover:bg-green-600" : ""}`,
        text: "text-green-500",
        style: {
          background: `linear-gradient(180deg, #A9C9FF 0%, #FFBBEC 100%)`,
        },
        textStyle: { color: "blue" },
      };
    case "montery":
      return {
        bg: `bg-red-400 ${hover ? "hover:bg-red-500" : ""}`,
        text: "text-red-300",
        style: {
          background: `linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)`,
        },
        textStyle: { color: "crimson" },
      };
    case "yellowmine":
      return {
        bg: `bg-red-400 ${hover ? "hover:bg-red-500" : ""}`,
        text: "text-red-300",
        style: {
          background: `radial-gradient( circle 489px at 49.3% 46.6%,  rgba(255,214,126,1)
           0%, rgba(253,200,0,1) 100.2% )`,
        },
        textStyle: { color: "yellow" },
      };
    default:
      return {
        bg: `bg-red-400 ${hover ? "hover:bg-red-500" : ""}`,
        text: "text-red-300",
        style: {
          background: `radial-gradient( circle 489px at 49.3% 46.6%,  rgba(255,214,126,1) 0%, rgba(253,200,0,1) 100.2% )`,
        },
      };
  }
};

export const dateLocale = (date: Date | string) => {
  const conv = new Date(date);
  return conv.toLocaleDateString("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const timeLocale = (date: Date | string) => {
  const conv = new Date(date);
  return conv.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" });
};

export const dateTimeLocale = (date: Date | string) => {
  const conv = new Date(date);
  return conv.toLocaleString("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
