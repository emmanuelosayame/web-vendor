import { type Area } from "react-easy-crop";
import { nanoid } from "nanoid";

export const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

const getCroppedImg: (
  imageSrc: string,
  pixelCrop: Area,
  outputName: string,
  maxRes?: number,
  effect?: {
    rotation?: number;
    flip?: { horizontal: boolean; vertical: boolean };
  }
) => Promise<File | null> = async (
  imageSrc: string,
  pixelCrop: Area,
  outputName,
  maxRes = 1080
) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  const newWidth = image.width > 800 ? maxRes : image.width;
  const newHeight = Math.floor((image.height / image.width) * newWidth);
  const resolution = newWidth / image.width;

  // set canvas size to match the bounding box
  canvas.width = newWidth;
  canvas.height = newHeight;

  // translate canvas context to a central location to allow rotating and flipping around the center
  ctx.translate(newWidth / 2, newHeight / 2);
  // ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-newWidth / 2, -newHeight / 2);

  // draw rotated image
  ctx.drawImage(image, 0, 0, newWidth, newHeight);

  // croppedAreaPixels values are bounding box relative
  // extract the cropped image using these values

  const maxWidth = pixelCrop.width > 800 ? maxRes : pixelCrop.width;
  const maxHeight = Math.floor((pixelCrop.height / pixelCrop.width) * maxWidth);

  // console.log(maxWidth, canvas.width);

  const data = ctx.getImageData(
    pixelCrop.x * resolution,
    pixelCrop.y * resolution,
    maxWidth,
    maxHeight
  );

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = maxWidth;
  canvas.height = maxHeight;

  // paste generated rotate image at the top left corner
  ctx.putImageData(data, 0, 0);

  // As Base64 string
  // return canvas.toDataURL('image/jpeg');

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      canvas.toBlob(
        (compressedBlob) => {
          if (blob && compressedBlob) {
            const compressed = blob.size > compressedBlob.size;
            resolve(
              new File(
                [image.width > 800 ? blob : compressed ? compressedBlob : blob],
                outputName + ".webp",
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                }
              )
            );
          }
        },
        "image/webp",
        0.9
      );
    }, "image/webp");
  });
};

export default getCroppedImg;
