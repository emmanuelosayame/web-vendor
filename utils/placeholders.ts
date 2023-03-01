import { type Store } from "@prisma/client";

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

export const productPLD = {
  brand: "",
  category: "",
  description: "",
  discountPercentage: 0,
  id: "",
  price: 0,
  promotion: [],
  rating: 0,
  status: "",
  stock: 0,
  tags: [],
  title: "",
};
