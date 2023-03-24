import type { NextApiRequest } from "next";
import formidable, { type File } from "formidable";
import { nanoid } from "nanoid";
import { storage } from "utils/f-admin";

const bucket = storage.bucket();

export function formidablePromise(
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

export const getStoragePath = (url: string | null | undefined) => {
  if (!url) return;
  const bucket = process.env.FIREBASE_BUCKET;
  if (!bucket) throw new Error("no bucket");
  const urlObject = new URL(url);
  if (urlObject.host === "firebasestorage.googleapis.com")
    return decodeURIComponent(urlObject.pathname.substring(1)).slice(
      `v0/b/${bucket}/o/`.length
    );
};

export const uploadImage: (
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

export const deleteImage = async (url: string) => {
  const path = getStoragePath(url);
  console.log(path);
  if (!path) return;
  await bucket.file(path).delete();
};
