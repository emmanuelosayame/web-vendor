import InputTemp, { TextareaTemp } from "@components/InputTemp";
import LayoutA from "@components/Layout/Admin";
import { Loading, LoadingBlur } from "@components/Loading";
import RadioGroup from "@components/radix/RadioGroup";
import { IconBack, IconButton, MenuFlex, THStack } from "@components/TElements";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "utils/api";
import { type NextPageWithLayout } from "@t/shared";
import AlertDialog from "@components/radix/Alert";
import { vendorVs } from "utils/validation";

const Vendor: NextPageWithLayout = () => {
  const router = useRouter();
  const vendorId = router.query.vendor?.toString();

  const [edt, setedit] = useState(false);
  const edit = vendorId === "new" ? true : edt;

  const [sRole, setSRole] = useState<"admin" | "vendor">();

  const qc = api.useContext();

  const {
    data: vendor,
    isLoading,
    isFetching,
  } = api.vendor.one.useQuery(
    { vid: vendorId },
    {
      enabled: !!vendorId && vendorId !== "new",
    }
  );

  const { mutate: create, isLoading: creating } = api.vendor.new.useMutation({
    onSuccess: (data) => router.replace(`/admin/vendors/${data.id}`),
  });

  const { mutate, isLoading: mutating } = api.vendor.update.useMutation({
    onSettled: () => qc.vendor.one.refetch(),
  });

  const formIV = {
    email: vendor?.email || "",
    firstName: vendor?.firstName || "",
    lastName: vendor?.lastName || "",
    phoneNo: vendor?.phoneNo || "",
    location: vendor?.location || "",
    address: vendor?.address || "",
  };

  if (!vendorId || isFetching || mutating) return <Loading />;

  if (vendorId !== "new" && !vendor)
    return (
      <div className="bg-white w-2/5 rounded-lg mx-auto flex justify-center p-4">
        Something went wrong
      </div>
    );

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
          <Formik
            initialValues={formIV}
            validationSchema={vendorVs}
            onSubmit={(values) => {
              if (vendorId === "new") {
                create({ data: values });
              } else mutate({ vid: vendorId, data: values });
            }}
          >
            {({ dirty, touched, errors, getFieldProps }) => (
              <Form className="bg-white rounded-lg p-4 space-y-3 w-full h-full flex flex-col">
                <h3 className="w-full text-center text-xl border-b border-b-neutral-300">
                  Vendor Info
                </h3>
                <THStack>
                  <InputTemp
                    disabled={!edit}
                    fieldProps={getFieldProps("firstName")}
                    heading="First Name"
                    placeholder="Enter First Name"
                    touched={touched.firstName}
                    error={errors.firstName}
                  />
                  <InputTemp
                    disabled={!edit}
                    fieldProps={getFieldProps("lastName")}
                    heading="Last Name"
                    placeholder="Enter Last Name"
                    touched={touched.lastName}
                    error={errors.lastName}
                  />
                </THStack>
                <InputTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("email")}
                  heading="Email"
                  placeholder="Enter email"
                  touched={touched.email}
                  error={errors.email}
                />
                <InputTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("phoneNo")}
                  heading="Phone No."
                  placeholder="Enter phone number"
                  touched={touched.phoneNo}
                  error={errors.phoneNo}
                  type="tel"
                />
                <InputTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("location")}
                  placeholder="Enter Location"
                  touched={touched.location}
                  error={errors.location}
                  heading="Location"
                />
                <TextareaTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("address")}
                  placeholder="Enter Address"
                  heading="Address"
                  touched={touched.address}
                  error={errors.address}
                />
                <button
                  disabled={!edit || !dirty}
                  type="submit"
                  className="p-2 w-full md:w-10/12 mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
                >
                  Save
                </button>
              </Form>
            )}
          </Formik>

          <div
            className={`bg-white rounded-lg p-4 space-y-4 w-full h-full flex flex-col relative`}
          >
            <div
              className={`${
                vendorId === "new"
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
                onClickConfirm={() =>
                  mutate({ vid: vendorId, data: { role: sRole } })
                }
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
                  vid: vendorId,
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
Vendor.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};
export default Vendor;
