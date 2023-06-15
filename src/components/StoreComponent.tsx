import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import type { Store, StoreVendor } from "@prisma/client";
import { diff } from "deep-object-diff";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "@lib/api";
import { limitText } from "@lib/helpers";
import { initialSD } from "@lib/placeholders";
import { storeVs } from "@lib/validation";
import { InputTemp, TextareaTemp } from "./InputTemp";
import { LoadingBlur } from "./Loading";
import AlertDialog from "./radix/Alert";
import RadioGroup from "./radix/RadioGroup";
import Select from "./radix/Select";
import { THStack } from "./TElements";

interface Props {
  edit: boolean;
  store?: Store | null;
  id: "new" | "fetch";
  isAdmin: boolean;
}

interface VForm {
  setVid: (id?: string) => void;
  activeV: StoreVendor;
  mutate: (action: VendorUpdate) => void;
  store?: Store | null;
  pageId: string;
  isAdmin: boolean;
}

type VendorUpdate =
  | {
      type: "add";
      payload: StoreVendor;
    }
  | { type: "remove"; payload: { id: string } };

const StoreComponent = ({ edit, store = initialSD, id, isAdmin }: Props) => {
  const router = useRouter();
  const qc = api.useContext();

  const [vid, setVid] = useState<string | undefined>();
  const activeV: StoreVendor | undefined =
    vid !== "new"
      ? store?.vendors.find((vendor) => vid === vendor.id)
      : { id: "new", email: "", role: "member", status: "active" };

  const { data: currentVendor } = api.vendor.one.useQuery(
    {},
    { enabled: !isAdmin }
  );

  const vendorList: StoreVendor[] | undefined =
    !isAdmin && id === "new" && currentVendor
      ? [
          {
            email: currentVendor.email,
            id: currentVendor.id,
            role: "owner",
            status: "active",
          },
        ]
      : store?.vendors;

  const { mutate: create, isLoading: creating } = api.store.new.useMutation({
    onSuccess: (data) =>
      router.replace(isAdmin ? `/admin/stores/${data.id}` : `/`),
  });

  const { mutate, isLoading: mutating } = api.store.update.useMutation({
    onSuccess: () => {
      qc.store.oneA.refetch();
      setVid(undefined);
    },
  });

  const { mutate: deleteStore, isLoading: delting } =
    api.store.delete.useMutation({
      onSuccess: () => router.replace(`/admin/stores`),
    });

  const formIV = {
    name: store?.name || "",
    about: store?.about || "",
    email: store?.email || "",
    account: {
      number: store?.account?.number || "",
      name: store?.account?.name || "",
      bank: store?.account?.bank || "",
    },
    support: {
      mobile: store?.support?.mobile || "",
      whatsapp: store?.support?.whatsapp || "",
    },
  };

  // type FormIV = Omit<
  //   Store,
  //   "vendors" | "photoUrl" | "bannerUrl" | "id" | "status"
  // >;

  type FormIV = typeof formIV;

  const onSubmit = async (values: FormIV) => {
    if (id !== "new" && !!store) {
      if (!store) return;
      const payload = diff(formIV, values) as Partial<Store>;
      mutate({ id: store.id, data: payload });
    } else {
      if (isAdmin) {
        create({
          data: values,
        });
      } else if (currentVendor && currentVendor !== null)
        create({
          data: {
            ...values,
            status: "review",
            vendors: [
              {
                email: currentVendor.email,
                id: currentVendor.id,
                role: "owner",
                status: "active",
              },
            ],
          },
        });
    }
  };

  const updateVendors = ({ type, payload }: VendorUpdate) => {
    const vendors =
      store?.vendors.filter((vendor) => vendor.id !== payload.id) || [];
    if (type === "add") {
      mutate({ id: store?.id, data: { vendors: [...vendors, payload] } });
    }
    if (type === "remove") {
      mutate({ id: store?.id, data: { vendors } });
    }
  };

  return (
    <>
      {(creating || mutating) && <LoadingBlur />}

      <div className="p-2 bg-white/40 rounded-lg flex flex-col md:flex-row gap-2 h-auto md:h-[98%]">
        {/* 1 */}
        <Formik
          initialValues={formIV}
          validationSchema={storeVs}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ dirty, touched, errors, getFieldProps }) => (
            <Form className="rounded-lg w-full md:w-2/3 flex flex-col md:flex-row gap-2 bg-white">
              <div className="bg-white rounded-lg p-4 space-y-3 w-full h-full flex flex-col">
                <h3 className="w-full text-center text-xl border-b border-b-neutral-300">
                  Store Info
                </h3>

                <InputTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("name")}
                  heading="Name"
                  placeholder="name"
                  touched={touched.name}
                  error={errors.name}
                />

                <InputTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("email")}
                  heading="Email"
                  placeholder="Email"
                  touched={touched.email}
                  error={errors.email}
                />

                <TextareaTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("about")}
                  placeholder="About Store"
                  heading="About"
                  rows={3}
                  touched={touched.about}
                  error={errors.about}
                />
                <div className="w-full flex h-40 gap-2 items-center">
                  <div className="bg-black/40 rounded-full w-32 h-32 flex justify-center items-center text-white">
                    <h2>logo</h2>
                  </div>
                  <div className="bg-black/40 rounded-lg w-4/6 h-full flex justify-center items-center text-white">
                    <h2>banner</h2>
                  </div>
                </div>
              </div>

              {/* 2 */}
              <div className={`p-3 w-full flex flex-col gap-3 h-full relative`}>
                <div className="space-y-2 flex-1">
                  {id !== "new" ? (
                    <>
                      <InputTemp
                        heading="Account Name"
                        type="text"
                        fieldProps={getFieldProps("account.name")}
                        touched={touched.account?.name}
                        error={errors.account?.name}
                      />
                      <div className="flex items-center gap-3">
                        <InputTemp
                          heading="Account No."
                          type="tel"
                          fieldProps={getFieldProps("account.number")}
                          touched={touched.account?.number}
                          error={errors.account?.number}
                        />

                        <InputTemp
                          heading="Bank"
                          type="text"
                          fieldProps={getFieldProps("account.bank")}
                          touched={touched.account?.bank}
                          error={errors.account?.bank}
                        />
                      </div>
                    </>
                  ) : null}
                  <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
                    Support
                  </h3>
                  <THStack>
                    <InputTemp
                      heading="Phone (mobile)."
                      type="tel"
                      fieldProps={getFieldProps("support.mobile")}
                      touched={touched.support?.mobile}
                      error={errors.support?.mobile}
                    />

                    <InputTemp
                      heading="Phone (whatsapp)"
                      type="text"
                      fieldProps={getFieldProps("support.whatsapp")}
                      touched={touched.support?.whatsapp}
                      error={errors.support?.whatsapp}
                    />
                  </THStack>
                </div>

                <button
                  disabled={!edit || !dirty}
                  type="submit"
                  className="btn-green"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* 3 */}

        <div
          className={`bg-white rounded-lg p-2 space-y-4 w-full md:w-1/3 h-full flex flex-col relative`}
        >
          <div
            className={`${
              id === "new"
                ? "absolute bg-black/10 w-full h-full flex md:items-center text-center text-amber-400 p-10 rounded-lg inset-0 z-30"
                : "hidden"
            } `}
          >
            <p>You can add members after you create your store</p>
          </div>
          {activeV ? (
            <VendorForm
              store={store}
              activeV={activeV}
              setVid={setVid}
              mutate={updateVendors}
              pageId={id}
              isAdmin={isAdmin}
            />
          ) : (
            <>
              <h3 className=" rounded-lg p-2 text-lg bg-neutral-100">
                Status : {id !== "new" ? store?.status : "..."}
              </h3>

              <div className="h-full">
                <h3 className="text-lg text-center border-b border-b-neutral-200 mb-3">
                  Team
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {vendorList
                    ?.sort((v) => {
                      if (!!(currentVendor && currentVendor.id === v.id))
                        return -1;
                      return 0;
                    })
                    .map((vendor) => (
                      <div
                        key={vendor.id}
                        className="border border-neutral-200 rounded-lg p-2 col-span-2 md:col-span-1"
                      >
                        <p className="text-sm text-end">
                          {limitText(vendor.email, 20)}
                        </p>

                        <div className="flex justify-between">
                          <p>Role : </p>
                          <p>{vendor.role}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Status : </p>
                          <p>{vendor.status}</p>
                        </div>

                        <button
                          disabled={
                            !!(currentVendor && currentVendor.id === vendor.id)
                          }
                          type="submit"
                          className="p-1 w-full mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-50 hover:bg-green-500"
                          onClick={() => setVid(vendor.id)}
                        >
                          Edit Team
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <button
                disabled={!store || (store && store?.vendors.length > 3)}
                type="submit"
                className="p-2 w-full bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
                onClick={() => setVid("new")}
              >
                Add Team
              </button>

              <div className="flex gap-2 items-center">
                {id !== "new" && isAdmin ? (
                  <AlertDialog
                    trigger={
                      store?.status === "active" ? "Disable" : "Activate"
                    }
                    triggerStyles={`p-2 w-full text-white rounded-lg
            disabled:opacity-75 ${
              store?.status !== "active"
                ? "hover:bg-blue-600  bg-blue-500"
                : "hover:bg-amber-600  bg-amber-500"
            }`}
                    action={store?.status === "active" ? "Disable" : "Activate"}
                    title={`Are you sure you want to ${
                      store?.status === "active" ? "disable" : "activate"
                    } this store?`}
                    onClickConfirm={() => {
                      mutate({
                        id: store?.id,
                        data: {
                          status:
                            store?.status === "active" ? "disabled" : "active",
                        },
                      });
                    }}
                  />
                ) : null}
                {id !== "new" && isAdmin ? (
                  <AlertDialog
                    trigger={"Delete"}
                    triggerStyles={`p-2 w-full text-white rounded-lg
            disabled:opacity-75 hover:bg-red-600  bg-red-500`}
                    action="delete"
                    title={`Are you sure you want to delete this store?`}
                    onClickConfirm={() => {
                      deleteStore({ id: store?.id });
                    }}
                  />
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const VendorForm = ({ setVid, activeV, mutate, store }: VForm) => {
  const { data: vendors } = api.vendor.many.useQuery(
    { limit: 10 },
    { initialData: [] }
  );

  const vlist =
    activeV?.id === "new"
      ? vendors
          .filter((vendor) => store?.vendors.some((v) => v.id !== vendor.id))
          .map((vendor) => ({
            item: vendor.email,
            value: vendor.email,
          }))
      : vendors.map((vendor) => ({
          item: vendor.email,
          value: vendor.email,
        }));

  const [email, setEmail] = useState<string>(
    activeV?.email || vlist.find((v, index) => index < 1)?.value || ""
  );
  const [role, setRole] = useState<"member" | "owner">(
    activeV?.role || "member"
  );
  const id = activeV.id;

  return (
    <>
      <div className="flex p-1">
        <button onClick={() => setVid(undefined)}>
          <ChevronLeftIcon width={30} />
        </button>
      </div>
      <div className="flex flex-col gap-4 h-full">
        <div className="w-full">
          <h3>Email</h3>
          {/* <input
            className={`rounded-md w-full py-1 px-2 border border-neutral-300 outline-none`}
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /> */}
          <Select
            disabled={activeV?.id !== "new"}
            onValueChange={(e) => {
              setEmail(e);
            }}
            triggerStyles={`border bg-white border-neutral-200 rounded-lg w-full ${
              activeV?.id !== "new" ? "opacity-60" : ""
            }`}
            contentStyles="border bg-white border-neutral-200 rounded-lg"
            value={email}
            selectList={vlist}
          />
        </div>
        <div className="">
          <h3>Role</h3>
          <RadioGroup<"member" | "owner">
            itemStyles="w-7 h-7"
            items={[
              { display: "Member", value: "member" },
              { display: "Owner", value: "owner" },
            ]}
            value={role}
            onValueChange={(e) => setRole(e)}
          />
        </div>

        <button
          // disabled={!edit || !dirty}
          className="p-2 w-full md:w-10/12 mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
          onClick={() => {
            if (id === "new") {
              const vendorId = vendors.find(
                (vendor) => email === vendor.email
              )?.id;
              mutate({
                type: "add",
                payload: {
                  id: vendorId || "",
                  email,
                  role,
                  status: activeV?.status || "active",
                },
              });
            } else {
              mutate({
                type: "add",
                payload: {
                  id,
                  email,
                  role,
                  status: activeV.status,
                },
              });
            }
          }}
        >
          Save
        </button>
      </div>
      {/* buttons */}
      {id !== "new" && (
        <div className="w-10/12 mx-auto space-y-3">
          <button
            type="submit"
            className="p-2 w-full mx-auto bg-amber-400 text-white rounded-lg 
                  disabled:bg-neutral-400 hover:bg-amber-500"
            onClick={() =>
              mutate({
                type: "add",
                payload: {
                  id,
                  email,
                  role,
                  status: activeV.status === "active" ? "disabled" : "active",
                },
              })
            }
          >
            Disable
          </button>

          <button
            // disabled={!edit || !dirty}
            type="submit"
            className="p-2 w-full mx-auto bg-red-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-red-500"
            onClick={() => mutate({ type: "remove", payload: { id } })}
          >
            Remove
          </button>
        </div>
      )}
    </>
  );
};

export default StoreComponent;
