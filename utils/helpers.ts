import { Store } from "@prisma/client";
import type { CSNames } from "types/shared";

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

export const csToStyle = (colorScheme: CSNames, hover: boolean = false) => {
  switch (colorScheme) {
    case "alice":
      return {
        bg: `bg-blue-500 ${hover ? "hover:bg-blue-600" : ""}`,
        text: "text-amber-500",
      };
    case "greenade":
      return { bg: "bg-green-500", text: "text-green-700" };
    case "purpleIsle":
      return { bg: "bg-amber-500", text: "text-white" };
    case "sierra":
      return { bg: "bg-blue-400", text: "text-blue-600" };
    case "montery":
      return {
        bg: `bg-red-400 ${hover ? "hover:bg-red-500" : ""}`,
        text: "text-red-300",
      };
    default:
      return { bg: "bg-red-500", text: "text-amber-500" };
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

export const getStoragePath = (url: string | null | undefined) => {
  if (!url) return;
  const bucket = process.env.FIREBASE_BUCKET;
  if (!bucket) throw new Error("no bucket");
  const urlObject = new URL(url);
  if (urlObject.host === "firebasestorage.googleapis.com")
    return decodeURIComponent(urlObject.pathname.substring(1)).slice(
      `v0/b/${bucket}/o/`.length
    );
};
