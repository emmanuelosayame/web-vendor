"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useSSR = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
};

export const usePagn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const pagn = Number(searchParams?.get("pg")?.toString()) || 1;
  const prev = () => router.replace(`${pathname}?pg=${pagn - 1}`);
  const next = () => router.replace(`${pathname}?pg=${pagn + 1}`);

  return [pagn, { prev, next }] as [
    number,
    { prev: () => void; next: () => void }
  ];
};
