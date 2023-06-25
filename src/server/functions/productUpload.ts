import { deleteImage, uploadImage } from ".";
import { prisma } from "src/server/db";
import { ProductSchema } from "../zod";
import type { Product, ProductVariant } from "@prisma/client";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const uploadProduct = async (req: Request) => {
  const res = NextResponse;
  const sid = cookies().get("sid")?.value;

  try {
    const payload = await req.formData();

    const pid = payload.get("pid")?.toString();
    const thumbnailFile = payload.get("thumbnail") as unknown as File | null;
    const imageFiles = payload.getAll("images") as unknown as File[];
    const newVImages = payload.getAll("newVImages") as unknown as File[];
    const updatedVImages = payload.getAll(
      "updatedVImages"
    ) as unknown as File[];
    const json = payload.get("json")?.toString();

    if (!pid) return res.json("NO PID", { status: 403 });

    const variantFiles = {
      new: newVImages,
      updated: updatedVImages,
    };

    const parsedPayload = json && JSON.parse(json);

    if (pid !== "new") {
      const { variantsPayload, ...rest } =
        ProductSchema.partial().parse(parsedPayload);
      const prevData = await prisma.product.findUnique({ where: { id: pid } });
      const { mainImages, thumbnail, variants } = await handleImages({
        imageFiles,
        thumbnailFile,
        prevData,
        variantFiles,
        variantsPayload,
      });

      const data = await prisma.product.update({
        where: { id: pid },
        data: { thumbnail, images: mainImages, variants, ...rest, sid },
      });

      return res.json({ ...data, mtype: "update" });
    }
    //if new product
    else {
      if (!thumbnailFile || !imageFiles || !variantFiles)
        return res.json("NO FILE", { status: 403 });

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
      return res.json({ ...data, mtype: "create" });
    }
  } catch (err) {
    return res.json(err, { status: 500 });
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
  thumbnailFile: File | null | undefined;
  imageFiles: File[];
  variantFiles: { new: File[]; updated: File[] };
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
    thumbnail = await uploadImage(thumbnailFile, {
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
          ? variantFiles.updated.find((file) => file.name === variant.id) ||
            null
          : null;

        variants.push({
          ...variant,
          price: matchedV?.price || variant.price,
          options: matchedV?.options || variant.options,
          title: matchedV?.title || variant.title,
          image: matchedFile
            ? await uploadImage(matchedFile, {
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
        const file = variantFiles.new
          ? variantFiles.new.find((file) => file.name === variant.id) || null
          : null;
        const id = nanoid();
        variants.push({
          image: file
            ? await uploadImage(file, { newFileName: `variant-${id}` })
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

    for await (const file of imageFiles.sort(
      (a, b) => Number(a.name.slice(0, 1)) - Number(b.name.slice(0, 1))
    )) {
      const oldUrl = prevImages?.find(
        (img) => img.id === file.name.slice(0, 1)
      )?.url;

      mainImages.push(
        file
          ? await uploadImage(file, {
              newFileName: `product-${file.name.slice(0, 1)}`,
              oldUrl,
            })
          : oldUrl || ""
      );
    }
  }

  return {
    thumbnail,
    mainImages: mainImages.length > 0 ? mainImages : undefined,
    variants: variantFiles || variantsPayload ? variants : undefined,
  };
};
