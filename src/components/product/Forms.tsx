import { InputTemp, TextareaTemp } from "@components/InputTemp";
import AlertDialog from "@components/radix/Alert";
import Select from "@components/radix/Select";
import Switch from "@components/radix/Switch";
import { TDivider, THStack, TStack } from "@components/TElements";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@lib/api";
import { type MutateValues, type FormValues } from "@lib/placeholders";
import type {
  FieldErrors,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";

interface Props {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
}

interface PropsPlus extends Props {
  pid: string | undefined;
  mutate: (values: MutateValues) => Promise<Product>;
  getValues: UseFormGetValues<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  setError: UseFormSetError<FormValues>;
  clearErrors: UseFormClearErrors<FormValues>;
}

export const Form1 = ({ register, errors }: Props) => {
  return (
    <div className="rounded-lg bg-white p-2 col-span-5 row-span-2 h-full space-y-1">
      <h3>Product Title and Description</h3>
      <TDivider />
      <TextareaTemp
        {...register("title")}
        label="Product Title"
        placeholder="Enter Product Title"
        rows={2}
        error={errors.title?.message?.toString()}
      />

      <TextareaTemp
        {...register("description")}
        label="Product Description"
        rows={5}
        placeholder="Enter Product Description"
        error={errors.description?.message?.toString()}
      />
    </div>
  );
};

export const Form2 = ({
  errors,
  pid,
  mutate,
  getValues,
  setValue,
  setError,
  clearErrors,
  register,
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
        {...register("brand")}
        label="Brand"
        placeholder="Manufacturer / Brand"
        error={errors.brand?.message?.toString()}
      />

      <Select
        required
        placeholder="Select category"
        onValueChange={(e) => {
          e && setValue("category", e);
          getValues("category") && clearErrors("category");
        }}
        value={getValues("category")}
        disabled={catList.length < 1}
        selectList={catList}
        contentStyles="bg-white"
        triggerStyles="border-200 rounded-lg bg-neutral-100"
      />
      {errors.category && <p>{errors.category?.message?.toString()}</p>}

      <THStack className="items-center p-2">
        <InputTemp
          type="number"
          {...register("price")}
          label="Price"
          error={errors.price?.message?.toString()}
        />

        <InputTemp
          type="number"
          {...register("stock")}
          label="Stock"
          error={errors.stock?.message?.toString()}
        />
      </THStack>

      {/* <TextareaTemp
        heading="Package"
        rows={2}
        fieldProps={getFieldProps("package")}
        placeholder="Enter contents sperated by semi-colon, contents written
                 together would exists as a single word"
        error={errors.package}
      /> */}

      <div className="">
        <h3>Package</h3>
        <TagsComponent
          name="package"
          tags={getValues("package")}
          setValue={setValue}
          placeholder="Enter Package"
        />
      </div>

      <div className="">
        <h3>Tags</h3>
        <TagsComponent
          name="tags"
          tags={getValues("tags")}
          setValue={setValue}
        />
      </div>

      <div className="space-y-3 flex-1">
        <h3 className="border-b border-b-neutral-200">Specifications</h3>
        <InputTemp
          {...register("specs.model")}
          label="Model"
          error={errors.specs?.model?.message?.toString()}
        />

        <TagsComponent
          name="specs.others"
          tags={getValues("specs.others")}
          setValue={setValue}
          placeholder="Other specs"
        />
      </div>

      {pid !== "new" ? (
        <div className="flex gap-2">
          <AlertDialog
            action={getValues("status") === "active" ? "Disable" : "Enable"}
            title={`Are you sure you want to ${
              getValues("status") === "active" ? "disable" : "enable"
            } this product?`}
            trigger={getValues("status") === "active" ? "disable" : "enable"}
            triggerStyles="py-1 w-11/12 mx-auto rounded-lg
                   bg-amber-400 hover:bg-amber-500 text-white"
            onClickConfirm={() =>
              mutate({
                details: {
                  status:
                    getValues("status") === "active" ? "disabled" : "active",
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
  setValue: PropsPlus["setValue"];
  name: any;
  placeholder?: string;
}

const TagsComponent = ({
  tags,
  setValue,
  name,
  placeholder = "Enter tag",
}: TagProps) => {
  const [tag, setTag] = useState("");
  return (
    <div className="border-200 rounded-lg py-1 px-2">
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
            setValue(name, [...tags.filter((tg) => tag !== tg), tag]);
          }}
        >
          <PlusIcon width={20} />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="border-200 rounded-lg px-2 py-1 mt-1 flex gap-2 flex-wrap">
          {tags.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 rounded-lg bg-teal-400 px-3 py-0.5
               text-white text-sm font-semibold"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() =>
                  setValue(
                    name,
                    tags.filter((tg) => tag !== tg)
                  )
                }
              >
                <XMarkIcon width={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
