import InputTemp, { TextareaTemp } from "@components/InputTemp";
import Layout from "@components/Layout";
import { LoadingBlur } from "@components/Loading";
import AlertDialog from "@components/radix/Alert";
import Toast, { useToastTrigger } from "@components/radix/Toast";
import {
  IconButton,
  MenuFlex,
  TDivider,
  TFlex,
  THStack,
  TStack,
} from "@components/TElements";
import {
  ArchiveBoxXMarkIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Product } from "@prisma/client";
import { diff } from "deep-object-diff";
import { Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type ProductUpdate } from "src/server/schema";
import { api } from "utils/api";
import { productPLD } from "utils/placeholders";
import { productVs } from "utils/validation";
import { type NextPageWithLayout } from "../_app";

interface RawPU
  extends Omit<ProductUpdate, "tags" | "category" | "imageFiles"> {
  imageFiles: { id: string; file: File }[];
  tags: string;
  category: string;
}

const imagesPH = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

const ProductPage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id?.toString();
  const inputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  const { data, isFetching, isLoading, error } = api.product.one.useQuery(
    { id },
    {
      enabled: !!id && id !== "new",
      placeholderData: productPLD,
      onSuccess: (data) =>
        setIP(
          imagesPH.map((imagePH) => {
            const serverUrl =
              data?.images?.find(
                (url, index) => imagePH.id === index.toString()
              ) || "";
            return { id: imagePH.id, url: "" };
          })
        ),
    }
  );

  const { images, status, specs, tags, ...rest } = data || {};

  const [imagesPrev, setIP] = useState<{ id: string; url: string }[]>(
    imagesPH.map((imagePH) => {
      return { id: imagePH.id, url: "" };
    })
  );

  const [currentG, setCG] = useState<string | undefined>();

  const handleGC = (id: string, file: File) => {
    const currentPrev = imagesPrev.find((prev) => prev.id === id);
    if (currentPrev && currentPrev.url.slice(0, 5) === "blob:")
      URL.revokeObjectURL(currentPrev.url);
    const updatedIP = { id, url: URL.createObjectURL(file) };
    setIP((state) => [...state.filter((prev) => prev.id !== id), updatedIP]);
  };

  const removeGallery = (id: string) => {
    const currentPrev = imagesPrev.find((prev) => prev.id === id);
    const serverUrl =
      images?.find((url, index) => id === index.toString()) || "";
    if (currentPrev && currentPrev.url.slice(0, 5) === "blob:")
      URL.revokeObjectURL(currentPrev.url);
    setIP((state) => [
      ...state.filter((prev) => prev.id !== id),
      { id, url: serverUrl },
    ]);
  };

  const formIV: RawPU = {
    title: data?.title || "",
    brand: data?.brand || "",
    description: data?.description || "",
    package: data?.package || "",
    price: data?.price || 0,
    stock: data?.stock || 0,
    imageFiles: [],
    category: data?.category || "",
    moreDescr: [],
    specs: { model: specs?.model || "", others: specs?.others || "" },
    tags: tags?.join(" ; ") || "",
    status: data?.status || "review",
  };

  const initialValues: Partial<ProductUpdate> = {
    ...formIV,
    imageFiles: [],
    tags: formIV.tags.split(" ; "),
  };

  const qc = api.useContext();

  const { open, setOpen, trigger } = useToastTrigger();

  const { mutate: create, isLoading: creating } =
    api.product.create.useMutation({
      onSuccess: (data) => {
        // qc.product.one.refetch();
        trigger();
        router.replace(`/products/${data.id}`);
      },
    });
  const { mutate, isLoading: mutating } = api.product.update.useMutation({
    onSettled: () => {
      qc.product.one.refetch();
      trigger();
    },
  });
  const save = (values: RawPU) => {
    const { imageFiles, tags, ...rest } = values;
    const payload: ProductUpdate = {
      ...rest,
      imageFiles: imageFiles.map((img) => img.file),
      tags: tags.split(" ; "),
    };
    if (id !== "new") {
      const updatedDetails = diff(initialValues, payload);
      // console.log(updatedDetails);
      mutate({ id, data: updatedDetails as Partial<ProductUpdate> });
    } else {
      create({ data: payload });
    }
  };

  if (error) return <p>{error.message}</p>;

  return (
    <>
      {(isLoading || mutating || creating) && <LoadingBlur />}

      <Toast
        open={open}
        setOpen={setOpen}
        title="Saved"
        description="Product Updated"
        styles=""
      />

      <Formik
        initialValues={formIV}
        validationSchema={productVs}
        onSubmit={save}
        enableReinitialize
      >
        {({ getFieldProps, dirty, touched, errors, values, setFieldValue }) => (
          <Form className="w-full h-full">
            <MenuFlex>
              <IconButton
                type="button"
                onClick={() => router.back()}
                className="bg-white"
              >
                <p>Back</p>
                <XMarkIcon width={20} />
              </IconButton>

              <div className="rounded-lg bg-white py-1 px-2 md:w-28 drop-shadow-md items-center">
                <p
                  className={`text-green-500 text-center w-full font-semibold`}
                >
                  active
                </p>
              </div>

              <IconButton type="submit" className="bg-white" disabled={!dirty}>
                <p>Save</p>
                <CheckIcon width={20} />
              </IconButton>
            </MenuFlex>

            <div className="overflow-y-auto h-full pb-4">
              <div className="flex flex-col md:grid md:grid-cols-7 md:grid-rows-5 gap-3 p-2 bg-white/40 rounded-lg">
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
                    <h3 className="border-b border-b-neutral-200">
                      Specifications
                    </h3>

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

                  {id !== "new" ? (
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
                            id,
                            data: {
                              status:
                                status === "active" ? "disabled" : "active",
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

                <div className="rounded-lg p-2 col-span-5 row-span-3 h-full bg-white">
                  <h3>Product Gallery</h3>
                  <TDivider />
                  <THStack className="relative flex-wrap justify-center gap-5 md:flex-nowrap md:gap-1">
                    <div>
                      <TFlex className="py-2 items-center gap-2">
                        <h3>Thumbnail</h3>
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
                        <p>upload thumbnail</p>
                      </div>
                    </div>
                    <input
                      hidden
                      ref={galleryRef}
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file || !currentG) return;
                        setFieldValue("imageFiles", [
                          ...values.imageFiles.filter(
                            (img) => img.id !== currentG
                          ),
                          { id: currentG, file },
                        ]);
                        handleGC(currentG, file);
                      }}
                    />
                    {imagesPrev
                      .sort((a, b) => Number(a.id) - Number(b.id))
                      .map((image) => (
                        <div key={image.id}>
                          <TFlex className="py-2 items-center gap-2 justify-center">
                            <button
                              type="button"
                              className="text-orange-500 rounded-full p-1.5 ml-2
                         bg-orange-200 drop-shadow-md"
                              onClick={() => {
                                setCG(image.id);
                                galleryRef.current?.click();
                              }}
                            >
                              <PlusIcon width={20} />
                            </button>
                            <button
                              type="button"
                              className="text-orange-500 rounded-full p-1.5 bg-orange-200 drop-shadow-md"
                              onClick={() => {
                                setFieldValue(
                                  "imageFiles",
                                  values.imageFiles.filter(
                                    (img) => img.id !== id
                                  )
                                );
                                removeGallery(image.id);
                              }}
                            >
                              <ArchiveBoxXMarkIcon width={20} />
                            </button>
                          </TFlex>
                          {image.url ? (
                            <Image
                              alt=""
                              src={image.url}
                              width={200}
                              height={200}
                              className="w-40 h-40 rounded-md"
                            />
                          ) : (
                            <div
                              className="w-40 h-40 rounded-lg bg-black/60 flex justify-center items-center
                   text-white"
                            >
                              <p>upload image</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </THStack>
                  <h3 className="mt-3">More Descriptions</h3>
                  <TDivider className="mb-4" />
                  <THStack className="flex-wrap justify-center gap-5 md:flex-nowrap md:gap-1">
                    {imagesPH.slice(0, 2).map((image) => (
                      <div
                        key={image.id}
                        className="flex flex-col md:flex-row gap-2"
                      >
                        <div>
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
                        <div className="w-40 md:w-full">
                          <textarea
                            className="bg-white rounded-lg ring-1 ring-neutral-300 w-full
                         outline-none py-1 px-2 resize-none"
                            placeholder="enter subject"
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                  </THStack>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

ProductPage.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default ProductPage;
