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
  firstName: Yup.string().min(3).max(20, "too long").required("required"),
  lastName: Yup.string().min(3).max(20, "too long").required("required"),
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
  about: Yup.string()
    .min(5, "too short")
    .max(100, "too long")
    .required("required"),
  email: Yup.string().email("Email Required"),
});

export const emailV = Yup.string()
  .email("Enter a valid email")
  .required("Enter email");

export const productVs = Yup.object().shape({
  title: Yup.string().min(2).max(100).required(),
  description: Yup.string().min(2).max(500).required(),
  brand: Yup.string().min(2).max(50).required(),
  category: Yup.string().required(),
  price: Yup.number().moreThan(5, "too low").lessThan(1000000).required(),
  stock: Yup.number().moreThan(1, "too low").lessThan(10000),
  package: Yup.array().of(Yup.string().min(2).max(100).required()),
  tags: Yup.array().of(Yup.string().min(2).max(10)),
  specs: Yup.object({
    model: Yup.string().min(1, "too short").max(30),
    others: Yup.array().of(Yup.string().min(2).max(50)),
  }),
  // thumbnail: Yup.string(),
  // images: Yup.array(Yup.string()),
  // imageFiles: z.array(z.object({ name: z.string(), size: z.number() })),
  moreDescr: Yup.array(Yup.object({ id: Yup.string(), url: Yup.string() })),
  status: Yup.string(),
  variants: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .required("required")
        .min(2, "too short")
        .max(50, "too long"),
      price: Yup.number()
        .moreThan(5, "too low")
        .lessThan(1000000, "max price...")
        .required("required"),
      // options: Yup.array().of(
      //   Yup.object().shape({
      //     k: Yup.string().min(2).max(50),
      //     v: Yup.string().min(2).max(50),
      //   })
      // ),
      options: Yup.array(),
    })
  ),
});

export const categoryVS = Yup.object().shape({
  name: Yup.string().min(3).max(30).required("Enter a name"),
  slug: Yup.string()
    .min(3, "too short")
    .max(30, "too long")
    .lowercase("must be in lowercase")
    .required("Enter an Id e.g name lowerc.."),
});
