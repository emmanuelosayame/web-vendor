import { nanoid } from "nanoid";
import { storage } from "@lib/f-admin";

const bucket = storage.bucket();

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
  file: File,
  upload: {
    newFileName?: string | null;
    oldUrl?: string | null;
    storagePath?: string;
  }
) => Promise<string> = async (
  file,
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

  const bf = Buffer.from(await file.arrayBuffer());

  const fileUpload = bucket.file(filePath);

  await fileUpload.save(bf, {
    contentType: "image/webp",
    metadata: {
      firebaseStorageDownloadTokens: nanoid(18),
    },
  });

  const [metadata] = await fileUpload.getMetadata();

  return createPersistentDownloadUrl(
    metadata.bucket,
    metadata.name,
    metadata.metadata.firebaseStorageDownloadTokens
  );
};

export const deleteImage = async (url: string) => {
  const path = getStoragePath(url);
  if (!path) return;
  await bucket.file(path).delete();
};
