import ErrorScreen from "@components/ErrorScreen";
import { Loading } from "@components/Loading";
import StoreComponent from "@components/StoreComponent";
import { IconBack, IconButton, MenuFlex, TFlex } from "@components/TElements";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { api } from "utils/api";

const CreateStore = () => {
  const [edit, setEdit] = useState(true);

  const { data: accounts, isLoading } = api.vendor.accounts.useQuery({});

  const { status } = useSession();

  if (status === "unauthenticated")
    return (
      <ErrorScreen description="you need to be a registered vendor to create a store" />
    );

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>create store @delorand</title>
      </Head>
      <div className="h-full relative overflow-y-auto bg-blue-600 pt-16 md:pt-16">
        <TFlex className="absolute top-2 inset-x-4 justify-between my-2">
          <IconBack>
            <p>Back</p>
            <PlusIcon width={20} />
          </IconBack>

          <h3 className="text-lg md:text-2xl font-semibold text-white">
            Create Store
          </h3>

          <button
            disabled={accounts && accounts.length > 1}
            className={`py-1 px-4 flex gap-2 items-center h-fit rounded-lg disabled:opacity-50 ${
              edit ? "bg-green-400 text-white" : "bg-white"
            }`}
            onClick={() => setEdit((state) => !state)}
          >
            <p>Edit</p>
            <PencilSquareIcon width={20} />
          </button>
        </TFlex>

        {accounts && accounts.length > 1 ? (
          <div className="flex justify-center items-center h-full p-4">
            <p className="text-lg md:text-xl text-center text-white font-semibold">
              You cannot create more than two stores
            </p>
          </div>
        ) : (
          <StoreComponent edit={edit} id="new" isAdmin={false} />
        )}
      </div>
    </>
  );
};

export default CreateStore;
