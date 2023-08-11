import Avatar from "@components/radix/Avatar";
import {
  Bars2Icon,
  BellAlertIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import type { Store } from "@prisma/client";
import type { Session } from "next-auth";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Content, Root } from "@radix-ui/react-dialog";
import useMediaQuery from "@lib/useMediaQuery";
import { useState } from "react";
import SelectStore from "@components/SelectStore";
import { useStore } from "store";
import { csToStyle } from "@lib/helpers";
import { api } from "src/server/api";

interface Props {
  auth: Session | null;
  store?: Store | null;
  refetch: () => void;
}

const Header = ({ auth, store, refetch }: Props) => {
  const mq = useMediaQuery("(min-width: 800px)");

  const [open, setOpen] = useState(false);
  const [sOpen, setSOpen] = useState(false);

  const { data } = api.notification.unreadCount.useQuery(undefined, {
    placeholderData: 0,
    networkMode: "offlineFirst",
  });

  const unreadN = data || 0;

  return (
    <>
      <Root open={sOpen} onOpenChange={setSOpen}>
        <Content
          className="fixed outline-none z-50 top-1/4 inset-x-0 p-2 md:left-auto 
        md:right-40 w-full md:w-96 max-h-[350px]"
        >
          <SelectStore refetch={refetch} onSwitchedFn={() => setSOpen(false)} />
        </Content>
      </Root>

      <div className={`absolute inset-x-0 top-0 z-40`}>
        <div className="md:m-2 md:rounded-lg bg-white/40 md:p-2 backdrop-blur-md">
          <div className="flex h-12 bg-white md:rounded-lg justify-between items-center px-2 md:px-4">
            <div className="hidden md:flex gap-2 items-center">
              <NavLink text="Dashboard" to="/" />
              <NavLink text="Orders" to="/orders" />
              <NavLink text="Products" to="/products" />
              <NavLink text="Notifications" to="/notifications" />
              <NavLink text="Settings" to="/settings" />
            </div>

            {!mq && (
              <button
                className="hover:text-blue-700"
                onClick={() => setOpen((state) => !state)}
              >
                <Bars2Icon width={30} />
              </button>
            )}
            {/* 
          <Image
            alt="logo"
            src="/logo5.png"
            width={440}
            height={380}
            className="ml-5 w-32 md:w-24 drop-shadow-lg"
          /> */}

            <div className="flex items-center flex-row-reverse md:flex-row gap-3">
              <div
                className="hidden cursor-pointer md:flex bg-black/10 py-1 gap-2 text-center px-4 rounded-md leading-3"
                onClick={() => setSOpen((state) => !state)}
              >
                <div className="">
                  <p className="leading-4">{store?.name}</p>
                  <p className="text-[12px] text-amber-600">
                    {auth?.user.name}
                  </p>
                </div>
                <ChevronDownIcon width={20} />
              </div>

              <Link href={"/settings"} className="h-full flex items-center">
                <Avatar
                  className="w-9 h-9 rounded-full"
                  src={auth?.user.image}
                />
              </Link>
              <Link
                href={"/notifications"}
                prefetch={false}
                className=" relative"
              >
                {unreadN > 0 && (
                  <div
                    className="w-4 h-4 flex justify-center items-center
                   rounded-full text-white absolute top-0 right-0 bg-blue-500 font-bold text-xs"
                  >
                    {unreadN}
                  </div>
                )}
                <BellAlertIcon
                  width={25}
                  className={`${unreadN > 0 ? "" : "opacity-40"}`}
                />
              </Link>
            </div>
          </div>
        </div>

        {!mq && (
          <Root open={open} onOpenChange={setOpen}>
            <Content className="fixed top-12 inset-x-0 bottom-0 bg-white h-full z-50">
              <div className="flex w-full justify-between bg-black/10 py-1 gap-2 text-center px-4 ">
                <div className="">
                  <p className="leading-4 text-lg">{store?.name}</p>
                  <p className="text-base text-amber-600">{auth?.user.name}</p>
                </div>
                <button
                  onClick={() => {
                    setOpen(false);
                    setSOpen((state) => !state);
                  }}
                >
                  <ChevronDownIcon width={20} />
                </button>
              </div>
              <div className="py-2 px-5">
                <NavLinkSm
                  onclick={() => setOpen(false)}
                  text="Dashboard"
                  to="/"
                />
                <NavLinkSm
                  onclick={() => setOpen(false)}
                  text="Orders"
                  to="/orders"
                />
                <NavLinkSm
                  onclick={() => setOpen(false)}
                  text="Products"
                  to="/products"
                />

                <NavLinkSm
                  onclick={() => setOpen(false)}
                  text="Notifications"
                  to="/notifications"
                />
                <NavLinkSm
                  onclick={() => setOpen(false)}
                  text="Settings"
                  to="/settings"
                />
              </div>
            </Content>
          </Root>
        )}
      </div>
    </>
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
  const router = useRouter();
  const colorScheme = useStore((state) => state.colorScheme);
  const { textStyle } = csToStyle(colorScheme);

  const pathname = usePathname();

  const active = !!(nested
    ? pathname === to
    : (pathname === to || `/${pathname?.split("/")[1]}` === to) &&
      pathname !== "/mypages/landing");

  return (
    <Link
      href={to}
      className={`font-medium text-lg hover:opacity-90  block ${
        active ? `${textStyle}` : "text-neutral-500"
      }`}
      onClick={onclick}
      style={active ? textStyle : {}}
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
  const router = useRouter();
  const colorScheme = useStore((state) => state.colorScheme);
  const { textStyle } = csToStyle(colorScheme);

  const pathname = usePathname();
  const active = !!(nested
    ? pathname === to
    : (pathname === to || `/${pathname?.split("/")[1]}` === to) &&
      pathname !== "/mypages/landing");

  return (
    <Link
      href={to}
      className={`font-medium text-lg hover:opacity-90  block ${
        active
          ? `${"text-neutral-700 text-xl font-semibold"} `
          : "text-neutral-500"
      }`}
      style={active ? textStyle : {}}
    >
      {text}
    </Link>
  );
};

export default Header;
