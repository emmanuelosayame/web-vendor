import Layout from "@components/Layout";
import {
  IconButton,
  IconLink,
  TDivider,
  TFlex,
  THStack,
  TStack,
} from "@components/TElements";
import {
  CheckBadgeIcon,
  CheckIcon,
  GlobeAltIcon,
  LinkIcon,
  PencilIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { api } from "utils/api";
import { type NextPageWithLayout } from "../_app";

const Settings: NextPageWithLayout = () => {
  const { data: store } = api.store.one.useQuery({});

  return (
    <>
      <div className="flex justify-between mb-2 w-full">
        <IconButton>
          <p>Back</p>
          <XMarkIcon width={25} />
        </IconButton>

        <IconLink href="/settings/edit">
          <p>Edit</p>
          <PencilSquareIcon width={20} />
        </IconLink>
      </div>

      <div className="bg-white/40 rounded-lg backdrop-blur-md p-2 w-full h-full">
        <TStack className="bg-white rounded-lg overflow-hidden relative h-full">
          <div className="bg-neutral-800 w-full h-2/5 " />
          <div className="absolute top-1/2 inset-x-5 botton -translate-y-1/2">
            <TFlex className="items-center gap-5">
              <div className="bg-black w-52 h-52 rounded-xl" />
              <div>
                <h3 className="text-5xl font-semibold text-blue-500 inline-flex items-center gap-1">
                  {store?.name}{" "}
                  <span>
                    <CheckBadgeIcon width={20} />
                  </span>
                </h3>
                <p className="text-base text-neutral-500 ml-3">
                  {store?.about}
                </p>
              </div>
              <THStack className="flex-1">
                <button aria-label="copy-link" className="mx-2 drop-shadow-md">
                  <LinkIcon width={25} />
                </button>
                <button aria-label="copy-link" className="mx-2 drop-shadow-md">
                  <GlobeAltIcon width={25} />
                </button>
              </THStack>

              <div className=" w-1/3 text-lg border border-neutral-300 rounded-lg p-2 h-full">
                <h3 className=" text-center">Team</h3>
                <TDivider />
                <div>
                  {store?.vendors.map((vendor) => (
                    <p key={vendor.id}>
                      {vendor.email} :
                      <span className="text-amber-400">{vendor.role}</span>{" "}
                    </p>
                  ))}
                  <p>
                    stanley@gmail.com :{" "}
                    <span className="text-amber-400">owner</span>{" "}
                  </p>
                </div>
              </div>
            </TFlex>
          </div>
          <div className="absolute bottom-3 inset-x-3 flex justify-center">
            <button
              className="bg-blue-400 text-white py-1 px-3 rounded-lg hover:bg-blue-500
               drop-shadow-md"
              onClick={() => {
                signOut();
              }}
            >
              Sign out
            </button>
          </div>
        </TStack>
      </div>
    </>
  );
};

Settings.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export default Settings;
