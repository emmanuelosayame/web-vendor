import InputTemp, { TextareaTemp } from "@components/InputTemp";
import LayoutA from "@components/Layout/Admin";
import { Loading, LoadingBlur } from "@components/Loading";
import RadioGroup from "@components/radix/RadioGroup";
import { IconBack, IconButton, MenuFlex, THStack } from "@components/TElements";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "utils/api";
import { type NextPageWithLayout } from "../../_app";
import AlertDialog from "@components/radix/Alert";
import { emailV, storeVs } from "utils/validation";
import { identity } from "lodash";
import { limitText } from "utils/helpers";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { type Store, type StoreVendor } from "@prisma/client";
import Select from "@components/radix/Select";
import { useSession } from "next-auth/react";

const StorePage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id?.toString();

  const [edt, setedit] = useState(false);
  const edit = id === "new" ? true : edt;

  const qc = api.useContext();

  const {
    data: store,
    isLoading,
    isFetching,
  } = api.store.one.useQuery(
    { id },
    {
      enabled: !!id && id !== "new",
    }
  );

  const [vid, setVid] = useState<string | undefined>();
  const activeV: StoreVendor | undefined =
    vid !== "new"
      ? store?.vendors.find((vendor) => vid === vendor.id)
      : { id: "new", email: "", role: "member", status: "active" };

  const { mutate: create, isLoading: creating } = api.store.new.useMutation({
    onSuccess: (data) => router.replace(`/admin/stores/${data.id}`),
  });

  const { mutate, isLoading: mutating } = api.store.update.useMutation({
    onSuccess: () => {
      qc.store.one.refetch();
      setVid(undefined);
    },
  });

  const formIV = {
    name: store?.name || "",
    about: store?.about || "",
  };

  if (!identity || isFetching || mutating) return <Loading />;

  if (id !== "new" && !store)
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
            validationSchema={storeVs}
            onSubmit={(values) => {
              if (id === "new") {
                create({ data: values as any });
              } else mutate({ id, data: values });
            }}
          >
            {({ dirty, touched, errors, getFieldProps }) => (
              <Form className="bg-white rounded-lg p-4 space-y-3 w-full h-full flex flex-col">
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

                <TextareaTemp
                  disabled={!edit}
                  fieldProps={getFieldProps("about")}
                  placeholder="About Store"
                  heading="About"
                  rows={3}
                  touched={touched.about}
                  error={errors.about}
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
            {vid ? (
              <VendorForm
                store={store}
                activeV={activeV}
                setVid={setVid}
                mutate={(type, data) => {
                  const vendors =
                    store?.vendors.filter((vendor) => vendor.id !== data.id) ||
                    [];
                  if (type === "remove") {
                    mutate({ id, data: { vendors } });
                  } else {
                    mutate({ id, data: { vendors: [...vendors, data] } });
                  }
                }}
              />
            ) : (
              <>
                <div
                  className={`${
                    id === "new"
                      ? "absolute bg-black/10 w-full h-full rounded-lg inset-0 z-30"
                      : "hidden"
                  } `}
                />
                <h3 className=" rounded-lg p-2 text-lg bg-neutral-100">
                  Status : {store?.status || "..."}
                </h3>

                <div className="h-full">
                  <h3 className="text-lg text-center border-b border-b-neutral-200 mb-3">
                    Team
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {store?.vendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="border border-neutral-200 rounded-lg p-2 col-span-2 md:col-span-1"
                      >
                        <div className="flex justify-between">
                          <p>Email : </p>
                          <p>{limitText(vendor.email, 18)}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Role : </p>
                          <p>{vendor.role}</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Status : </p>
                          <p>{vendor.status}</p>
                        </div>

                        <button
                          // disabled={!edit || !dirty}
                          type="submit"
                          className="p-1 w-full mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
                          onClick={() => setVid(vendor.id)}
                        >
                          Edit Team
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  // disabled={!edit || !dirty}
                  type="submit"
                  className="p-2 w-full md:w-10/12 mx-auto bg-green-400 text-white rounded-lg 
                  disabled:opacity-75 hover:bg-green-500"
                  onClick={() => setVid("new")}
                >
                  Add Team
                </button>

                <AlertDialog
                  trigger={store?.status === "active" ? "Disable" : "Activate"}
                  triggerStyles={`p-2 w-full md:w-10/12 mx-auto text-white rounded-lg
            disabled:opacity-75 ${
              store?.status !== "active"
                ? "hover:bg-blue-600  bg-blue-500"
                : "hover:bg-red-600  bg-red-500"
            }`}
                  action={store?.status === "active" ? "Disable" : "Activate"}
                  title={`Are you sure you want to ${
                    store?.status === "active" ? "disable" : "activate"
                  } this store?`}
                  onClickConfirm={() =>
                    mutate({
                      id,
                      data: {
                        status:
                          store?.status === "active" ? "disabled" : "active",
                      },
                    })
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const VendorForm = ({
  setVid,
  activeV,
  mutate,
  store,
}: {
  setVid: (id?: string) => void;
  activeV?: StoreVendor;
  mutate: (type: "update" | "create" | "remove", data: StoreVendor) => void;
  store?: Store | null;
}) => {
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

  return (
    <>
      <div className="flex p-1">
        <button onClick={() => setVid(undefined)}>
          <ChevronLeftIcon width={30} />
        </button>
      </div>
      {/* vendor {vid} */}
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
            if (activeV?.id && activeV?.id === "new") {
              const vendorId = vendors.find(
                (vendor) => email === vendor.email
              )?.id;
              mutate("update", {
                id: vendorId || "",
                email,
                role,
                status: activeV?.status || "active",
              });
            } else {
              mutate("create", {
                id: activeV?.id || "",
                email,
                role,
                status: activeV?.status || "active",
              });
            }
          }}
        >
          Save
        </button>
      </div>
      {/* buttons */}
      <div className="w-10/12 mx-auto space-y-3">
        <button
          type="submit"
          className="p-2 w-full mx-auto bg-amber-400 text-white rounded-lg 
                  disabled:bg-neutral-400 hover:bg-amber-500"
          onClick={() =>
            mutate("update", {
              email: activeV?.email || "",
              role: activeV?.role || "member",
              id: activeV?.id || "",
              status: activeV?.status === "active" ? "disabled" : "active",
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
          onClick={() =>
            mutate("remove", {
              id: activeV?.id || "",
              email: "",
              role: "member",
              status: "active",
            })
          }
        >
          Remove
        </button>
      </div>
    </>
  );
};

StorePage.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};
export default StorePage;
