"use client";

import { InputTemp, TextareaTemp } from "@components/InputTemp";
import { LoadingBlur } from "@components/Loading";
import RadioGroup from "@components/radix/RadioGroup";
import { IconBack, MenuFlex, THStack } from "@components/TElements";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@lib/api";
import AlertDialog from "@components/radix/Alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Vendor } from "@prisma/client";
import { type VendorS, vendorS } from "src/server/zod";

interface Props {
  vendor: Vendor | null;
  vid: string;
}

const VendorClient = ({ vendor, vid }: Props) => {
  const router = useRouter();
  const [edt, setedit] = useState(false);
  const edit = vid === "new" ? true : edt;

  const [sRole, setSRole] = useState<"admin" | "vendor">();

  const { mutate: create, isLoading: creating } = api.vendor.new.useMutation({
    onSuccess: (data) => router.replace(`/admin/vendors/${data.id}`),
  });

  const { mutate, isLoading: mutating } = api.vendor.update.useMutation({
    onSettled: () => router.refresh(),
  });

  const defaultValues = {
    email: vendor?.email || "",
    firstName: vendor?.firstName || "",
    lastName: vendor?.lastName || "",
    phoneNo: vendor?.phoneNo || "",
    location: vendor?.location || "",
    address: vendor?.address || "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isDirty },
  } = useForm<VendorS>({
    defaultValues,
    resolver: zodResolver(vendorS.partial()),
  });

  return (
    <>
      {creating && <LoadingBlur />}
      <MenuFlex>
        <IconBack>Back</IconBack>

        <button
          type="button"
          className={`${
            edit ? "bg-green-400 text-white" : "bg-white"
          } rounded-lg py-1 w-24`}
          onClick={() => setedit((state) => !state)}
        >
          Edit
        </button>
      </MenuFlex>

      <div className="h-full overflow-y-auto">
        <div className="p-2 bg-white/40 rounded-lg flex flex-col md:flex-row gap-2 h-[98%]">
          <form
            onSubmit={handleSubmit((values) => {
              if (vid === "new") {
                create({ data: values });
              } else mutate({ vid, data: values });
            })}
            className="bg-white rounded-lg p-4 space-y-3 w-full h-full flex flex-col"
          >
            <h3 className="w-full text-center text-xl border-b border-b-neutral-300">
              Client Info
            </h3>
            <THStack>
              <InputTemp
                disabled={!edit}
                {...register("firstName")}
                label="First Name"
                placeholder="Enter First Name"
                touched={touchedFields.firstName}
                error={errors.firstName?.message}
              />
              <InputTemp
                disabled={!edit}
                {...register("lastName")}
                label="Last Name"
                placeholder="Enter Last Name"
                touched={touchedFields.lastName}
                error={errors.lastName?.message}
              />
            </THStack>
            <InputTemp
              disabled={!edit}
              {...register("email")}
              label="Email"
              placeholder="Enter email"
              touched={touchedFields.email}
              error={errors.email?.message}
            />
            <InputTemp
              disabled={!edit}
              {...register("phoneNo")}
              label="Phone No."
              placeholder="Enter phone number"
              touched={touchedFields.phoneNo}
              error={errors.phoneNo?.message}
              type="tel"
            />
            <InputTemp
              disabled={!edit}
              {...register("location")}
              placeholder="Enter Location"
              touched={touchedFields.location}
              error={errors.location?.message}
              label="Location"
            />
            <TextareaTemp
              disabled={!edit}
              {...register("address")}
              placeholder="Enter Address"
              label="Address"
              touched={touchedFields.address}
              error={errors.address?.message}
            />
            <button
              disabled={!edit || !isDirty}
              type="submit"
              className="p-2 w-full md:w-10/12 mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
            >
              Save
            </button>
          </form>

          <div
            className={`bg-white rounded-lg p-4 space-y-4 w-full h-full flex flex-col relative`}
          >
            <div
              className={`${
                vid === "new"
                  ? "absolute bg-black/10 w-full h-full rounded-lg inset-0 z-30"
                  : "hidden"
              } `}
            />
            <h3 className=" rounded-lg p-2 text-lg bg-neutral-100">
              Status : {vendor?.status || "..."}
            </h3>

            <div className="flex items-center justify-between">
              <p>Role :</p>
              <RadioGroup<"admin" | "vendor">
                defaultValue={vendor?.role || "vendor"}
                itemStyles="w-6 h-6"
                items={[
                  { display: "Vendor", value: "vendor" },
                  { display: "Admin", value: "admin" },
                ]}
                onValueChange={(e) => setSRole(e)}
              />
            </div>
            {sRole && sRole !== vendor?.role ? (
              <AlertDialog
                trigger="Save"
                triggerStyles="p-2 w-full md:w-10/12 mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
                action="Save"
                title={`Are you sure you want to change permission from ${vendor?.role} to ${sRole}?`}
                onClickConfirm={() => mutate({ vid, data: { role: sRole } })}
              />
            ) : (
              <button
                disabled
                className="p-2 w-full md:w-10/12 mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
              >
                Save
              </button>
            )}

            <AlertDialog
              trigger={vendor?.status === "active" ? "De-activate" : "Activate"}
              triggerStyles="p-2 w-full md:w-10/12 mx-auto bg-red-500 text-white rounded-lg
            disabled:opacity-75 hover:bg-red-600"
              action={vendor?.status === "active" ? "De-activate" : "Activate"}
              title={`Are you sure you want to ${
                vendor?.status === "active" ? "deactivate" : "activate"
              } this vendor?`}
              onClickConfirm={() =>
                mutate({
                  vid,
                  data: {
                    status: vendor?.status === "active" ? "disabled" : "active",
                  },
                })
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorClient;
