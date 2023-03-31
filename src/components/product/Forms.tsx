import InputTemp, { TextareaTemp } from "@components/InputTemp";
import AlertDialog from "@components/radix/Alert";
import Select from "@components/radix/Select";
import Switch from "@components/radix/Switch";
import { TDivider, THStack, TStack } from "@components/TElements";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Product } from "@prisma/client";
import type { FieldInputProps, FormikErrors, FormikTouched } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { type ProductPayload } from "src/server/schema";
import { api } from "utils/api";
import { type MutateValues, type FormValues } from "utils/placeholders";

interface Props {
  getFieldProps: <Value = any>(props: any) => FieldInputProps<Value>;
  touched: FormikTouched<FormValues>;
  errors: FormikErrors<FormValues>;
}

interface PropsPlus extends Props {
  pid: string | undefined;
  mutate: (values: MutateValues) => Promise<Product>;
  values: FormValues;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  setFieldError: (field: string, message: string | undefined) => void;
}

export const Form1 = ({ getFieldProps, touched, errors }: Props) => {
  return (
    <div className="rounded-lg bg-white p-2 col-span-5 row-span-2 h-full space-y-1">
      <h3>Product Title and Description</h3>
      <TDivider />
      <TextareaTemp
        fieldProps={getFieldProps("title")}
        style={{}}
        heading="Product Title"
        placeholder="Enter Product Title"
        rows={2}
        touched={touched.title}
        error={errors.title}
      />

      <TextareaTemp
        fieldProps={getFieldProps("description")}
        heading="Product Description"
        rows={4}
        placeholder="Enter Product Description"
        touched={touched.description}
        error={errors.description}
      />
    </div>
  );
};

export const Form2 = ({
  getFieldProps,
  touched,
  errors,
  pid,
  mutate,
  values,
  setFieldValue,
  setFieldError,
}: PropsPlus) => {
  const router = useRouter();
  const { data: categories } = api.category.many.useQuery({ tid: 3 });

  const { mutate: remove } = api.product.delete.useMutation({
    onSuccess: () => setTimeout(() => router.replace("/products"), 300),
  });

  const catList =
    categories?.map((cat) => ({
      item: cat.name,
      value: cat.id,
    })) || [];

  return (
    <TStack className="rounded-lg p-2 col-span-2 row-span-5 bg-white">
      <h3>Product Info</h3>
      <TDivider />
      <InputTemp
        type="text"
        fieldProps={getFieldProps("brand")}
        style={{}}
        heading="Brand"
        placeholder="Manufacturer / Brand"
        touched={touched.brand}
        error={errors.brand}
      />

      <Select
        required
        placeholder="Select category"
        onValueChange={(e) => {
          e && setFieldValue("category", e);
          values.category && setFieldError("category", undefined);
        }}
        value={values.category}
        disabled={catList.length < 1}
        selectList={catList}
        contentStyles="bg-white"
        triggerStyles="border-200 rounded-lg bg-neutral-100"
      />
      {errors.category && <p>{errors.category}</p>}

      <THStack className="items-center p-2">
        <InputTemp
          type="number"
          fieldProps={getFieldProps("price")}
          style={{}}
          heading="Price"
          touched={touched.price}
          error={errors.price}
        />

        <InputTemp
          type="number"
          fieldProps={getFieldProps("stock")}
          style={{}}
          heading="Stock"
          touched={touched.stock}
          error={errors.stock}
        />
      </THStack>

      <TextareaTemp
        heading="Package"
        rows={4}
        fieldProps={getFieldProps("package")}
        placeholder="Enter contents sperated by semi-colon, contents written
                 together would exists as a single word"
        touched={touched.package}
        error={errors.package}
      />

      <TagsComponent
        name="tags"
        tags={values.tags}
        setFieldValue={setFieldValue}
      />

      <div className="space-y-3 flex-1">
        <h3 className="border-b border-b-neutral-200">Specifications</h3>
        <InputTemp
          fieldProps={getFieldProps("specs.model")}
          style={{}}
          heading="Model"
          touched={touched.specs?.model}
          error={errors.specs?.model}
        />

        <TagsComponent
          name="specs.others"
          tags={values.specs.others}
          setFieldValue={setFieldValue}
          placeholder="Other specs"
        />
      </div>

      {pid !== "new" ? (
        <div className="flex gap-2">
          <AlertDialog
            action={values.status === "active" ? "Disable" : "Enable"}
            title={`Are you sure you want to ${
              values.status === "active" ? "disable" : "enable"
            } this product?`}
            trigger={values.status === "active" ? "disable" : "enable"}
            triggerStyles="py-1 w-11/12 mx-auto rounded-lg
                   bg-amber-400 hover:bg-amber-500 text-white"
            onClickConfirm={() =>
              mutate({
                details: {
                  status: values.status === "active" ? "disabled" : "active",
                },
              })
            }
          />
          <AlertDialog
            action="Delete"
            title="Are you sure you want to delete this product?"
            trigger="delete"
            triggerStyles="py-1 w-11/12 mx-auto rounded-lg
                   bg-red-500 hover:bg-red-600 text-white"
            onClickConfirm={() => pid && remove({ pid })}
          />
        </div>
      ) : null}
    </TStack>
  );
};

interface TagProps {
  tags: string[];
  setFieldValue: PropsPlus["setFieldValue"];
  name: string;
  placeholder?: string;
}

const TagsComponent = ({
  tags,
  setFieldValue,
  name,
  placeholder = "Enter tag",
}: TagProps) => {
  const [tag, setTag] = useState("");
  return (
    <div className="border-200 rounded-lg p-2">
      <div className="flex gap-4">
        <input
          disabled={tags.length > 4}
          value={tag}
          maxLength={11}
          placeholder={placeholder}
          onChange={(e) => setTag(e.target.value)}
        />
        <button
          disabled={tag.length < 2 || tag.length > 10}
          type="button"
          className="rounded-full p-1 bg-amber-400 text-white 
          disabled:opacity-70 hover:bg-amber-500"
          onClick={() => {
            setTag("");
            setFieldValue(name, [...tags.filter((tg) => tag !== tg), tag]);
          }}
        >
          <PlusIcon width={20} />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="border-200 rounded-lg p-2 mt-2 flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 rounded-lg bg-teal-400 px-3 py-1 text-white text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() =>
                  setFieldValue(
                    name,
                    tags.filter((tg) => tag !== tg)
                  )
                }
              >
                <XMarkIcon width={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
