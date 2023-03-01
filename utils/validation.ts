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

export const storeVs = Yup.object().shape({
  name: Yup.string().min(3).max(15, "too long").required("Name required"),
  about: Yup.string().max(100, "too long"),
  email: Yup.string().email("Email Required"),
});

export const emailV = Yup.string()
  .email("Enter a valid email")
  .required("Enter email");

export const productVs = Yup.object().shape({
  title: Yup.string().min(2).max(100).required(),
  description: Yup.string().min(2).max(500).required(),
  brand: Yup.string().min(2).max(50).required(),
  category: Yup.string().min(2).max(30).required(),
  price: Yup.number().moreThan(5, "too low").lessThan(1000000).required(),
  stock: Yup.number().moreThan(1, "too low").lessThan(10000),
  package: Yup.string().min(2).max(100).required(),
  tags: Yup.string().min(2).max(300),
  specs: Yup.object({
    model: Yup.string().min(1, "too short").max(30),
    others: Yup.string().min(5, "too short").max(40),
  }),
  // thumbnail: Yup.string(),
  // images: Yup.array(Yup.string()),
  // imageFiles: z.array(z.object({ name: z.string(), size: z.number() })),
  moreDescr: Yup.array(Yup.object({ id: Yup.string(), url: Yup.string() })),
  status: Yup.string(),
});
