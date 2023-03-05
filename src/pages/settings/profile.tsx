import InputTemp, { TextareaTemp } from "@components/InputTemp";
import Layout from "@components/Layout";
import { Loading, LoadingBlur } from "@components/Loading";
import Avatar from "@components/radix/Avatar";
import Select from "@components/radix/Select";
import {
  IconBack,
  IconButton,
  MenuFlex,
  TDivider,
} from "@components/TElements";
import {
  CheckIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { diff } from "deep-object-diff";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useStore } from "store";
import { type CSNames } from "types/shared";
import { api } from "utils/api";
import { csToStyle } from "utils/helpers";
import { vendorVs } from "utils/validation";
import { type NextPageWithLayout } from "../_app";

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const qc = api.useContext();
  const saveRef = useRef<HTMLButtonElement | null>(null);
  const colorScheme = useStore((state) => state.colorScheme);
  const { bg, text } = csToStyle(colorScheme);
  const changeCS = useStore((state) => state.setColorScheme);

  const csList = [
    { item: "Montery", value: "montery" },
    { item: "Sierra", value: "sierra" },
    { item: "Alice", value: "alice" },
    { item: "Greenade", value: "greenade" },
    { item: "PurpleIsle", value: "purpleIsle" },
  ];

  const { data, isLoading } = api.vendor.one.useQuery({});

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
          <div className="bg-white rounded-lg p-3 w-full md:w-1/3"></div>
          <Formik
            initialValues={profileIV}
            validationSchema={vendorVs}
            onSubmit={onSubmit}
          >
            {({ dirty, getFieldProps, touched, errors }) => (
              <Form className="bg-white rounded-lg p-3 w-full md:w-1/3 flex flex-col items-center gap-2">
                <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
                  Profile
                </h3>
                <Avatar
                  className="w-28 rounded-full mt-2"
                  src={data?.photoUrl}
                />
                <div className="flex items-center gap-3">
                  <InputTemp
                    heading="Firstname"
                    type="text"
                    fieldProps={getFieldProps("firstName")}
                    touched={touched.firstName}
                    error={errors.firstName}
                  />

                  <InputTemp
                    heading="Lastname"
                    type="text"
                    fieldProps={getFieldProps("lastName")}
                    touched={touched.lastName}
                    error={errors.lastName}
                  />
                </div>

                <InputTemp
                  heading="Email"
                  type="email"
                  fieldProps={getFieldProps("email")}
                  touched={touched.email}
                  error={errors.email}
                />

                <div className="flex items-center gap-3">
                  <InputTemp
                    heading="Phone"
                    type="tel"
                    fieldProps={getFieldProps("phoneNo")}
                    touched={touched.phoneNo}
                    error={errors.phoneNo}
                  />

                  <InputTemp
                    heading="Location"
                    type="text"
                    fieldProps={getFieldProps("location")}
                    touched={touched.location}
                    error={errors.location}
                  />
                </div>

                <TextareaTemp
                  rows={2}
                  fieldProps={getFieldProps("address")}
                  heading="Address"
                  touched={touched.address}
                  error={errors.address}
                />
                {/* <div className="bg-black/10 rounded-lg py-1 px-3 w-full text-sm">
                  <h3>
                    Status : <span className="text-green-500">Active</span>
                  </h3>
                </div> */}
                <button
                  disabled={!dirty}
                  type="submit"
                  className="p-2 text-white rounded-lg disabled:opacity-50 bg-green-500 w-full"
                >
                  Save
                </button>
              </Form>
            )}
          </Formik>
          {/* 2 */}
          <div className="bg-white rounded-lg p-3 w-full md:w-1/3">
            <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
              Preference
            </h3>
            <p className="my-2">Color Scheme</p>
            <Select<CSNames>
              contentStyles="bg-white"
              triggerStyles={`border border-neutral-200
               rounded-lg w-full ${bg} bg-opacity-70 text-white`}
              defaultSelected={colorScheme}
              onValueChange={(value) => changeCS(value)}
              selectList={csList}
            />
          </div>
        </div>
      </div>
    </>
  );
};

Profile.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export default Profile;
