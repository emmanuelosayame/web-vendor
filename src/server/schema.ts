import { z } from "zod";

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
  })
  .partial();

export const ProductUpdateSchema = ProductSchema.extend({
  imageFiles: z
    .array(z.object({ name: z.string(), size: z.number() }))
    .optional(),
});

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;
