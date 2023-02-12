import InputTemp, { TextareaTemp } from "@components/InputTemp";
import Layout from "@components/Layout";
import Select from "@components/radix/Select";
import {
  IconButton,
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
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { diff } from "deep-object-diff";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { api } from "utils/api";

const Product = () => {
  const router = useRouter();
  const id = router.query.product?.toString();
  const inputRef = useRef<HTMLInputElement>(null);

  const [sort, setSort] = useState<{ key?: string; value: string }>({
    value: "A-Z",
  });

  const { data } = api.product.one.useQuery(
    { id },
    {
      placeholderData: {
        brand: "",
        category: [],
        description: "",
        discountPercentage: 0,
        id: "",
        price: 0,
        promotion: [],
        rating: 0,
        shortDescription: "",
        status: "",
        stock: 0,
        tags: [],
        title: "",
      },
    }
  );

  const { ...rest } = data || {};

  const { mutate } = api.product.update.useMutation();

  const save = (values: {}) => {
    const updatedDetails = diff(rest, values);
    mutate({ id, data: updatedDetails });
  };

  return (
    <Formik initialValues={rest} onSubmit={save} enableReinitialize>
      {({ getFieldProps, dirty, errors }) => (
        <Form className="w-full">
          <div className="flex justify-between w-full px-3 py-2">
            <IconButton
              type="button"
              onClick={() => router.back()}
              className="bg-white"
            >
              <p>Back</p>
              <XMarkIcon width={20} />
            </IconButton>

            <div className="rounded-lg bg-white py-1 px-2 md:w-28 drop-shadow-md items-center">
              <p className={`text-green-500 text-center w-full font-semibold`}>
                published
              </p>
            </div>

            <IconButton type="submit" className="bg-white" disabled={!dirty}>
              <p>Save</p>
              <CheckIcon width={20} />
            </IconButton>
          </div>

          <div className="grid grid-cols-7 grid-rows-4 gap-3 p-3">
            <div className="rounded-lg bg-white p-2 col-span-5 row-span-2 h-full space-y-1">
              <h3>Product Title and Description</h3>
              <TDivider />
              <InputTemp
                type="text"
                fieldProps={getFieldProps("title")}
                style={{
                  heading: { fontWeight: 500, mt: "2" },
                  input: { bgColor: "blackAlpha.50" },
                }}
                heading="Product Title"
                placeholder="title"
              />

              <TextareaTemp
                heading="Short Description"
                fieldProps={getFieldProps("shortDescription")}
                placeholder="this description should act a as preview of the product"
              />

              <TextareaTemp
                fieldProps={getFieldProps("description")}
                heading="Product Description"
                rows={4}
                placeholder="description"
              />
            </div>

            <TStack className="rounded-lg p-2 col-span-2 row-span-3 bg-white">
              <h3>Product Info</h3>
              <TDivider />
              <InputTemp
                type="text"
                fieldProps={getFieldProps("brand")}
                style={{
                  heading: { fontWeight: 500 },
                  input: { bgColor: "blackAlpha.50" },
                }}
                heading="Brand"
                placeholder="manufacturer / brand"
              />

              <InputTemp
                type="text"
                fieldProps={getFieldProps("category")}
                style={{
                  heading: { fontWeight: 500 },
                  input: { bgColor: "blackAlpha.50" },
                }}
                heading="Category"
                placeholder="category"
              />

              <THStack className="items-center p-2">
                <InputTemp
                  type="number"
                  fieldProps={getFieldProps("price")}
                  style={{
                    heading: { fontWeight: 500 },
                    input: { bgColor: "blackAlpha.50" },
                  }}
                  heading="Price"
                />

                <InputTemp
                  type="number"
                  fieldProps={getFieldProps("stock")}
                  style={{
                    heading: { fontWeight: 500 },
                    input: { bgColor: "blackAlpha.50" },
                  }}
                  heading="Stock"
                />
              </THStack>

              <TextareaTemp
                heading="Tags"
                rows={4}
                fieldProps={getFieldProps("tags")}
                placeholder="enter tags sperated by spaces, tags written together would exists as a single word"
              />
            </TStack>

            <div className="rounded-lg p-2 col-span-5 row-span-2 h-full bg-white">
              <h3>Product Gallery</h3>
              <TDivider />
              <TStack className="relative flex-wrap justify-center">
                <div>
                  <TFlex className="py-2 items-center">
                    <h3>Thumbnail</h3>
                    <IconButton
                      className="text-orange-500 rounded-full p-2 mx-2 bg-orange-200"
                      // onClick={() => uploadThumbnailRef.current?.click()}
                    >
                      <PlusIcon width={25} />
                    </IconButton>
                    <button
                      className="text-orange-500 rounded-full p-2 mx-2 bg-orange-200"
                      // disabled={!thumbnail}
                      onClick={() => {
                        // thumbnailPrev && URL.revokeObjectURL(thumbnailPrev);
                        // dispatch({
                        //   type: "thumbnail-file",
                        //   payload: null,
                        // });
                      }}
                    >
                      <ArchiveBoxXMarkIcon width={22} />
                    </button>
                  </TFlex>
                </div>
              </TStack>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

Product.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};

export default Product;
