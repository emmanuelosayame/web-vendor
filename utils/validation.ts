import * as Yup from "yup";

export const loginVs = Yup.object().shape({
  email: Yup.string().email("enter a valid email address").required(""),
  password: Yup.string()
    .min(8, "cannot be less than 8")
    .max(24, "Too Long!")
    .required("Required"),
  storeNo: Yup.string()
    .min(10, "enter your 10 digit store no.")
    .max(10, "mistake?"),
});

export const authVs = Yup.object().shape({
  email: Yup.string().email("enter a valid email address").required(""),
  password: Yup.string()
    .min(8, "cannot be less than 8")
    .max(24, "Too Long!")
    .required("Required"),
  storeNo: Yup.string()
    .min(10, "enter your 10 digit store no.")
    .max(10, "mistake?"),
});
