"use client";

import Avatar from "@components/radix/Avatar";
import {
  Bars2Icon,
  BellAlertIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Content, Root, Trigger } from "@radix-ui/react-dialog";
import useMediaQuery from "@lib/useMediaQuery";
import { useState } from "react";
import { useStore } from "store";
import { csToStyle } from "@lib/helpers";

interface Props {
  auth: Session | null;
}

const HeaderA = ({ auth }: Props) => {
  const mq = useMediaQuery("(min-width: 800px)");

  const [open, setOpen] = useState(false);

  return (
    <div className={`absolute inset-x-0 top-0 z-30`}>
      <div className="md:m-2 md:rounded-lg bg-white/40 md:p-2 ">
        <div className="flex h-12 bg-white md:rounded-lg justify-between items-center px-2 md:px-4">
          <div className="hidden md:flex gap-2 items-center">
            <NavLink text="Dashboard" to="/admin/" />
            <NavLink text="Products" to="/admin/products" />
            {/* <NavLink text="Sales" to="/admin/sales" /> */}
            {/* <NavLink text="Notifications" to="/admin/notifications" /> */}
            <NavLink text="Assets" to="/admin/assets" />
            <NavLink text="Categories" to="/admin/categories" />
            <NavLink text="Vendors" to="/admin/vendors" />
            <NavLink text="Stores" to="/admin/stores" />
            <NavLink text="Customers" to="/admin/customers" />
            {/* <NavLink text="Settings" to="/admin/settings" /> */}
          </div>

          <button
            className="md:hidden hover:text-blue-700"
            onClick={() => setOpen((state) => !state)}
          >
            <Bars2Icon width={30} />
          </button>

          <div className="flex items-center flex-row-reverse md:flex-row gap-3">
            <div className="hidden md:flex bg-black/10 py-1 gap-2 text-center px-4 rounded-md leading-3">
              <div className="w-32">
                <p className="leading-4">admin</p>
                <p className="text-[12px] text-amber-600">{auth?.user.name}</p>
              </div>
              <ChevronDownIcon width={20} />
            </div>

            <Link href={"/settings"}>
              <Avatar
                className="w-9 h-9 rounded-full"
                alt="profile"
                src={auth?.user.image}
              />
            </Link>
            <Link href={"/notifications"} className="opacity-40">
              <BellAlertIcon width={25} />
            </Link>
          </div>
        </div>
      </div>

      {!mq && (
        <Root open={open} onOpenChange={setOpen}>
          <Content className="fixed top-[46px] inset-x-0 bottom-0 bg-white h-full z-50">
            <div className="flex w-full justify-between bg-black/10 py-1 gap-2 text-center px-4 ">
              <div className="">
                <p className="leading-4 text-lg">admin</p>
                <p className="text-base text-amber-600">{auth?.user.name}</p>
              </div>
              <ChevronDownIcon width={20} />
            </div>
            <div className="py-2 px-5">
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Dashboard"
                to="/admin/"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Products"
                to="/admin/products"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Sales"
                to="/admin/sales"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Notifications"
                to="/admin/notifications"
              />

              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Vendors"
                to="/admin/vendors"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Assets"
                to="/admin/assets"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Categories"
                to="/admin/categories"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Stores"
                to="/admin/stores"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Customers"
                to="/admin/customers"
              />
              <NavLinkSm
                onclick={() => setOpen(false)}
                text="Settings"
                to="/admin/settings"
              />
            </div>
          </Content>
        </Root>
      )}
    </div>
  );
};

const NavLinkSm = ({
  text,
  to,
  nested,
  onclick,
}: {
  text: string;
  to: string;
  nested?: boolean;
  onclick: () => void;
}) => {
  const pathname = usePathname();
  const active = !!(nested
    ? pathname === to
    : (pathname === to || `/${pathname?.split("/")[1]}` === to) &&
      pathname !== "/mypages/landing");

  return (
    <Link
      href={to}
      className={`font-medium text-lg hover:text-neutral-500 text-neutral-700 block ${
        active ? "text-black" : ""
      }`}
      onClick={onclick}
    >
      {text}
    </Link>
  );
};

const NavLink = ({
  text,
  to,
  nested,
}: {
  text: string;
  to: string;
  nested?: boolean;
}) => {
  const pathname = usePathname();
  const active = !!(nested
    ? pathname === to
    : (pathname === to || `/admin/${pathname?.split("/")[1]}` === to) &&
      pathname !== "/mypages/landing");

  return (
    <Link
      href={to}
      className={`text-base hover:text-neutral-400 block ${
        active ? "text-black" : "text-neutral-700"
      }`}
    >
      {text}
    </Link>
  );
};

export default HeaderA;
