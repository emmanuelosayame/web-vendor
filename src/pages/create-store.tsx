import StoreComponent from "@components/StoreComponent";
import { IconBack, IconButton, MenuFlex, TFlex } from "@components/TElements";
import { PencilSquareIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const CreateStore = () => {
  const [edit, setEdit] = useState(true);

  return (
    <div className="h-full relative overflow-y-auto bg-blue-600 pt-16 md:pt-16">
      <TFlex className="absolute top-2 inset-x-4 justify-between my-2">
        <IconBack>
          <p>Back</p>
          <PlusIcon width={20} />
        </IconBack>

        <h3 className="text-2xl font-semibold text-white">Create Store</h3>

        <button
          className={`py-1 px-4 flex gap-2 items-center h-fit rounded-lg ${
            edit ? "bg-green-400 text-white" : "bg-white"
          }`}
          onClick={() => setEdit((state) => !state)}
        >
          <p>Edit</p>
          <PencilSquareIcon width={20} />
        </button>
      </TFlex>

      <StoreComponent edit={edit} id="new" isAdmin={false} />
    </div>
  );
};

export default CreateStore;
