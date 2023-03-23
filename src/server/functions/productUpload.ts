import { type File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { formidablePromise, uploadImage } from ".";
import { prisma } from "src/server/db";
import { ProductSchema } from "../schema";
import type { Product, ProductVariant } from "@prisma/client";
import { nanoid } from "nanoid";

interface Args {
  req: NextApiRequest;
  res: NextApiResponse;
}

export const uploadProduct = async ({ req, res }: Args) => {
  try {
    const { fields, files } = await formidablePromise(req, { multiples: true });
    const id = fields.id?.toString();
    if (id) {
      const thumbnailFile = files.thumbnail as File;
      const imageFiles = files.mainImages as File | File[];
      const variantFiles = files.variantFiles as File | File[];
      const parsedPayload =
        fields.payload && JSON.parse(fields.payload.toString());

      if (id !== "new") {
        const { variantsPayload, ...rest } =
          ProductSchema.partial().parse(parsedPayload);
        const prevData = await prisma.product.findUnique({ where: { id } });
        const { mainImages, thumbnail, variants } = await handleImages({
          imageFiles,
          thumbnailFile,
          prevData,
          variantFiles,
          variantsPayload,
        });
        const data = await prisma.product.update({
          where: { id },
          data: { thumbnail, images: mainImages, variants, ...rest },
        });
        res.status(200).json(data);
      }
      //if new product
      else {
        if (!thumbnailFile && !imageFiles && !variantFiles) {
          res.status(500).json("no file");
          return;
        }
        const { variantsPayload, ...rest } = ProductSchema.parse(parsedPayload);

        const { mainImages, thumbnail, variants } = await handleImages({
          imageFiles,
          thumbnailFile,
          variantFiles,
          variantsPayload,
        });
        const data = prisma.product.create({
          data: { ...rest, images: mainImages, variants, thumbnail },
        });

        res.status(200).json({ status: "success" });
      }
    } else res.status(400).send("no identifier");
    return;
  } catch (err) {
    res.status(500).send(err as any);
  }
};

interface HandleImageProps {
  prevData?: Product | null;
  thumbnailFile: File;
  imageFiles: File | File[];
  variantFiles: File | File[];
  variantsPayload?: {
    title: string;
    price: number;
    options: {
      k: string;
      v: string;
    }[];
  }[];
}

const handleImages = async ({
  prevData,
  thumbnailFile,
  imageFiles,
  variantFiles,
  variantsPayload,
}: HandleImageProps) => {
  let thumbnail: string | undefined = undefined;
  let mainImages: string[] = [];
  let variants: ProductVariant[] = [];

  if (thumbnailFile) {
    thumbnail = await uploadImage(thumbnailFile.filepath, {
      newFileName: "thumbnail",
      oldUrl: prevData?.thumbnail,
    });
  }

  if (variantFiles || variantsPayload) {
    const prevImages =
      prevData?.variants.map((varnt, index) => ({
        id: (index + 1).toString(),
        url: varnt.image,
      })) || [];
    if (!Array.isArray(variantFiles)) {
    } else {
      const filesWPH = ["1", "2", "3", "4", "5"].map((ph) => ({
        id: ph,
        path:
          variantFiles.find((file) => ph === file.originalFilename?.slice(0, 1))
            ?.filepath || null,
      }));
      for await (const file of filesWPH) {
        const oldUrl = prevImages?.find((img) => img.id === file.id)?.url || "";
        const vPayload = variantsPayload?.find((varnt, index) =>
          (index + 1).toString()
        );
        const oldVPayload = prevData?.variants?.find((varnt, index) =>
          (index + 1).toString()
        );
        variants.push({
          id: oldVPayload?.id || nanoid(10),
          image: file.path
            ? await uploadImage(file.path, {
                newFileName: `product-variant-${file.id}`,
                oldUrl,
              })
            : oldUrl,
          options: vPayload ? vPayload.options : oldVPayload?.options || [],
          price: vPayload ? vPayload.price : oldVPayload?.price || 0,
          title: vPayload ? vPayload.title : oldVPayload?.title || "",
          sku: oldVPayload?.sku || nanoid(15),
          updatedAt: Date.now().toString(),
        });
      }
    }
  }

  if (imageFiles) {
    const prevImages =
      prevData?.images.map((image, index) => ({
        id: (index + 1).toString(),
        url: image,
      })) || [];
    if (Array.isArray(imageFiles)) {
      const filesWPH = ["1", "2", "3", "4"].map((ph) => ({
        id: ph,
        path:
          imageFiles.find((file) => ph === file.originalFilename?.slice(0, 1))
            ?.filepath || null,
      }));

      for await (const file of filesWPH) {
        const oldUrl = prevImages?.find((img) => img.id === file.id)?.url;
        mainImages.push(
          file.path
            ? await uploadImage(file.path, {
                newFileName: `product-${file.id}`,
                oldUrl,
              })
            : oldUrl || ""
        );
      }
    }
    // not array
    else {
      const imgId = imageFiles.originalFilename?.slice(0, 1);
      const filesWPH = ["1", "2", "3", "4"].map((ph) => ({
        id: ph,
        path: imgId === ph ? imageFiles.filepath : null,
      }));
      for await (const file of filesWPH) {
        const prevUrl =
          prevImages?.find((prev) => file.id === prev.id)?.url || undefined;
        mainImages.push(
          file.path
            ? await uploadImage(imageFiles.filepath, {
                newFileName: `product-${imageFiles.originalFilename?.slice(
                  0,
                  1
                )}`,
                oldUrl: prevUrl,
              })
            : prevUrl || ""
        );
      }
    }
  }

  return {
    thumbnail,
    mainImages: mainImages.length > 0 ? mainImages : undefined,
    variants: variantFiles || variantsPayload ? variants : undefined,
  };
};
