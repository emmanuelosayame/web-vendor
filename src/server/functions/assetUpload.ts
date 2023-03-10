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
    if (imageId === "new") {
      const prevData = await prisma.asset.findFirst({ where: { id } });
      if (!prevData) {
        res.status(500).send({ error: "CANNOT FIND RELATION" });
      } else
        await prisma.asset.update({
          where: { id },
          data: {
            images: {
              push: { id: (prevData.images.length + 1).toString(), tag, url },
            },
          },
        });
    } else {
      await prisma.asset.update({
        where: { id },
        data: {
          images: {
            updateMany: {
              where: { id: imageId },
              data: { id: imageId, tag, url },
            },
          },
        },
      });
    }

    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).send(err as any);
  }
};
