import Layout from "@components/Layout";
import { LoadingBlur } from "@components/Loading";
import Toast, { useToastTrigger } from "@components/radix/Toast";
import { IconButton, MenuFlex } from "@components/TElements";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { updatedDiff } from "deep-object-diff";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { type ProductPayload } from "src/server/schema";
import { api } from "utils/api";
import {
  getFormIV,
  getProductInitialPayload,
  type FormValues,
} from "utils/placeholders";
import { productVs } from "utils/validation";
import { type NextPageWithLayout } from "../_app";
import Gallery from "@components/product/Gallery";
import { Form1, Form2 } from "@components/product/Forms";

const ProductPage: NextPageWithLayout = () => {
  const router = useRouter();
  const pid = router.query.id?.toString();

  const [uploading, setUploading] = useState(false);

  const { data, isFetching, isLoading, error } = api.product.one.useQuery(
    { id: pid },
    {
      enabled: !!pid && pid !== "new",
      // placeholderData: productPLD,
      // onSuccess: (data) =>
      //   setIP(
      //     imagesPH.map((imagePH) => {
      //       const serverUrl =
      //         data?.images?.find(
      //           (url, index) => imagePH.id === index.toString()
      //         ) || "";
      //       return { id: imagePH.id, url: "" };
      //     })
      //   ),
    }
  );

  const formIV = getFormIV(data);
  const initialData = getProductInitialPayload(data);

  const qc = api.useContext();

  const { open, setOpen, trigger } = useToastTrigger();

  const { mutate: create, isLoading: creating } =
    api.product.create.useMutation({
      onSuccess: (data) => {
        trigger();
        router.replace(`/products`);
      },
    });
  const { mutateAsync, isLoading: mutating } = api.product.update.useMutation({
    onSettled: () => {
      trigger();
    },
  });

  const uploadImage = async (
    id: string | undefined,
    { file, files }: { file: File | null; files: File[] }
  ) => {
    const form = new FormData();
    if (file) {
      form.append("single", file);
    }
    if (files.length > 0) {
      for (const file of files) {
        form.append("multiple", file);
      }
    }
    setUploading(true);
    try {
      await axios.put("/api/upload/product", form, { params: { id } });
      setUploading(false);
    } catch (err) {
      setUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    const { thumbnailFile, imageFiles, tags, promotion, ...rest } = values;

    const sortedImageFiles = imageFiles
      .sort((a, b) => Number(a.id) - Number(b.id))
      .map((f) => f.file);

    const payload: ProductPayload = {
      ...rest,
      tags: tags.split(" ; "),
      promotion: promotion.split(" ; "),
    };

    if (pid !== "new") {
      const updatedDetails = updatedDiff(
        initialData,
        payload
      ) as Partial<ProductPayload>;
      if (Object.keys(updatedDetails).length > 0) {
        await mutateAsync({
          id: pid,
          data: updatedDetails,
        });
      }
      if (thumbnailFile || imageFiles.length > 0) {
        await uploadImage(pid, {
          file: thumbnailFile,
          files: sortedImageFiles,
        });
      }
      qc.product.one.refetch();
    } else {
      create(
        { data: payload },
        {
          onSuccess: (data) => {
            if (thumbnailFile || imageFiles.length > 0) {
              uploadImage(data.id, {
                file: thumbnailFile,
                files: sortedImageFiles,
              });
            }
          },
        }
      );
    }
  };

  useEffect(() => {
    if (error && error.data?.code === "INTERNAL_SERVER_ERROR")
      setTimeout(() => router.replace("/products"), 700);
  }, [error, router]);

  if (error) return <p className="text-center">{error.data?.code}</p>;

  return (
    <>
      {(isFetching || mutating || creating || uploading) && <LoadingBlur />}

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
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          getFieldProps,
          dirty,
          touched,
          errors,
          values,
          setFieldValue,
          setValues,
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
                  !(data?.thumbnail || values.thumbnailFile) ||
                  !(data
                    ? data?.images.length
                    : 0 + values.imageFiles.length > 2)
                }
              >
                <p>Save</p>
                <CheckIcon width={20} />
              </IconButton>
            </MenuFlex>

            <div className="overflow-y-auto h-full pb-4">
              <div className="flex flex-col md:grid md:grid-cols-7 md:grid-rows-5 gap-3 p-2 bg-white/40 rounded-lg">
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
