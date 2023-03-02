import InputTemp, { TextareaTemp } from "@components/InputTemp";
import AlertDialog from "@components/radix/Alert";
import { TDivider, THStack, TStack } from "@components/TElements";
import type { FieldInputProps, FormikErrors, FormikTouched } from "formik";
import { useRouter } from "next/router";
import { type ProductPayload } from "src/server/schema";
import { type FormValues } from "utils/placeholders";

interface Props {
  getFieldProps: <Value = any>(props: any) => FieldInputProps<Value>;
  touched: FormikTouched<FormValues>;
  errors: FormikErrors<FormValues>;
}

interface PropsPlus extends Props {
  pid: string | undefined;
  mutate: (values: { id?: string; data: Partial<ProductPayload> }) => void;
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
}: PropsPlus) => {
  const router = useRouter();
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

      <InputTemp
        type="text"
        fieldProps={getFieldProps("category")}
        style={{}}
        heading="Category"
        placeholder="Product Category"
        touched={touched.category}
        error={errors.category}
      />

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
      <TextareaTemp
        heading="Tags"
        rows={4}
        fieldProps={getFieldProps("tags")}
        placeholder="Enter tags sperated by semi-colon, tags written together would exists as a single word"
        touched={touched.tags}
        error={errors.tags}
      />
      <div className="">
        <h3 className="border-b border-b-neutral-200">Specifications</h3>

        <InputTemp
          fieldProps={getFieldProps("specs.model")}
          style={{}}
          heading="Model"
          touched={touched.specs?.model}
          error={errors.specs?.model}
        />

        <TextareaTemp
          heading="Other Specs"
          rows={4}
          fieldProps={getFieldProps("specs.others")}
          placeholder="Enter tags sperated by semi-colon, tags written together would exists as a single word"
          touched={touched.specs?.others}
          error={errors.specs?.others}
        />
      </div>

      {pid !== "new" ? (
        <>
          <AlertDialog
            action={status === "active" ? "Disable" : "Enable"}
            title={`Are you sure you want to ${
              status === "active" ? "disable" : "enable"
            } this product?`}
            trigger={status === "active" ? "disable" : "enable"}
            triggerStyles="py-1 w-11/12 mx-auto rounded-lg
                   bg-amber-400 hover:bg-amber-500 text-white"
            onClickConfirm={() =>
              mutate({
                id: pid,
                data: {
                  status: status === "active" ? "disabled" : "active",
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
            onClickConfirm={() => {
              setTimeout(() => router.replace("/products"), 300);
            }}
          />
        </>
      ) : null}
    </TStack>
  );
};
