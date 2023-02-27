import { z } from "zod";

const Status = z.enum(["active", "disabled"]);

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

export const ProductSchema = z
  .object({
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
    thumbnail: z.string(),
    // images: z.array(z.string()),
    moreDescr: z.array(z.object({ id: z.string(), url: z.string() })),
    status: Status,
  })
  .deepPartial();

export const ProductUpdateSchema = ProductSchema.extend({
  imageFiles: z.array(z.object({ name: z.string(), size: z.number() })),
}).partial();

export const VendorData = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phoneNo: z.string(),
  location: z.string(),
  address: z.string(),
  role: z.enum(["admin", "vendor"]),
  status: z.enum(["active", "disabled"]),
});

const StoreVendors = z.array(
  z.object({
    id: z.string(),
    role: z.enum(["member", "owner"]),
    status: Status,
    email: z.string(),
  })
);

export const StoreSchema = z.object({
  name: z.string(),
  about: z.string(),
  photoUrl: z.string(),
  status: Status,
  vendors: StoreVendors,
});

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

export type ProductSort = z.infer<typeof ProductSortEnum>;
