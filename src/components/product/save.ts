import type { Product } from "@prisma/client";
import axios, { type AxiosError } from "axios";
import { detailedDiff, diff, updatedDiff } from "deep-object-diff";
import { nanoid } from "nanoid";
import type { ProductPayload } from "src/server/schema";
import {
  getProductInitialPayload,
  type MutateValues,
  type FormValues,
} from "utils/placeholders";

const uploadImage = async (
  id: string | undefined,
  { file, files }: { file: File | null; files: File[] },
  setUploading: (upldn: boolean) => void
) => {
  const form = new FormData();
  form.append("id", id || "new");
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
    await axios.put("/api/upload/product", form);
    setUploading(false);
    return { status: "success", error: undefined };
  } catch (err) {
    setUploading(false);
    return { status: "error", error: err as AxiosError };
  }
};

interface Props {
  values: FormValues;
  data: Product | null | undefined;
  mutateAsync: (values: MutateValues) => Promise<Product>;
  create: (
    values: { id?: string; data: ProductPayload },
    opts: { onSuccess: (data: Product) => void }
  ) => Promise<Product>;
  setUploading: (upldn: boolean) => void;
  refetch: () => void;
}

export const onSubmit = async ({
  data,
  values,
  mutateAsync,
  create,
  setUploading,
  refetch,
}: Props) => {
  const { variants: initialVariants, ...initialData } =
    getProductInitialPayload(data);

  const initialVariantsWID = initialVariants.map((variant, index) => ({
    ...variant,
    id: (index + 1).toString(),
  }));

  const { thumbnailFile, imageFiles, tags, promotions, variants, ...rest } =
    values;

  const sortedImageFiles = imageFiles
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((f) => f.file);

  const variantPayload = variants
    .map(({ options, price, title }, index) => ({
      options,
      price,
      title,
      id: (index + 1).toString(),
    }))
    .filter((variant) => {
      const prevVariant = initialVariantsWID.find(
        (varnt) => variant.id === varnt.id
      );
      if (!!prevVariant) {
        const changed = Object.keys(diff(variant, prevVariant)).length > 0;
        if (changed) {
          return true;
        } else return false;
      }
      return true;
    });

  const variantFiles = variants
    .map(({ imageFile }, index) => ({
      id: (index + 1).toString(),
      file: imageFile,
    }))
    .filter((varnt) => varnt.file !== null);

  const payload: Omit<ProductPayload, "variants"> = {
    ...rest,
    tags: tags.split(" ; "),
    promotions: promotions.split(" ; "),
  };

  const updatedDetails = JSON.parse(
    JSON.stringify({
      ...updatedDiff(initialData, payload),
      variants: variantPayload.length > 0 ? variantPayload : undefined,
    })
  ) as Partial<ProductPayload>;

  mutateAsync({
    details: updatedDetails,
    imageFiles: sortedImageFiles,
    thumbnailFile,
    variantFiles,
  });

  //   if (pid !== "new") {
  //     const updatedDetails = updatedDiff(
  //       initialData,
  //       payload
  //     ) as Partial<ProductPayload>;
  //     const hadFormChanges = Object.keys(updatedDetails).length > 0;
  //     if (hadFormChanges) {
  //       await mutateAsync({
  //         id: pid,
  //         data: updatedDetails,
  //       });
  //     }
  //     if (thumbnailFile || imageFiles.length > 0) {
  //       const { status, error } = await uploadImage(
  //         data?.id,
  //         {
  //           file: thumbnailFile,
  //           files: sortedImageFiles,
  //         },
  //         setUploading
  //       );
  //       !error && refetch();
  //       error && hadFormChanges && refetch();
  //       return;
  //     }
  //     hadFormChanges && refetch();
  //   } else {
  //     create(
  //       { data: payload },
  //       {
  //         onSuccess: async (data) => {
  //           if (thumbnailFile || imageFiles.length > 0) {
  //             const { status, error } = await uploadImage(
  //               data.id,
  //               {
  //                 file: thumbnailFile,
  //                 files: sortedImageFiles,
  //               },
  //               setUploading
  //             );
  //             if (status === "error") {
  //               mutateAsync({ id: data.id, data: { status: "incomplete" } });
  //             }
  //           }
  //         },
  //       }
  //     );
  //   }
};
