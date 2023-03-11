import { type File } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";
import { formidablePromise, uploadImage } from ".";
import { prisma } from "src/server/db";

interface Args {
  req: NextApiRequest;
  res: NextApiResponse;
}

export const uploadAsset = async ({ req, res }: Args) => {
  try {
    const { files, fields } = await formidablePromise(req, { multiples: true });

    const imageFile = files.file as File;
    const tag = fields.tag?.toString();
    const id = fields.id?.toString();
    const imageId = fields.imageId?.toString();

    const url = await uploadImage(imageFile.filepath, {
      newFileName: imageFile.originalFilename,
      storagePath: "assets",
    });
    if (!tag) {
      res.status(400).send({ error: "INCOMPLETE PAYLOAD" });
      return;
    }
    const prevData = await prisma.asset.findFirst({ where: { id } });
    const prevImages = prevData?.images.map((img, index) => ({
      id: (index + 1).toString(),
      ...img,
    }));
    if (!prevData) {
      res.status(500).send({ error: "CANNOT FIND RELATION" });
    }
    if (imageId === "new") {
      await prisma.asset.update({
        where: { id },
        data: {
          images: {
            push: { tag, url },
          },
        },
      });
    } else {
      const images = prevImages?.map((image) => ({
        tag: image.tag,
        url: image.id === imageId ? url : image.url,
      }));
      await prisma.asset.update({
        where: { id },
        data: {
          images,
        },
      });
    }

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err as any);
  }
};
