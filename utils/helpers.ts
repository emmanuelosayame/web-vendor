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

export const csToStyle = (colorScheme: CSNames) => {
  switch (colorScheme) {
    case "alice":
      return { bg: "bg-blue-500" };
    case "greenade":
      return { bg: "bg-green-500" };
    case "purpleIsle":
      return { bg: "bg-amber-500" };
    case "sierra":
      return { bg: "bg-blue-500" };
    case "montery":
      return { bg: "bg-blue-400" };
    default:
      return { bg: "bg-blue-500" };
  }
};
