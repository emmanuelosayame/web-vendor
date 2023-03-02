import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { type File } from "formidable";
import sharp from "sharp";
import { storage } from "utils/f-admin";
import { nanoid } from "nanoid";

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uploadId = req.query.id?.toString();
  const fn = req.query.name?.toString();

  const filename = fn ? fn + nanoid(5) : nanoid(18);

  switch (uploadId) {
    case "product": {
      const { files } = await formidablePromise(req);
      const image = files.image as File;

      const resizedFile = await sharp(image.filepath)
        .resize({ width: 500 })
        .toBuffer();

      const bucket = storage.bucket();
      const storageFile = bucket.file(`products/${filename}` || "");
      await storageFile.save(resizedFile, { contentType: "image/webp" || "" });

      const [metadata] = await storageFile.getMetadata();
      const downloadURL = metadata.mediaLink as string;

      res.status(200).json({ url: downloadURL });
    }
  }

  res.status(404).json("no path exists");
}

export const config = {
  api: {
    bodyParser: false,
  },
};
