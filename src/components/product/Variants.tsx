import InputTemp from "@components/InputTemp";
import AlertDialog from "@components/radix/Alert";
import { TDivider, TFlex } from "@components/TElements";
import {
  ArchiveBoxXMarkIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  type FormikErrors,
  type FormikTouched,
  type FieldInputProps,
  FieldArray,
} from "formik";
import { useMemo, useState } from "react";
import { vPlaceholder, type FormValues } from "utils/placeholders";

interface Props {
  variants: FormValues["variants"];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  getFieldProps: <Value = any>(props: any) => FieldInputProps<Value>;
  touched: FormikTouched<FormValues>;
  errors: FormikErrors<FormValues>;
  serverVariants: any[];
}

const Variants = ({
  variants,
  setFieldValue,
  getFieldProps,
  errors,
  touched,
  serverVariants,
}: Props) => {
  const variantErrors = errors.variants as any;
  return (
    <FieldArray name="variants">
      {({ pop, push, remove }) => (
        <div className="rounded-lg p-2 col-span-7 row-span-2 h-full bg-white flex flex-col">
          {variants.length < 1 ? (
            <div className="flex items-center gap-3 mx-auto">
              <button
                className="btn-green px-4"
                onClick={() => push(vPlaceholder)}
              >
                Add Variant
              </button>

              {serverVariants.length > 0 && (
                <button
                  className="bg-blue-500 px-4 py-2 text-white rounded-lg"
                  onClick={() => setFieldValue("variants", serverVariants)}
                >
                  Restore
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex w-full justify-between px-2 py-1">
                <h3>Product Variants</h3>
                {serverVariants.length < 1 ? (
                  <button
                    className="btn-red py-1 px-4 w-fit mx-auto"
                    onClick={() => setFieldValue("variants", [])}
                  >
                    Cancel
                  </button>
                ) : (
                  <AlertDialog
                    action="Remove all"
                    trigger="Remove"
                    triggerStyles="btn-red w-fit py-1"
                    title="Are you sure you want to remove all variants from this product?"
                    onClickConfirm={() => setFieldValue("variants", [])}
                  />
                )}
                <button
                  disabled={variants.length > 4}
                  onClick={() => push(vPlaceholder)}
                  type="button"
                  className="disabled:opacity-40"
                >
                  <PlusIcon width={30} />
                </button>
              </div>
              <TDivider />
              <div className="flex flex-col p-2 md:grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                {variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border-200 rounded-lg h-full p-2 relative"
                  >
                    <button
                      type="button"
                      className="py-1 px-3 mx-auto flex gap-2 rounded-xl hover:bg-red-600
                     bg-red-500 text-white text-sm items-center"
                      onClick={() => remove(index)}
                    >
                      <p>remove</p>
                      <XMarkIcon width={20} />
                    </button>
                    <div className="w-full flex gap-2">
                      <InputTemp
                        heading="Title"
                        placeholder="Enter title"
                        fieldProps={getFieldProps(`variants[${index}].title`)}
                        touched={
                          touched.variants && touched.variants[index]?.title
                        }
                        error={errors.variants && variantErrors[index]?.title}
                      />
                      <InputTemp
                        heading="Price"
                        type={"number"}
                        placeholder="Enter price"
                        fieldProps={getFieldProps(`variants[${index}].price`)}
                        touched={
                          touched.variants && touched.variants[index]?.price
                        }
                        error={errors.variants && variantErrors[index]?.price}
                      />
                    </div>
                    <p className="mt-2">Options</p>
                    <Options
                      index={index}
                      setFieldValue={setFieldValue}
                      options={variant.options}
                    />

                    <div className="space-y-2 md:flex gap-2 md:max-h-56">
                      <div className="w-full md:w-3/5 p-2 border-200 rounded-lg overflow-y-auto">
                        {variant.options.length < 1 ? (
                          <p className="opacity-30">
                            Entered fields appear here
                          </p>
                        ) : (
                          <>
                            {variant.options.map((option) => (
                              <div
                                key={option.k}
                                className="text-sm flex gap-3 flex-wrap border-b border-neutral-200 break words whitespace-normal break-all relative items-center p-1"
                              >
                                <p>{option.k} :</p>
                                <p className="">{option.v}</p>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFieldValue(
                                      `variants[${index}].options`,
                                      [
                                        ...variant.options.filter(
                                          (opt) => option.k !== opt.k
                                        ),
                                      ]
                                    )
                                  }
                                  className="absolute center-y right-0 z-30
                                 bg-red-500/70 hover:bg-red-500 rounded-full p-0.5 text-white shadow-lg"
                                >
                                  <TrashIcon width={15} />
                                </button>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                      <div className="w-fit mx-auto">
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
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </FieldArray>
  );
};

const Options = ({
  options,
  setFieldValue,
  index,
}: {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  index: number;
  options: { k: string; v: string }[];
}) => {
  const [{ k, v }, setValues] = useState({ k: "", v: "" });

  const add = () => {
    setValues({ k: "", v: "" });
    setFieldValue(`variants[${index}].options`, [
      ...options.filter((opt) => k !== opt.k),
      { k, v },
    ]);
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
        type="button"
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
