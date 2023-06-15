"use client";

import {
  IconLink,
  MenuFlex,
  TDivider,
  TFlex,
  THStack,
  TStack,
} from "@components/TElements";
import {
  CheckBadgeIcon,
  CogIcon,
  GlobeAltIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { api } from "@lib/api";

const Settings = () => {
  const { data: store } = api.store.one.useQuery({});

  return (
    <>
      <MenuFlex>
        <IconLink href="/settings/profile">
          <p>Profile</p>
          <CogIcon width={20} />
        </IconLink>

        <IconLink href="/settings/store">
          <p>Store</p>
          <CogIcon width={20} />
        </IconLink>
      </MenuFlex>

      <div className="bg-white/40 rounded-lg backdrop-blur-md p-2 w-full h-[99%] md:h-[95%]">
        <TStack className="bg-white rounded-lg overflow-hidden relative h-full">
          <div className="bg-neutral-900 w-full h-2/6 md:h-2/5 " />
          <div className="absolute top-1/2 md:top-1/2 inset-x-5 botton -translate-y-1/2">
            <div>
              <TStack className="md:flex-row items-center gap-5">
                <div className="bg-neutral-700 w-40 h-36 md:w-52 md:h-52 rounded-xl" />
                <TFlex>
                  <div>
                    <h3 className="text-3xl md:text-5xl leading-5 font-semibold text-blue-500 inline-flex items-center gap-1">
                      {store?.name}{" "}
                      <span>
                        <CheckBadgeIcon width={20} />
                      </span>
                    </h3>
                    <p className="text-base leading-4 text-neutral-500 md:ml-3">
                      {store?.about}
                    </p>
                  </div>
                  <THStack>
                    <button
                      aria-label="copy-link"
                      className="mx-2 drop-shadow-md"
                    >
                      <LinkIcon width={25} />
                    </button>
                    <button
                      aria-label="copy-link"
                      className="mx-2 drop-shadow-md"
                    >
                      <GlobeAltIcon width={25} />
                    </button>
                  </THStack>
                </TFlex>

                <div
                  className="w-full md:w-1/3 text-base md:text-lg bg-white
                 border border-neutral-300 rounded-lg p-1 md:p-2 h-full"
                >
                  <h3 className=" text-center">Team</h3>
                  <TDivider />
                  <div>
                    {store?.vendors.map((vendor) => (
                      <p
                        key={vendor.id}
                        className="text-sm md:text-base w-full flex justify-between"
                      >
                        {vendor.email} :{" "}
                        <span className="text-amber-400">{vendor.role}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </TStack>
              <div className="w-full flex justify-center mt-4">
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
            </div>
          </div>
        </TStack>
      </div>
    </>
  );
};

export default Settings;
