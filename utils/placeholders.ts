import type { Product, ProductVariant, Store } from "@prisma/client";
import type { ProductPayload } from "src/server/schema";

export interface FormValues
  extends Omit<ProductPayload, "tags" | "category" | "promotion" | "variants"> {
  tags: string;
  category: string;
  promotion: string;
  thumbnailFile: File | null;
  imageFiles: { id: string; file: File }[];
  variants: (ProductVariant & { imageFile: File | null })[];
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
  promotion: [],
  rating: 0,
  status: "review",
  stock: 0,
  tags: [],
  title: "",
  package: "",
  id: "",
  images: [],
  moreDescr: [],
  sid: "",
  sold: 0,
  specs: { model: "", others: "" },
  thumbnail: "",
  variants: [],
};

export const getProductInitialPayload: (
  product?: Product | null
) => ProductPayload = (product) => ({
  title: product?.title || "",
  brand: product?.brand || "",
  description: product?.description || "",
  package: product?.package || "",
  price: product?.price || 0,
  stock: product?.stock || 0,
  category: product?.category || "",
  moreDescr: [],
  specs: {
    model: product?.specs?.model || "",
    others: product?.specs?.others || "",
  },
  tags: product?.tags || [],
  status: product?.status || "review",
  discountPercentage: product?.discountPercentage || 0,
  promotion: product?.promotion || [],
  thumbnailFile: null,
  images: product?.images || [],
  imageFiles: [],
  variants: [],
});

export const vPlaceholder: ProductVariant = {
  title: "",
  price: 0,
  image: "",
  options: [],
  updatedAt: "",
  sku: "",
};

export const getFormIV: (product?: Product | null) => FormValues = (
  product
) => {
  return {
    title: product?.title || "",
    brand: product?.brand || "",
    description: product?.description || "",
    package: product?.package || "",
    price: product?.price || 0,
    stock: product?.stock || 0,
    category: product?.category || "",
    moreDescr: [],
    specs: {
      model: product?.specs?.model || "",
      others: product?.specs?.others || "",
    },
    tags: product?.tags?.join(",").replace(",", " ; ") || "",
    status: product?.status || "review",
    discountPercentage: product?.discountPercentage || 0,
    promotion: product?.promotion.join(",").replace(",", " ; ") || "",
    thumbnailFile: null,
    imageFiles: [],
    images: product?.images || [],
    variants:
      product?.variants.map((variant) => ({ ...variant, imageFile: null })) ||
      [],
  };
};
