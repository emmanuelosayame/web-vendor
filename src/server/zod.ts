import { z } from "zod";

const Status = z.enum(["active", "disabled"]);

const SStatus = z.enum(["active", "disabled", "review"]);

const PStatus = z.enum(["active", "disabled", "review", "incomplete"]);

//id on server differs from client, id on client to server is index to string
const ProductVariant = z.object({
  id: z.string().optional(),
  title: z.string(),
  price: z.number(),
  options: z.array(z.object({ k: z.string(), v: z.string() })),
  // sku: z.string(),
  // updatedAt: z.string(),
});

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
  package: z.array(z.string()),
  tags: z.array(z.string()),
  specs: z
    .object({
      model: z.string().optional(),
      others: z.array(z.string()),
    })
    .default({ others: [] }),
  status: PStatus.optional(),
  discountPercentage: z.number().optional(),
  promotions: z.array(z.string()).optional(),
  variantsPayload: z.object({
    new: z.array(ProductVariant).optional(),
    updated: z.array(ProductVariant).optional(),
    deleted: z.array(z.string()).optional(),
  }),
  moreDescr: z.array(z.object({ id: z.string(), url: z.string() })).default([]),
});

// export const ProductUpdateSchema = ProductSchema.extend({
//   imageFiles: z.array(z.object({ name: z.string(), size: z.number() })),
// });

export const vendorS = z.object({
  firstName: z.string().min(1, "required").max(200, "too long"),
  lastName: z.string().min(1, "required").max(200, "too long"),
  email: z.string().email().min(1, "required"),
  phoneNo: z.string().min(1, "required").max(200, "too long"),
  location: z.string().min(1, "required").max(200, "too long"),
  address: z.string().min(1, "required").max(200, "too long"),
  role: z.enum(["admin", "vendor"]),
  status: z.enum(["active", "disabled"]),
});

export type VendorS = z.infer<typeof vendorS>;

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

export const storeS = z.object({
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
  texts: z.object({
    id: z.string(),
    body: z.string(),
    tag: z.string(),
  }),
});

export const categoryS = z.object({
  parent: z.string().min(1, "required").max(200, "invalid").nullable(),
  name: z.string().min(1, "required").max(200, "invalid"),
  slug: z.string().min(1, "required").max(200, "invalid"),
  tid: z.number().min(1, "required").max(200, "invalid"),
});

export type CategoryS = z.infer<typeof categoryS>;

export type ProductPayload = z.infer<typeof ProductSchema>;

export type ProductSort = z.infer<typeof ProductSortEnum>;

export type VariantSchemaType = z.infer<typeof ProductVariant>;

export const storeMutateS = storeS.partial({
  vendors: true,
  email: true,
  photoUrl: true,
  status: true,
});

export type StoreS = z.infer<typeof storeS>;
export type StoreMutateS = z.infer<typeof storeMutateS>;

export const loginS = z.object({
  vendorId: z.string().length(12, "invalid"),
  key: z.string().length(24, "invalid"),
});

export type LoginS = z.infer<typeof loginS>;
