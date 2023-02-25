import LayoutA from "@components/Layout/Admin";
import Avatar from "@components/radix/Avatar";
import Select from "@components/radix/Select";
import { IconLink, MenuFlex } from "@components/TElements";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { api } from "utils/api";
import { type NextPageWithLayout } from "../../_app";

const Vendors: NextPageWithLayout = () => {
  const { data: vendors } = api.vendor.many.useQuery({ limit: 10 });

  return (
    <>
      <MenuFlex>
        <Select
          onValueChange={() => {}}
          defaultSelected="all"
          selectList={[{ item: "All", value: "all" }]}
        />

        <IconLink href="/admin/vendors/new">
          <p>Add</p>
          <PlusIcon width={20} />
        </IconLink>
      </MenuFlex>

      <div className="p-2 bg-white/40 rounded-lg h-[98%]">
        <div className="p-4 bg-white rounded-lg h-full overflow-y-auto">
          <div className="flex flex-colsm:grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pt-4">
            {vendors?.map((vendor) => (
              <Link
                href={`/admin/vendors/${vendor.id}`}
                key={vendor.id}
                className="p-4 rounded-lg bg-neutral-100 col-span-1
                 flex flex-col cursor-pointer hover:bg-neutral-200"
              >
                <p>{vendor.email}</p>
                <div className="flex justify-between">
                  <div>
                    <p>{`${vendor.firstName} ${vendor.lastName}`}</p>
                    <p>{vendor.phoneNo}</p>
                  </div>
                  <Avatar
                    alt="profile"
                    className="w-16 h-16 rounded-full mx-auto"
                    src={vendor.photoUrl || undefined}
                  />
                </div>
                <p>{(vendor?.role || "vendor").toUpperCase()}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
Vendors.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};
export default Vendors;
