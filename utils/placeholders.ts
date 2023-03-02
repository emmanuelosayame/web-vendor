import type { Product, Store } from "@prisma/client";
import type { ProductPayload } from "src/server/schema";

export interface FormValues
  extends Omit<ProductPayload, "tags" | "category" | "promotion" | "images"> {
  imageFiles: { id: string; file: File }[];
  thumbnailFile: File | null;
  tags: string;
  category: string;
  promotion: string;
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
};

export const getFormIV: (product?: Product | null) => FormValues = (
  product
) => ({
  title: product?.title || "",
  brand: product?.brand || "",
  description: product?.description || "",
  package: product?.package || "",
  price: product?.price || 0,
  stock: product?.stock || 0,
  imageFiles: [],
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
});
