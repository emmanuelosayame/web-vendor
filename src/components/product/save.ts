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
  refetch: () => void;
}

export const onSubmit = async ({
  data,
  values,
  mutateAsync,
  refetch,
}: Props) => {
  const {
    variantsPayload: initialVariants,
    tags: initialTags,
    specs: initialSpecs,
    ...initialData
  } = getProductInitialPayload(data);

  const initialVariantsWID = initialVariants.map((variant, index) => ({
    ...variant,
    id: (index + 1).toString(),
  }));

  const {
    thumbnailFile,
    imageFiles,
    variants,
    specs,
    tags,
    promotions,
    ...rest
  } = values;

  const changedTags = JSON.stringify(initialTags) !== JSON.stringify(tags);
  const changedSpecs = JSON.stringify(initialSpecs) !== JSON.stringify(specs);

  const sortedImageFiles = imageFiles
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((f) => f.file);

  const variantPayload = variants
    .map(({ options, price, title }) => ({
      options,
      price,
      title,
    }))
    .filter((variant, index) => {
      const prevVariant = initialVariantsWID.find(
        (varnt) => (index + 1).toString() === varnt.id
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

  const payload: Omit<ProductPayload, "variantsPayload" | "tags" | "specs"> = {
    ...rest,
    promotions: promotions.split(" ; "),
  };

  const updatedDetails: Partial<ProductPayload> = JSON.parse(
    JSON.stringify({
      ...updatedDiff(initialData, payload),
      variantsPayload: variantPayload.length > 0 ? variantPayload : undefined,
      tags: changedTags ? tags : undefined,
      specs: changedSpecs ? specs : undefined,
    })
  );

  mutateAsync({
    details: updatedDetails,
    imageFiles: sortedImageFiles,
    thumbnailFile,
    variantFiles,
  });
};
