import type { Product } from "@prisma/client";
import { updatedDiff } from "deep-object-diff";
import type { ProductPayload } from "src/server/zod";
import {
  getProductInitialPayload,
  type MutateValues,
  type FormValues,
} from "@lib/placeholders";

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

  console.log(values);

  const {
    thumbnailFile,
    imageFiles,
    variants,
    specs,
    tags,
    promotions,
    package: pkg,
    ...rest
  } = values;

  const changedTags = JSON.stringify(initialTags) !== JSON.stringify(tags);
  const changedSpecs = JSON.stringify(initialSpecs) !== JSON.stringify(specs);
  const changedPackage = JSON.stringify(initialSpecs) !== JSON.stringify(pkg);

  const sortedImageFiles = imageFiles
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((f) => f.file);

  const deletedVariants = initialVariants
    .filter((ivarnt) => !variants.some((varnt) => varnt.id === ivarnt.id))
    .map((v) => v.id);

  const newVariants = variants
    .filter((variant) => !variant.id || (variant.id && variant.id.length < 2))
    .map(({ options, price, title, imageFile }) => ({
      options,
      price,
      title,
      imageFile,
    }));

  const updatedVariantFiles = variants
    .filter((varnt) => !!varnt.id && !!varnt.imageFile)
    .map((v) => ({
      id: v.id,
      file: v?.imageFile,
    }));

  const newVariantFiles = newVariants
    .map(({ imageFile }, index) => ({
      id: (index + 1).toString(),
      file: imageFile,
    }))
    .filter((varnt) => varnt.file !== null);

  const updatedVPayload = variants
    .map(({ options, price, title, id }) => ({
      options,
      price,
      title,
      id,
    }))
    .filter(({ options, price, title, id }) => {
      const oldPayload = initialVariants.find((vrnt) => vrnt.id === id);
      if (oldPayload) {
        if (
          JSON.stringify({ options, price, title, id }) !==
          JSON.stringify(oldPayload)
        ) {
          return true;
        }
        return false;
      }
      return false;
    });

  const newVPayload = newVariants.map(({ options, price, title }) => ({
    options,
    price,
    title,
  }));

  const payload: Omit<
    ProductPayload,
    "variantsPayload" | "tags" | "specs" | "package"
  > = {
    ...rest,
    promotions: promotions.split(" ; "),
  };

  const updatedDetails: Partial<ProductPayload> = JSON.parse(
    JSON.stringify({
      ...updatedDiff(initialData, payload),
      variantsPayload: {
        deleted: deletedVariants.length > 0 ? deletedVariants : undefined,
        updated: updatedVPayload.length > 0 ? updatedVPayload : undefined,
        new: newVPayload.length > 0 ? newVPayload : undefined,
      },
      tags: changedTags ? tags : undefined,
      specs: changedSpecs ? specs : undefined,
      package: changedPackage ? pkg : undefined,
    })
  );

  mutateAsync({
    details: updatedDetails,
    imageFiles: sortedImageFiles,
    thumbnailFile,
    variantFiles: {
      new: newVariantFiles,
      updated: updatedVariantFiles,
    },
  });
};
