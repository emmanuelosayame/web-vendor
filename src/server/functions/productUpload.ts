import { type File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { formidablePromise, uploadImage } from ".";
import { prisma } from "src/server/db";

interface Args {
  req: NextApiRequest;
  res: NextApiResponse;
}

export const uploadProduct = async ({ req, res }: Args) => {
  try {
    const { files, fields } = await formidablePromise(req, { multiples: true });
    const thumbnailFile = files.single as File;
    const imageFiles = files.multiple as File | File[];

    const id = fields.id?.toString();

    if (!thumbnailFile && !imageFiles) {
      res.status(500).json("no file");
      return;
    }

    const prevData = await prisma.product.findUnique({ where: { id } });

    let thumbnail: string | undefined = undefined;
    let images: string[] = [];

    if (thumbnailFile) {
      thumbnail = await uploadImage(thumbnailFile.filepath, {
        newFileName: "thumbnail",
        oldUrl: prevData?.thumbnail,
      });
    }

    if (imageFiles) {
      const prevImages = prevData?.images.map((image, index) => ({
        id: (index + 1).toString(),
        url: image,
      }));
      if (Array.isArray(imageFiles)) {
        const filesWPH = ["1", "2", "3", "4"].map((ph) => ({
          id: ph,
          path:
            imageFiles.find((file) => ph === file.originalFilename?.slice(0, 1))
              ?.filepath || null,
        }));

        for await (const file of filesWPH) {
          const oldUrl = prevImages?.find((img) => img.id === file.id)?.url;

          images.push(
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
          images.push(
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

    await prisma.product.update({
      where: { id },
      data: { thumbnail, images },
    });

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err as any);
  }
};
