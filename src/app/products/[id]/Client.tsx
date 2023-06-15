"use client";

import { productVs } from "@lib/validation";
import axios, { type AxiosError } from "axios";
import Gallery from "@components/product/Gallery";
import { Form1, Form2 } from "@components/product/Forms";
import Variants from "@components/product/Variants";
import { IconButton, MenuFlex } from "@components/TElements";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { onSubmit } from "@components/product/save";
import { useMutation } from "@tanstack/react-query";
import type { Product } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  type FormValues,
  getFormIV,
  type MutateValues,
} from "@lib/placeholders";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { LoadingBlur } from "@components/Loading";
import Toast, { useToastTrigger } from "@components/radix/Toast";

interface Props {
  data: Product;
  isFetching?: boolean;
}

const Client = ({ data, isFetching }: Props) => {
  const router = useRouter();

  const pid = useParams()?.id?.toString();

  const formIV = getFormIV(data);

  const { open, setOpen, trigger } = useToastTrigger();

  const { mutateAsync, isLoading: mutating } = useMutation<
    Product & { mtype: "create" | "update" },
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
      const { data } = await axios.put("/api/upload/product", form);
      return data;
    },
    {
      onSuccess: (data) => {
        if (data.mtype === "create") {
          router.back();
        } else {
          router.refresh();
        }
      },
    }
  );

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ defaultValues: formIV });

  return (
    <form
      onSubmit={handleSubmit((values) =>
        onSubmit({
          values,
          data,
          mutateAsync,
          refetch: () => router.refresh(),
        })
      )}
      className="w-full h-full"
    >
      {mutating && <LoadingBlur />}

      <Toast
        open={open}
        setOpen={setOpen}
        title="Saved"
        description="Product Updated"
        styles=""
      />

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
          <p className={`text-green-500 text-center w-full font-semibold`}>
            active
          </p>
        </div>

        <IconButton
          type="submit"
          className="bg-white"
          disabled={
            !isDirty ||
            (!data?.thumbnail && !getValues("thumbnailFile")) ||
            !!(!!data
              ? data.images.length + getValues("imageFiles").length < 2
              : getValues("imageFiles").length < 2)
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
          <Form1 register={register} errors={errors} />

          <Form2
            register={register}
            errors={errors}
            pid={pid}
            mutate={mutateAsync}
            getValues={getValues}
            setValue={setValue}
            setError={setError}
            clearErrors={clearErrors}
          />

          {!isFetching ? (
            <Gallery
              getValues={getValues}
              setValue={setValue}
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
            getValues={getValues}
            setValue={setValue}
            register={register}
            errors={errors}
            serverVariants={data?.variants || []}
          />
        </div>
      </div>
    </form>
  );
};

export default Client;
