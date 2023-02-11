import Avatar from "@components/radix/Avatar";
import {
  BellAlertIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/router";

interface Props {
  userdata: any;
}

const Header = ({ userdata }: Props) => {
  return (
    <div className=" m-2 rounded-lg absolute inset-0 bg-white bg-opacity-40 h-16 p-2">
      <div className="flex bg-white rounded-lg h-full justify-between px-4">
        <div className="hidden md:flex gap-2 items-center">
          <NavLink text="Dashboard" to="/" />
          <NavLink text="Products" to="/products" />
          <NavLink text="Pages" to="/mypages" />
          <NavLink text="Notifications" to="/notifications" />
          <NavLink text="Settings" to="/settings" />
        </div>
        <div className="hidden md:flex items-center">
          <div className="relative bg-neutral-200 pl-7 w-full rounded-lg">
            <input className="w-full outline-none bg-transparent p-1" />
            <MagnifyingGlassIcon
              className="absolute text-red-500 left-1 top-1/2 -translate-y-1/2"
              width={25}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <p className="inline-flex items-center gap-1 text-lg">
            Emmanuel Osayame{" "}
            <span>
              <CheckBadgeIcon width={15} />
            </span>{" "}
          </p>

          <button>
            <Avatar className="w-9 h-9 rounded-full" />
          </button>
          <button className="opacity-40">
            <EnvelopeIcon width={25} />
          </button>
          <button className="opacity-40">
            <BellAlertIcon width={25} />
          </button>
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
    : (router.asPath === to || `/${router.route.split("/")[1]}` === to) &&
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

export default Header;
