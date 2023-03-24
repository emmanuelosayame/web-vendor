import Layout from "@components/Layout";
import { LoadingBlur } from "@components/Loading";
import Toast, { useToastTrigger } from "@components/radix/Toast";
import { IconButton, MenuFlex } from "@components/TElements";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios, { type AxiosError } from "axios";
import { updatedDiff } from "deep-object-diff";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type ProductPayload } from "src/server/schema";
import { api } from "utils/api";
import {
  getFormIV,
  getProductInitialPayload,
  type MutateValues,
  type FormValues,
} from "utils/placeholders";
import { productVs } from "utils/validation";
import { type NextPageWithLayout } from "../../../types/shared";
import Gallery from "@components/product/Gallery";
import { Form1, Form2 } from "@components/product/Forms";
import Variants from "@components/product/Variants";
import { onSubmit } from "@components/product/save";
import { useMutation } from "@tanstack/react-query";
import type { Product } from "@prisma/client";

const ProductPage: NextPageWithLayout = () => {
  const router = useRouter();
  const pid = router.query.id?.toString();
  const qc = api.useContext();
  const refetch = qc.product.one.refetch;

  const { data, isFetching, error, status } = api.product.one.useQuery(
    { id: pid },
    {
      enabled: !!pid && pid !== "new",
    }
  );

  const formIV = getFormIV(data);

  const { open, setOpen, trigger } = useToastTrigger();

  // create fn to upload. formData with type first then json.stringify the rest of payload as "other"field.imagefiles and thumbnail field also variant field

  const { mutateAsync, isLoading: mutating } = useMutation<
    Product,
    AxiosError,
    MutateValues
  >(
    async ({ details, imageFiles, thumbnailFile, variantFiles }) => {
      const form = new FormData();
      pid && form.append("id", pid);
      form.append("payload", JSON.stringify(details));

      if (thumbnailFile) {
        form.append("thumbnail", thumbnailFile);
      }

      if (imageFiles && imageFiles.length > 0) {
        for (const file of imageFiles) {
          if (file) form.append("mainImages", file);
        }
      }

      if (variantFiles?.new && variantFiles.new.length > 0) {
        for (const variant of variantFiles.new) {
          if (variant.file) form.append("newVImages", variant.file, variant.id);
        }
      }
      if (variantFiles?.updated && variantFiles.updated.length > 0) {
        for (const variant of variantFiles.updated) {
          if (variant.file)
            form.append("updatedVImages", variant.file, variant.id);
        }
      }
      const { data } = await axios.put<Product>("/api/upload/product", form);
      return data;
    },
    { onSuccess: () => refetch() }
  );

  useEffect(() => {
    if (
      error &&
      (error.data?.code === "INTERNAL_SERVER_ERROR" ||
        error.data?.code === "FORBIDDEN")
    )
      setTimeout(() => router.replace("/products"), 700);
  }, [error, router]);

  if (error) return <p className="text-center">{error.data?.code}</p>;

  return (
    <>
      {(isFetching || mutating) && <LoadingBlur />}

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
        onSubmit={(values) =>
          onSubmit({
            values,
            data,
            mutateAsync,
            refetch,
          })
        }
        enableReinitialize
      >
        {({
          getFieldProps,
          dirty,
          touched,
          errors,
          values,
          setFieldValue,
          setFieldError,
        }) => (
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

              <IconButton
                type="submit"
                className="bg-white"
                disabled={
                  !dirty ||
                  (!data?.thumbnail && !values.thumbnailFile) ||
                  !!(!!data
                    ? data.images.length + values.imageFiles.length < 3
                    : values.imageFiles.length < 3)
                }
              >
                <p>Save</p>
                <CheckIcon width={20} />
              </IconButton>
            </MenuFlex>

            <div className="overflow-y-auto h-full pb-4">
              <div
                className="flex flex-col md:grid md:grid-cols-7 md:grid-rows-7
               gap-3 p-2 bg-white/40 rounded-lg"
              >
                <Form1
                  getFieldProps={getFieldProps}
                  touched={touched}
                  errors={errors}
                />

                <Form2
                  getFieldProps={getFieldProps}
                  touched={touched}
                  errors={errors}
                  pid={pid}
                  mutate={mutateAsync}
                  values={values}
                  setFieldValue={setFieldValue}
                  setFieldError={setFieldError}
                />

                {!isFetching ? (
                  <Gallery
                    formikValues={values}
                    setFieldValue={setFieldValue}
                    thumbnail={data?.thumbnail}
                    images={data?.images.map((url, index) => ({
                      id: (index + 1).toString(),
                      url,
                    }))}
                    pid={pid}
                  />
                ) : (
                  <div className="rounded-lg p-2 col-span-5 row-span-3 h-full bg-white" />
                )}

                <Variants
                  getFieldProps={getFieldProps}
                  variants={values.variants}
                  setFieldValue={setFieldValue}
                  touched={touched}
                  errors={errors}
                  serverVariants={data?.variants || []}
                />
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
