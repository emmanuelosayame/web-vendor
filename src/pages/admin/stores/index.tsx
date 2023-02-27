import LayoutA from "@components/Layout/Admin";
import Avatar from "@components/radix/Avatar";
import Select from "@components/radix/Select";
import { IconLink, MenuFlex } from "@components/TElements";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "utils/api";
import { limitText } from "utils/helpers";
import useMediaQuery from "utils/useMediaQuery";
import { type NextPageWithLayout } from "../../_app";

const Stores: NextPageWithLayout = () => {
  const { data: stores } = api.store.many.useQuery({ limit: 10 });

  const mq = useMediaQuery("(min-width: 800px)");

  return (
    <>
      <MenuFlex>
        <Select
          onValueChange={() => {}}
          defaultSelected="all"
          selectList={[
            { item: "All", value: "all" },
            { item: "Admin", value: "admin" },
            { item: "Vendor", value: "vendor" },
          ]}
        />

        <IconLink href="/admin/stores/new">
          <p>New</p>
          <PlusIcon width={20} />
        </IconLink>
      </MenuFlex>

      <div className="p-2 bg-white/40 rounded-lg h-[98%]">
        <div className="p-3 bg-white rounded-lg h-full overflow-y-auto">
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {stores?.map((store) => (
              <Link
                href={`/admin/stores/${store.id}`}
                key={store.id}
                className="p-2 md:p-4 rounded-lg ring-1 ring-neutral-300 col-span-1
                 flex flex-col cursor-pointer w-full
                  hover:ring-2"
              >
                <h3 className="text-center text-lg md:text-2xl ">
                  {!mq ? limitText(store.name, 12) : store.name}
                </h3>
                <p>#122344</p>
                <div className="border border-neutral-200 h-16 py-1 px-2 w-full rounded-lg">
                  {store.vendors.map((vendor) => (
                    <p key={vendor.id}>
                      {!mq ? limitText(vendor.email, 10) : vendor.email}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between mt-2">
                  <div>
                    <p className="text-sm md:text-base">{store.about}</p>
                  </div>
                  <div>
                    <Avatar
                      alt="profile"
                      className="w-20 h-20 rounded-full mx-auto"
                      src={store.photoUrl}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

Stores.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};
export default Stores;
