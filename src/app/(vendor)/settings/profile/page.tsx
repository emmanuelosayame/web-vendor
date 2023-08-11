"use client";

import { InputTemp, TextareaTemp } from "@components/InputTemp";
import { Loading, LoadingBlur } from "@components/Loading";
import Avatar from "@components/radix/Avatar";
import Select from "@components/radix/Select";
import { IconBack, IconButton, MenuFlex } from "@components/TElements";
import { PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { diff } from "deep-object-diff";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useStore } from "store";
import { type CSNames } from "t/shared";
import { api } from "src/server/api";
import { csToStyle, limitText } from "@lib/helpers";
import { vendorVs } from "@lib/validation";
import { type NextPageWithLayout } from "t/shared";
import { useForm } from "react-hook-form";

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const qc = api.useContext();
  const saveRef = useRef<HTMLButtonElement | null>(null);
  const colorScheme = useStore((state) => state.colorScheme);
  const { style } = csToStyle(colorScheme);
  const changeCS = useStore((state) => state.setColorScheme);

  const csList: { item: string; value: CSNames }[] = [
    { item: "Montery", value: "montery" },
    { item: "Sierra", value: "sierra" },
    { item: "Alice", value: "alice" },
    { item: "Greenade", value: "greenade" },
    { item: "PurpleIsle", value: "purpleIsle" },
    { item: "Yellowmine", value: "yellowmine" },
  ];

  const { data, isLoading } = api.vendor.one.useQuery({});
  const { data: stores, isLoading: loadingStores } =
    api.vendor.accounts.useQuery({ all: true });

  const { mutate, isLoading: mutating } = api.vendor.update.useMutation({
    onSuccess: () => {
      qc.vendor.one.refetch();
    },
  });

  const profileIV = {
    firstName: data?.firstName || "",
    lastName: data?.lastName || "",
    email: data?.email || "",
    phoneNo: data?.phoneNo || "",
    location: data?.location || "",
    address: data?.address || "",
  };
  type ProfileIV = typeof profileIV;

  const onSubmit = (values: ProfileIV) => {
    const payload = diff(profileIV, values) as ProfileIV;
    mutate({ vid: data?.id, data: payload });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
  } = useForm<ProfileIV>({ defaultValues: profileIV });

  if (isLoading) return <Loading />;

  return (
    <>
      {mutating && <LoadingBlur />}
      <MenuFlex>
        <IconBack>
          <p>Cancel</p>
          <XMarkIcon width={25} />
        </IconBack>

        <IconButton>
          <p>Edit</p>
          <PencilSquareIcon width={25} />
        </IconButton>
      </MenuFlex>

      <div className="w-full h-full overflow-y-auto pb-2">
        <div className="bg-white/40 backdrop-blur-md rounded-lg p-2 flex flex-col md:flex-row gap-2 md:h-full">
          <form className="bg-white rounded-lg p-3 w-full md:w-1/3 flex flex-col items-center gap-2">
            <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
              Profile
            </h3>
            <Avatar
              fallbackStyle="text-xl font-semibold"
              className="w-24 h-24 rounded-full mt-2"
              src={data?.photoUrl}
              fallback={`${data?.firstName} ${data?.lastName}`}
            />
            <div className="flex items-center gap-3">
              <InputTemp
                label="Firstname"
                type="text"
                {...register("firstName")}
                touched={touchedFields.firstName}
                error={errors.firstName?.message?.toString()}
              />

              <InputTemp
                label="Lastname"
                type="text"
                {...register("lastName")}
                touched={touchedFields.lastName}
                error={errors.lastName?.message?.toString()}
              />
            </div>

            <InputTemp
              label="Email"
              type="email"
              {...register("email")}
              touched={touchedFields.email}
              error={errors.email?.message?.toString()}
            />

            <div className="flex items-center gap-3">
              <InputTemp
                label="Phone"
                type="tel"
                {...register("phoneNo")}
                touched={touchedFields.phoneNo}
                error={errors.phoneNo?.message?.toString()}
              />

              <InputTemp
                label="Location"
                type="text"
                {...register("location")}
                touched={touchedFields.location}
                error={errors.location?.message?.toString()}
              />
            </div>

            <TextareaTemp
              rows={2}
              {...register("address")}
              label="Address"
              touched={touchedFields.address}
              error={errors.address?.message?.toString()}
            />
            {/* <div className="bg-black/10 rounded-lg py-1 px-3 w-full text-sm">
                  <h3>
                    Status : <span className="text-green-500">Active</span>
                  </h3>
                </div> */}
            <button
              disabled={!isDirty}
              type="submit"
              className="p-2 text-white rounded-lg disabled:opacity-50 bg-green-500 w-full"
            >
              Save
            </button>
          </form>

          {/* 2 */}
          <div className="bg-white rounded-lg p-3 w-full md:w-1/3">
            <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
              Preference
            </h3>
            <p className="my-2">Color Scheme</p>
            <Select<CSNames>
              style={style}
              contentStyles="bg-white"
              triggerStyles={`border border-neutral-200
               rounded-lg w-full bg-opacity-70 text-white`}
              defaultSelected={colorScheme}
              onValueChange={(value) => changeCS(value)}
              selectList={csList}
            />
          </div>
          {/* 3 */}
          <div className="bg-white rounded-lg p-3 w-full md:w-1/3">
            <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
              {stores && stores.length > 1 ? "Stores" : "Store"}
            </h3>
            <div className=" mt-5 p-2 rounded-lg space-y-2">
              {stores?.map((store) => (
                <div
                  key={store.id}
                  className="border border-neutral-200 p-2 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-2xl text-neutral-600 font-semibold">
                      {limitText(store.name, 20)}
                    </p>
                    <p
                      className={`${
                        store.status === "active"
                          ? "text-green-500"
                          : store.status === "review"
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {store.status}
                    </p>
                  </div>
                  <div className="border border-neutral-200 p-2 rounded-lg">
                    <h3 className="text-lg divider-200 text-center">Team</h3>
                    {store?.vendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="flex justify-between items-center"
                      >
                        <p>{vendor.email}</p>
                        <p>{vendor.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
