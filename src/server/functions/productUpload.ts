import { type File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { formidablePromise, uploadImage } from ".";
import { prisma } from "src/server/db";
import { ProductSchema } from "../schema";
import type { Product } from "@prisma/client";

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
        const { variants, ...rest } =
          ProductSchema.partial().parse(parsedPayload);
        const prevData = await prisma.product.findUnique({ where: { id } });
        const { mainImages, thumbnail } = await handleImages({
          imageFiles,
          thumbnailFile,
          prevData,
        });
        const data = await prisma.product.update({
          where: { id },
          data: { thumbnail, images: mainImages, ...rest },
        });
        res.status(200).json(data);
      }
      //if new product
      else {
        if (!thumbnailFile && !imageFiles && !variantFiles) {
          res.status(500).json("no file");
          return;
        }
        const { variants, ...rest } = ProductSchema.parse(parsedPayload);

        const { mainImages, thumbnail } = await handleImages({
          imageFiles,
          thumbnailFile,
        });
        const data = prisma.product.create({
          data: { ...rest, images: mainImages, thumbnail },
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
}

const handleImages = async ({
  prevData,
  thumbnailFile,
  imageFiles,
}: HandleImageProps) => {
  let thumbnail: string | undefined = undefined;
  let mainImages: string[] = [];

  if (thumbnailFile) {
    thumbnail = await uploadImage(thumbnailFile.filepath, {
      newFileName: "thumbnail",
      oldUrl: prevData?.thumbnail,
    });
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
  };
};
