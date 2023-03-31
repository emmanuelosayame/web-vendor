import { type File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { deleteImage, formidablePromise, uploadImage } from ".";
import { prisma } from "src/server/db";
import { ProductSchema } from "../schema";
import type { Product, ProductVariant } from "@prisma/client";
import { nanoid } from "nanoid";
import { getCookies } from "cookies-next";

interface Args {
  req: NextApiRequest;
  res: NextApiResponse;
}

export const uploadProduct = async ({ req, res }: Args) => {
  const cookies = getCookies({ req, res });
  const sid = cookies?.sid;

  try {
    const { fields, files } = await formidablePromise(req, { multiples: true });
    const id = fields.id?.toString();
    if (id) {
      const thumbnailFile = files.thumbnail as File;
      const imageFiles = files.mainImages as File | File[];
      const variantFiles = {
        new: files.newVImages as File | File[],
        updated: files.updatedVImages as File | File[],
      };
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
          data: { thumbnail, images: mainImages, variants, ...rest, sid },
        });
        res.status(200).json({ ...data, mtype: "update" });
      }
      //if new product
      else {
        if (!thumbnailFile && !imageFiles && !variantFiles) {
          res.status(500).json("no file");
          return;
        }

        const { variantsPayload, ...rest } = ProductSchema.parse(parsedPayload);

        const {
          mainImages,
          thumbnail: thumbn,
          variants,
        } = await handleImages({
          imageFiles,
          thumbnailFile,
          variantFiles,
          variantsPayload,
        });
        const thumbnail = thumbn as string;
        const data = await prisma.product.create({
          data: { ...rest, images: mainImages, variants, thumbnail, sid },
        });
        res.status(200).json({ ...data, mtype: "create" });
      }
    } else res.status(400).send("no identifier");
    return;
  } catch (err) {
    res.status(500).send(err as any);
  }
};

type VType = {
  title: string;
  price: number;
  options: {
    k: string;
    v: string;
  }[];
};

interface HandleImageProps {
  prevData?: Product | null;
  thumbnailFile: File;
  imageFiles: File | File[];
  variantFiles: { new: File | File[]; updated: File | File[] };
  variantsPayload?: {
    new?: VType[];
    updated?: (VType & { id?: string })[];
    deleted?: string[];
  };
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
  let prevVariants: ProductVariant[] | undefined = prevData?.variants;
  let variants: ProductVariant[] = [];

  if (thumbnailFile) {
    thumbnail = await uploadImage(thumbnailFile.filepath, {
      newFileName: "thumbnail",
      oldUrl: prevData?.thumbnail,
    });
  }

  //delete
  if (variantsPayload?.deleted && variantsPayload?.deleted.length > 0) {
    for (const id of variantsPayload?.deleted) {
      const matchedVariant = prevVariants?.find((prevV) => prevV.id === id);
      if (matchedVariant) {
        prevVariants = prevVariants?.filter(
          (varnt) => matchedVariant.id !== varnt.id
        );
        await deleteImage(matchedVariant.image);
      }
    }
  }

  if (
    (variantsPayload?.updated && variantsPayload?.updated.length > 0) ||
    variantFiles.updated
  ) {
    if (prevVariants) {
      for (const variant of prevVariants) {
        const matchedV = variantsPayload?.updated?.find(
          (updated) => variant.id === updated.id
        );
        const matchedFile = variantFiles.updated
          ? Array.isArray(variantFiles.updated)
            ? variantFiles.updated.find(
                (file) => file.originalFilename === variant.id
              ) || null
            : variantFiles.updated.originalFilename === variant.id
            ? variantFiles.updated
            : null
          : null;
        variants.push({
          ...variant,
          price: matchedV?.price || variant.price,
          options: matchedV?.options || variant.options,
          title: matchedV?.title || variant.title,
          image: matchedFile
            ? await uploadImage(matchedFile.filepath, {
                newFileName: `variant-${variant.id}`,
                oldUrl: variant.image,
              })
            : variant.image,
          updatedAt: Date.now().toString(),
        });
      }
    }
  } else {
    variants = prevVariants || [];
  }

  if (
    (variantsPayload?.new && variantsPayload?.new.length > 0) ||
    variantFiles.new
  ) {
    if (variantsPayload?.new) {
      for (const variant of variantsPayload.new.map((vrnt, index) => ({
        ...vrnt,
        id: (index + 1).toString(),
      }))) {
        const filepath = variantFiles.new
          ? Array.isArray(variantFiles.new)
            ? variantFiles.new.find(
                (file) => file.originalFilename === variant.id
              )?.filepath || null
            : variant.id === variantFiles.new.originalFilename
            ? variantFiles.new.filepath
            : null
          : null;
        const id = nanoid();
        variants.push({
          image: filepath
            ? await uploadImage(filepath, { newFileName: `variant-${id}` })
            : "",
          options: variant.options,
          price: variant.price,
          sku: nanoid(20),
          title: variant.title,
          updatedAt: Date.now().toString(),
          id,
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
                newFileName: `product-${imgId}`,
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
