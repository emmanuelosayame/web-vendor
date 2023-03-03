import { nanoid } from "nanoid";
import { storage } from "utils/f-admin";
import { z } from "zod";
import { ProductSortEnum, ProductSchema } from "../schema";
import { router, protectedProcedure } from "../trpc";

const uploadImage = async (imageStr: string, fileName: string) => {
  const createPersistentDownloadUrl = (
    bucket: string,
    pathToFile: string,
    downloadToken: string
  ) => {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      pathToFile
    )}?alt=media&token=${downloadToken}`;
  };

  const bucket = storage.bucket();
  const storageFile = bucket.file(
    `products/${fileName.slice(0, 1)}-${nanoid(12)}` || ""
  );
  const base64EncodedImageString = imageStr.replace(
    /^data:image\/\w+;base64,/,
    ""
  );
  const imageBuffer = Buffer.from(base64EncodedImageString, "base64");

  await storageFile.save(imageBuffer, {
    contentType: "image/webp",
    metadata: {
      cacheControl: `public,max-age=31536000,must-revalidate`,
      contentDisposition: `attachment; filename*=utf-8\'\'${storageFile.name}`,
      metadata: {
        firebaseStorageDownloadTokens: nanoid(18),
      },
    },
    public: true,
  });

  const [metadata] = await storageFile.getMetadata();

  return createPersistentDownloadUrl(
    metadata.bucket,
    metadata.name,
    metadata.metadata.firebaseStorageDownloadTokens
  );
};

export const productRouter = router({
  count: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx, input }) => {
      const sid = ctx.sid;
      return await ctx.prisma.product.count({ where: { sid } });
    }),
  one: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.prisma.product.findUnique({
        where: { id },
      });
    }),
  many: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(30).nullish(),
        sort: ProductSortEnum.optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { sort } = input;
      const limit = input.limit ?? 10;
      const sid = ctx.sid;
      const orderBy = {
        [sort?.split("-")[0] || ""]: sort?.split("-")[1] || "",
      };

      const result = await ctx.prisma.product.findMany({
        where: { sid },
        take: limit,
        orderBy: sort && sort !== "search" ? orderBy : { title: "asc" },
      });
      return result;
    }),
  create: protectedProcedure
    .input(
      z.object({
        data: ProductSchema.partial({ imageFiles: true, thumbnailFile: true }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, sid } = ctx;
      const { data } = input;
      const { moreDescr, thumbnailFile, imageFiles, ...rest } = data;

      const thumbnail = !!thumbnailFile
        ? await uploadImage(thumbnailFile, "thumbnail")
        : undefined;

      let images: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        const filesWPH = [
          { id: "1" },
          { id: "2" },
          { id: "3" },
          { id: "4" },
        ].map(
          (ph) =>
            imageFiles.find((file) => ph.id === file.id) || {
              id: ph.id,
              url: "",
            }
        );
        for await (const file of filesWPH) {
          images.push(file.url ? await uploadImage(file.url, "product") : "");
        }
      }

      const payload = {
        ...rest,
        thumbnail,
        images: imageFiles && imageFiles.length > 0 ? images : undefined,
        sid,
      };
      return await prisma.product.create({ data: payload });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        data: ProductSchema.partial(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, data } = input;
      const { moreDescr, thumbnailFile, imageFiles, ...rest } = data;

      const thumbnail = !!thumbnailFile
        ? await uploadImage(thumbnailFile, "thumbnail")
        : undefined;

      let images: string[] = [];

      if (imageFiles && imageFiles.length > 0) {
        let uploadFiles: { id: string; url: string | null }[] = [];
        const product = await ctx.prisma.product.findUnique({
          where: { id },
        });
        if (!product) return;
        const oldImages = product?.images.map((image, index) => ({
          id: (index + 1).toString(),
          url: image,
        }));

        const imagesPH = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];
        const filesWPH = imagesPH.map(
          (ph) =>
            imageFiles.find((file) => ph.id === file.id) || {
              id: ph.id,
              url: null,
            }
        );

        for await (const file of filesWPH) {
          uploadFiles.push({
            id: file.id,
            url: file.url ? await uploadImage(file.url, "product") : null,
          });
        }
        const uploadedImages = uploadFiles.map((uf) =>
          uf.url
            ? uf.url
            : oldImages.find((ifile) => ifile.id === uf.id)?.url || ""
        );
        images.push(...uploadedImages);
      }

      const update = {
        ...rest,
        thumbnail,
        images: imageFiles && imageFiles.length > 0 ? images : undefined,
      };
      return ctx.prisma.product.update({ where: { id }, data: update });
    }),
});
