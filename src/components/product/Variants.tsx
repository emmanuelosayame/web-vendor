import InputTemp from "@components/InputTemp";
import { TDivider, TFlex } from "@components/TElements";
import { ArchiveBoxXMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Props {}

const Variants = ({}: Props) => {
  return (
    <>
      <div className="rounded-lg p-2 col-span-7 row-span-2 h-full bg-white">
        <h3>Product Variants</h3>
        <TDivider />
        <div className="flex flex-col p-2 md:grid md:grid-cols-2 lg:grid-cols-3">
          <div className="border-200 rounded-lg h-full p-2">
            <div className="w-full flex gap-2">
              <InputTemp heading="Title" placeholder="Enter title" />
              <InputTemp
                heading="Price"
                type={"number"}
                placeholder="Enter price"
              />
            </div>
            <p className="mt-2">Options</p>
            <Options appendOption={() => {}} />

            <div className="flex gap-2">
              <div className="w-full p-2 border-200 rounded-lg">
                <p className="opacity-70">Entered fields appear here</p>
              </div>
              <div className="w-fit">
                <TFlex className="pb-2 items-center gap-2 justify-center">
                  <button
                    type="button"
                    className="text-orange-500 rounded-full p-1.5 ml-2 bg-orange-200 drop-shadow-md"
                  >
                    <PlusIcon width={20} />
                  </button>
                  <button
                    type="button"
                    className="text-orange-500 rounded-full p-1.5 bg-orange-200 drop-shadow-md"
                  >
                    <ArchiveBoxXMarkIcon width={20} />
                  </button>
                </TFlex>
                <div
                  className="w-40 h-40 rounded-lg bg-black/60 flex justify-center items-center
                   text-white"
                >
                  <p>upload image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Options = ({
  appendOption,
}: {
  appendOption: (k: string, v: string) => void;
}) => {
  const [{ k, v }, setValues] = useState({ k: "", v: "" });

  const add = () => {
    setValues({ k: "", v: "" });
    appendOption(k, v);
  };

  return (
    <div className="flex gap-2 mb-3">
      <input
        className="border-200 rounded-lg p-1 w-[40%]"
        placeholder="Enter Field"
        value={k}
        onChange={(e) =>
          setValues((state) => ({ v: state.v, k: e.target.value }))
        }
        maxLength={100}
      />
      :
      <input
        className="border-200 rounded-lg p-1 w-[60%]"
        placeholder="Enter Value"
        value={v}
        onChange={(e) =>
          setValues((state) => ({ k: state.k, v: e.target.value }))
        }
        maxLength={100}
      />
      <button
        disabled={!(k.length > 2 && v.length > 2)}
        className="text-orange-500 rounded-full p-2 bg-orange-200 drop-shadow-md disabled:opacity-50"
        onClick={add}
      >
        <PlusIcon width={20} />
      </button>
    </div>
  );
};

export default Variants;
