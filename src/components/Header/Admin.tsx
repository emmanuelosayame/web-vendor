import Avatar from "@components/radix/Avatar";
import {
  Bars2Icon,
  BellAlertIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import type { Store } from "@prisma/client";
import type { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  auth: Session | null;
}

const HeaderA = ({ auth }: Props) => {
  return (
    <div className="absolute inset-x-0 bg-blue-600 top-0 z-40">
      <div className=" m-2 rounded-lg bg-white bg-opacity-40 h-16 p-2 ">
        <div className="flex bg-white rounded-lg h-full justify-between items-center px-4">
          <div className="hidden md:flex gap-2 items-center">
            <NavLink text="Dashboard" to="/admin/" />
            <NavLink text="Products" to="/admin/products" />
            <NavLink text="Sales" to="/admin/sales" />
            <NavLink text="Notifications" to="/admin/notifications" />
            <NavLink text="Vendors" to="/admin/vendors" />
            <NavLink text="Customers" to="/admin/customers" />
            <NavLink text="Settings" to="/admin/settings" />
          </div>
          <button className="md:hidden drop-shadow-md rounded-lg bg-blue-100 h-fit">
            <Bars2Icon width={30} />
          </button>
          {/* <div className="hidden md:flex items-center">
          <div className="relative bg-neutral-200 pl-7 w-full rounded-md">
            <input className="w-full outline-none bg-transparent p-1" />
            <MagnifyingGlassIcon
              className="absolute text-red-500 left-1 top-1/2 -translate-y-1/2"
              width={25}
            />
          </div>
        </div> */}

          <div className="flex items-center flex-row-reverse md:flex-row gap-3">
            <div className="hidden md:flex bg-black/10 py-1 gap-2 text-center px-4 rounded-md leading-3">
              <div className="">
                <p className="leading-4">delorand</p>
                <p className="text-[12px] text-amber-600">{auth?.user.name}</p>
              </div>
              <ChevronDownIcon width={20} />
            </div>

            <Link href={"/settings"}>
              <Avatar className="w-9 h-9 rounded-full" />
            </Link>
            <Link href={"/notifications"} className="opacity-40">
              <BellAlertIcon width={25} />
            </Link>
          </div>
        </div>
      </div>
    </div>
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
  const active = !!(nested
    ? router.asPath === to
    : (router.asPath === to || `/admin/${router.route.split("/")[1]}` === to) &&
      router.asPath !== "/mypages/landing");

  // const colorScheme = useStore((state) => state.colorScheme);

  return (
    <Link
      href={to}
      className={`font-semibold text-lg hover:text-blue-700 text-neutral-500 ${
        active ? "text-blue-500" : ""
      }`}
    >
      {text}
    </Link>
  );
};

export default HeaderA;
