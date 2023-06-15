import { NextResponse } from "next/server";
import { uploadImage } from ".";
import { prisma } from "src/server/db";

export const uploadAsset = async (req: Request) => {
  const res = NextResponse;

  const payload = await req.formData();

  try {
    const imageFile = payload.get("file") as unknown as File | null;
    const tag = payload.get("tag")?.toString();
    const id = payload.get("id")?.toString();
    const imageId = payload.get("imageId")?.toString();

    if (!imageFile) return res.json("NO IMAGE", { status: 403 });

    const url = await uploadImage(imageFile, {
      newFileName: imageFile?.name,
      storagePath: "assets",
    });

    if (!tag) {
      return res.json({ error: "INCOMPLETE PAYLOAD" }, { status: 400 });
    }
    const prevData = await prisma.asset.findFirst({ where: { id } });
    const prevImages = prevData?.images.map((img, index) => ({
      id: (index + 1).toString(),
      ...img,
    }));
    if (!prevData) {
      return res.json({ error: "CANNOT FIND RELATION" }, { status: 500 });
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

    return res.json({ status: "success" });
  } catch (err) {
    return res.json({ error: err }, { status: 500 });
  }
};
