import type { Product, Store } from "@prisma/client";
import type { ProductPayload, VariantSchemaType } from "src/server/schema";

export interface FormValues
  extends Omit<ProductPayload, "category" | "promotions" | "variantsPayload"> {
  category: string;
  promotions: string;
  thumbnailFile: File | null;
  imageFiles: { id: string; file: File }[];
  variants: (VariantSchemaType & {
    imageFile: File | null;
    image: string;
  })[];
}

export const initialSD: Store = {
  about: "",
  account: { bank: "", name: "", number: "" },
  email: "",
  id: "initial",
  name: "",
  photoUrl: "",
  status: "disabled",
  support: { mobile: "", whatsapp: "" },
  vendors: [],
  bannerUrl: "",
};

export const productPLD: Omit<Product, ""> = {
  brand: "",
  category: "",
  description: "",
  discountPercentage: 0,
  price: 0,
  promotions: [],
  rating: 0,
  status: "review",
  stock: 0,
  tags: [],
  title: "",
  package: [],
  id: "",
  images: [],
  moreDescr: [],
  sid: "",
  sold: 0,
  specs: { model: "", others: [] },
  thumbnail: "",
  variants: [],
};

export const getProductInitialPayload: (product?: Product | null) => Omit<
  ProductPayload,
  "variantsPayload"
> & {
  variantsPayload: (Omit<VariantSchemaType, "id"> & {
    id: string;
  })[];
} = (product) => ({
  title: product?.title || "",
  brand: product?.brand || "",
  description: product?.description || "",
  package: product?.package || [],
  price: product?.price || 0,
  stock: product?.stock || 0,
  category: product?.category || "",
  moreDescr: [],
  specs: {
    model: product?.specs?.model || "",
    others: product?.specs?.others || [],
  },
  tags: product?.tags || [],
  status: product?.status || "review",
  discountPercentage: product?.discountPercentage || 0,
  promotions: product?.promotions || [],
  thumbnailFile: null,
  images: product?.images || [],
  imageFiles: [],
  variantsPayload:
    product?.variants.map((vrn) => ({
      options: vrn.options,
      price: vrn.price,
      title: vrn.title,
      id: vrn.id,
    })) || [],
});

export const vPlaceholder = {
  title: "",
  price: 0,
  options: [],
  image: "",
};

export const getFormIV: (product?: Product | null) => FormValues = (
  product
) => {
  return {
    title: product?.title || "",
    brand: product?.brand || "",
    description: product?.description || "",
    package: product?.package || [],
    price: product?.price || 0,
    stock: product?.stock || 0,
    category: product?.category || "",
    moreDescr: [],
    specs: {
      model: product?.specs?.model || "",
      others: product?.specs?.others || [],
    },
    tags: product?.tags || [],
    status: product?.status || "review",
    discountPercentage: product?.discountPercentage || 0,
    promotions: product?.promotions?.join(",").replace(",", " ; ") || "",
    thumbnailFile: null,
    imageFiles: [],
    images: product?.images || [],
    variants:
      product?.variants.map(({ image, options, price, title, id }) => ({
        image,
        options,
        price,
        title,
        imageFile: null,
        id,
      })) || [],
  };
};

export type MutateValues = {
  details?: Partial<ProductPayload>;
  variantFiles?: {
    new: { id: string; file: File | null }[];
    updated: { id?: string; file: File | null }[];
  };
  thumbnailFile?: File | null;
  imageFiles?: File[];
};
