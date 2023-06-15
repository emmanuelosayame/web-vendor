import { InputTemp, TextareaTemp } from "@components/InputTemp";
import { Loading, LoadingBlur } from "@components/Loading";
import RadioGroup from "@components/radix/RadioGroup";
import { IconBack, IconButton, MenuFlex, THStack } from "@components/TElements";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@lib/api";
import { type NextPageWithLayout } from "t/shared";
import AlertDialog from "@components/radix/Alert";
import { emailV, storeVs } from "@lib/validation";
import { identity } from "lodash";
import { limitText } from "@lib/helpers";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { type Store, type StoreVendor } from "@prisma/client";
import Select from "@components/radix/Select";
import { useSession } from "next-auth/react";
import StoreComponent from "@components/StoreComponent";
import { initialSD } from "@lib/placeholders";

const StorePage: NextPageWithLayout = () => {
  const id = useParams()?.id?.toString();

  const [edt, setedit] = useState(false);
  const edit = id === "new" ? true : edt;

  const {
    data: store,
    isLoading,
    isFetching,
  } = api.store.oneA.useQuery(
    { id },
    {
      enabled: !!id && id !== "new",
      initialData: initialSD,
    }
  );

  if (!id || isFetching) return <Loading />;

  if (id !== "new" && !store)
    return (
      <div className="bg-white w-2/5 rounded-lg mx-auto flex justify-center p-4">
        Something went wrong
      </div>
    );

  return (
    <>
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
        <StoreComponent
          edit={edit}
          store={store}
          id={id === "new" ? id : "fetch"}
          isAdmin
        />
      </div>
    </>
  );
};

export default StorePage;
