import InputTemp, { TextareaTemp } from "@components/InputTemp";
import Layout from "@components/Layout";
import Avatar from "@components/radix/Avatar";
import {
  IconBack,
  IconButton,
  MenuFlex,
  TDivider,
} from "@components/TElements";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Form, Formik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { useStore } from "store";
import { api } from "utils/api";
import { type NextPageWithLayout } from "../_app";

const Profile: NextPageWithLayout = () => {
  const router = useRouter();
  const saveRef = useRef<HTMLButtonElement | null>(null);
  const colorScheme = useStore((state) => state.colorScheme);
  const changeCS = useStore((state) => state.setColorScheme);

  const { data } = api.vendor.one.useQuery({});

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    location: "",
    address: "",
  };

  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({ dirty, getFieldProps, touched, errors }) => (
        <Form className="w-full">
          <MenuFlex>
            <IconBack>
              <p>Cancel</p>
              <XMarkIcon width={25} />
            </IconBack>

            <IconButton>
              <p>Save</p>
              <CheckIcon width={25} />
            </IconButton>
          </MenuFlex>

          <div className="bg-white/40 backdrop-blur-md rounded-lg p-2">
            <div className="grid grid-cols-6 gap-2 h-full">
              <div className="bg-white rounded-lg p-3 col-span-2 flex flex-col items-center gap-2">
                <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
                  Profile
                </h3>
                {/* <TDivider className="w-full" /> */}
                <Avatar className="w-28 rounded-full mt-2" />
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
                    fieldProps={getFieldProps("laststName")}
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
                <div className="bg-black/10 rounded-lg py-1 px-3 w-full text-sm">
                  <h3>
                    Status : <span className="text-green-500">Active</span>
                  </h3>
                </div>
              </div>
              {/* 2 */}
              <div className="bg-white rounded-lg p-3 col-span-4 ">
                <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
                  Store
                </h3>
                <div className="flex justify-between w-full gap-4 mt-2">
                  <div className="flex gap-3 flex-col w-full items-center">
                    <InputTemp
                      heading="Name"
                      type="text"
                      fieldProps={getFieldProps("location")}
                      touched={touched.location}
                      error={errors.location}
                    />

                    <div className="w-full flex h-40 gap-2 items-center">
                      <div className="bg-black/40 rounded-full w-32 h-32 flex justify-center items-center text-white">
                        <h2>logo</h2>
                      </div>
                      <div className="bg-black/40 rounded-lg w-4/6 h-full flex justify-center items-center text-white">
                        <h2>banner</h2>
                      </div>
                    </div>
                    <div className="bg-black/10 rounded-lg p-2 w-full flex flex-col h-40">
                      <div className="flex-1">
                        <h3 className="bg-white rounded-lg w-fit py-1 px-3">
                          You : <span className="text-green-500">Owner</span>
                        </h3>
                      </div>
                      <div className="border-b border-b-white/70 w-full my-1" />
                      <button className="bg-white py-1 px-3 rounded-lg drop-shadow-md">
                        Add Team
                      </button>
                    </div>

                    <div className="bg-black/10 rounded-lg py-1 px-3 w-full text-sm">
                      <h3>
                        Aspect :{" "}
                        <span className="text-green-500">Electronics</span>
                      </h3>
                    </div>
                  </div>
                  {/* 3 */}

                  <div className="border-l border-l-neutral-300" />

                  <div className="flex flex-col items-center gap-2 w-full">
                    <InputTemp
                      heading="Email"
                      type="email"
                      fieldProps={getFieldProps("email")}
                      touched={touched.email}
                      error={errors.email}
                    />

                    <InputTemp
                      heading="Account Name"
                      type="text"
                      fieldProps={getFieldProps("location")}
                      touched={touched.location}
                      error={errors.location}
                    />
                    <div className="flex items-center gap-3">
                      <InputTemp
                        heading="Account No."
                        type="tel"
                        fieldProps={getFieldProps("phoneNo")}
                        touched={touched.phoneNo}
                        error={errors.phoneNo}
                      />

                      <InputTemp
                        heading="Bank"
                        type="text"
                        fieldProps={getFieldProps("location")}
                        touched={touched.location}
                        error={errors.location}
                      />
                    </div>
                    <h3 className="text-lg text-center border-b border-b-neutral-200 w-full">
                      Support
                    </h3>
                    <div className="flex items-center gap-3">
                      <InputTemp
                        heading="Phone (mobile)."
                        type="tel"
                        fieldProps={getFieldProps("phoneNo")}
                        touched={touched.phoneNo}
                        error={errors.phoneNo}
                      />

                      <InputTemp
                        heading="Phone (whatsapp)"
                        type="text"
                        fieldProps={getFieldProps("location")}
                        touched={touched.location}
                        error={errors.location}
                      />
                    </div>
                    <InputTemp
                      heading="Email"
                      type="email"
                      fieldProps={getFieldProps("email")}
                      touched={touched.email}
                      error={errors.email}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

Profile.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
export default Profile;
