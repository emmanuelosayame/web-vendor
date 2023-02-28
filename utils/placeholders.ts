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
};
