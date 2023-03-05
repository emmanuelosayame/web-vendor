import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { type File } from "formidable";
import { storage } from "utils/f-admin";
import { nanoid } from "nanoid";
import { getServerAuthSession } from "src/server/auth";
import { prisma } from "src/server/db";
import { getStoragePath } from "utils/helpers";

const bucket = storage.bucket();

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

const createPersistentDownloadUrl = (
  bucket: string,
  pathToFile: string,
  downloadToken: string
) => {
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
    pathToFile
  )}?alt=media&token=${downloadToken}`;
};

const uploadImage: (
  filepath: string,
  upload: {
    newFileName?: string | null;
    oldUrl?: string | null;
    storagePath?: string;
  }
) => Promise<string> = async (
  filepath,
  { newFileName, oldUrl, storagePath = "products" }
) => {
  const fileName = newFileName
    ? newFileName + "-" + nanoid(15)
    : storagePath.slice(0, storagePath.length - 1) + "-" + nanoid(16);

  const filePath =
    getStoragePath(oldUrl) ||
    `${
      process.env.NODE_ENV === "development"
        ? `${storagePath}-dev`
        : storagePath
    }/${fileName}.webp`;

  const [uploadRes] = await bucket.upload(filepath, {
    destination: filePath,
    contentType: "image/webp",
    metadata: {
      cacheControl: `public,max-age=31536000`,
      contentDisposition: `attachment; filename*=utf-8\'\'${fileName}`,
      metadata: {
        firebaseStorageDownloadTokens: nanoid(18),
      },
    },
  });

  const [metadata] = await uploadRes.getMetadata();

  return createPersistentDownloadUrl(
    metadata.bucket,
    metadata.name,
    metadata.metadata.firebaseStorageDownloadTokens
  );
};

interface TNextApiRequest extends NextApiRequest {
  query: {
    type: string | string[];
    id: string | string[];
  };
}

export default async function handler(
  req: TNextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id?.toString();
  if (id) {
    const session = await getServerAuthSession({ req, res });
    if (session && session.user) {
      if (req.method === "PUT") {
        const type = req.query.type?.toString() || "product";

        switch (type) {
          case "product": {
            const { files } = await formidablePromise(req, { multiples: true });
            const thumbnailFile = files.single as File;
            const imageFiles = files.multiple as File | File[];

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
                    imageFiles.find(
                      (file) => ph === file.originalFilename?.slice(0, 1)
                    )?.filepath || null,
                }));

                for await (const file of filesWPH) {
                  const oldUrl = prevImages?.find(
                    (img) => img.id === file.id
                  )?.url;

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
                    prevImages?.find((prev) => file.id === prev.id)?.url ||
                    undefined;
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
          }
        }
      } else res.status(500).json("invalid request");
    } else res.status(400).json("unauthenticated");
  } else res.status(400).json("no identifier");
}

export const config = {
  api: {
    bodyParser: false,
  },
};
