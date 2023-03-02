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
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import axios, { AxiosError } from "axios";
// import { Product } from "@prisma/client";
import { diff } from "deep-object-diff";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { type ProductPayload } from "src/server/schema";
import { api } from "utils/api";
import { getFormIV, productPLD, type FormValues } from "utils/placeholders";
import { productVs } from "utils/validation";
import { type NextPageWithLayout } from "../_app";
import Gallery from "@components/product/Gallery";
import { Form1, Form2 } from "@components/product/Forms";

interface ProductUpdate extends ProductPayload {
  imageFiles: { id: string; file: File }[];
}

const imagesPH = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

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

  const initialData: ProductUpdate = {
    ...formIV,
    tags: formIV.tags.split(" ; "),
    images: data?.images || [],
    promotion: formIV.promotion.split(" ; "),
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

  const uploadImage = async (file: File, name: string) => {
    const form = new FormData();
    form.append("image", file);

    const { data } = await axios.post<{ url: string }>(
      `/api/upload/productdd`,
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
        params: { name },
      }
    );
    return data.url;
  };

  const onSubmit = async (values: FormValues) => {
    const { imageFiles, tags, promotion, ...rest } = values;

    let urls: string[] = data ? [...data?.images] : [];

    if (imageFiles.length > 0) {
      setUploading(true);
      for await (const image of imageFiles) {
        const url = await uploadImage(image.file, `producdt${image.id}`);
        urls.push(url);
      }
      setUploading(false);
    }

    const payload: ProductPayload = {
      ...rest,
      tags: tags.split(" ; "),
      images: urls,
      promotion: promotion.split(" ; "),
    };

    if (pid !== "new") {
      const updatedDetails = diff(initialData, payload);
      mutate({ id: pid, data: updatedDetails as Partial<ProductPayload> });
    } else {
      create({ data: payload });
    }
  };

  if (error) return <p>{error.message}</p>;

  return (
    <>
      {(isLoading || mutating || creating || uploading) && <LoadingBlur />}

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
                  mutate={mutate}
                />

                <Gallery
                  formikValues={values}
                  setFieldValue={setFieldValue}
                  data={data}
                  pid={pid}
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
