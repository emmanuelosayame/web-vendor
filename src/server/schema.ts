import { z } from "zod";

const Status = z.enum(["active", "disabled"]);

const SStatus = z.enum(["active", "disabled", "review"]);

const PStatus = z.enum(["active", "disabled", "review", "incomplete"]);

export const ProductSortEnum = z.enum([
  "title-asc",
  "title-desc",
  "price-asc",
  "price-desc",
  "stock-asc",
  "stock-desc",
  "sold-asc",
  "sold-desc",
  "search",
]);

export const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  brand: z.string(),
  category: z.string(),
  price: z.number(),
  stock: z.number(),
  package: z.string(),
  tags: z.array(z.string()),
  specs: z.object({
    model: z.string(),
    others: z.string().optional(),
  }),
  // thumbnailFile: z.string().nullable(),
  // imageFiles: z.array(z.object({ id: z.string(), url: z.string() })),
  // images: z.array(z.string()),
  moreDescr: z.array(z.object({ id: z.string(), url: z.string() })),
  status: PStatus,
  discountPercentage: z.number(),
  promotion: z.array(z.string()),
});

// export const ProductUpdateSchema = ProductSchema.extend({
//   imageFiles: z.array(z.object({ name: z.string(), size: z.number() })),
// });

export const VendorData = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phoneNo: z.string(),
  location: z.string(),
  address: z.string(),
  role: z.enum(["admin", "vendor"]),
  status: z.enum(["active", "disabled"]),
});

const StoreVendors = z
  .array(
    z.object({
      id: z.string(),
      role: z.enum(["member", "owner"]),
      status: Status,
      email: z.string().email(),
    })
  )
  .max(4);

const StoreAccount = z.object({
  name: z.string(),
  number: z.string(),
  bank: z.string(),
});

const StoreSupport = z.object({
  mobile: z.string(),
  whatsapp: z.string(),
});

export const StoreSchema = z.object({
  name: z.string(),
  about: z.string(),
  email: z.string(),
  photoUrl: z.string(),
  status: SStatus,
  vendors: StoreVendors,
  account: StoreAccount,
  support: StoreSupport,
});

export const AssetPayload = z.object({
  title: z.string(),
  description: z.string(),
  code: z.number(),
  path: z.string(),
  basepath: z.string(),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      tag: z.string(),
    })
  ),
  texts: z.array(
    z.object({
      id: z.string(),
      body: z.string(),
      tag: z.string(),
    })
  ),
});

export type ProductPayload = z.infer<typeof ProductSchema>;

export type ProductSort = z.infer<typeof ProductSortEnum>;
