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

export const vendorVs = Yup.object().shape({
  firstName: Yup.string()
    .min(3)
    .max(20, "too long")
    .required("Firstname required"),
  lastName: Yup.string()
    .min(3)
    .max(20, "too long")
    .required("Lastname required"),
  email: Yup.string()
    .email("enter a valid email address")
    .required("Email required"),
  phoneNo: Yup.string()
    .length(11, "enter a valid phone number")
    .required("Phone number required"),
  location: Yup.string().max(20, "too long"),
  address: Yup.string().max(100, "too long"),
});
