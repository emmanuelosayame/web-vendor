import { TDivider, TFlex, THStack } from "@components/TElements";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/solid";
import type { Product } from "@prisma/client";
import { Content, Root } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useRef, useState } from "react";
import ReactCrop, { type PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { type FormValues } from "utils/placeholders";
import image from "public/logo3.png";

interface Props {
  data?: Product | null;
  formikValues: FormValues;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  pid?: string;
}

const Gallery = ({ data, formikValues, setFieldValue, pid }: Props) => {
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const imagesPH = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }];

  const [open, setOpen] = useState(false);
  const [thumbnailPrev, setTNP] = useState(image.src);
  const [crop, setCrop] = useState<PixelCrop>();
  const handleThumbnail = (file: File) => {
    if (thumbnailPrev && thumbnailPrev.slice(0, 5) === "blob:")
      URL.revokeObjectURL(thumbnailPrev);
    setTNP(URL.createObjectURL(file));
  };

  const images = data?.images;

  const [currentG, setCG] = useState<string | undefined>();

  const [imagesPrev, setIP] = useState<{ id: string; url: string }[]>(
    imagesPH.map((imagePH) => {
      return { id: imagePH.id, url: "" };
    })
  );

  const handleGC = (id: string, file: File) => {
    const currentPrev = imagesPrev.find((prev) => prev.id === id);
    if (currentPrev && currentPrev.url.slice(0, 5) === "blob:")
      URL.revokeObjectURL(currentPrev.url);
    const updatedIP = { id, url: URL.createObjectURL(file) };
    setIP((state) => [...state.filter((prev) => prev.id !== id), updatedIP]);
  };

  const removeGallery = (id: string) => {
    const currentPrev = imagesPrev.find((prev) => prev.id === id);
    const serverUrl =
      images?.find((url, index) => id === index.toString()) || "";
    if (currentPrev && currentPrev.url.slice(0, 5) === "blob:")
      URL.revokeObjectURL(currentPrev.url);
    setIP((state) => [
      ...state.filter((prev) => prev.id !== id),
      { id, url: serverUrl },
    ]);
  };

  return (
    <>
      <Root open={open} onOpenChange={setOpen}>
        <Content
          className="fixed outline-none z-40 bg-white md:w-[450px] h-full md:h-[500px]
           top-1/2 -translate-y-1/2 inset-x-2 rounded-lg drop-shadow-md border border-neutral-200
         p-2 md:left-1/2 md:-translate-x-1/2 flex flex-col justify-between items-center"
        >
          <h3 className="text-center">crop image</h3>
          <ReactCrop
            aspect={1}
            crop={crop}
            onChange={(c) => setCrop(c)}
            className="rounded-md flex"
            disabled={!formikValues.thumbnailFile}
          >
            <Image
              alt=""
              src={thumbnailPrev}
              className=""
              width={1000}
              height={1000}
            />
          </ReactCrop>

          <div className="flex gap-2 items-center p-1 w-3/5">
            <button
              type="button"
              className={formikValues.thumbnailFile ? "btn-amber" : "btn-green"}
              onClick={() => {
                thumbnailRef.current?.click();
              }}
            >
              {formikValues.thumbnailFile ? "Change" : "Choose image"}
            </button>
            <button
              type="button"
              className={formikValues.thumbnailFile ? "btn-green" : "hidden"}
            >
              Select
            </button>
          </div>
        </Content>
      </Root>
      <div className="rounded-lg p-2 col-span-5 row-span-3 h-full bg-white">
        <h3>Product Gallery</h3>
        <TDivider />
        <THStack className="relative flex-wrap justify-center gap-5 md:flex-nowrap md:gap-1">
          <div>
            <TFlex className="py-2 items-center gap-2">
              <h3>Thumbnail</h3>
              <button
                type="button"
                className="text-orange-500 rounded-full p-1.5 ml-2 bg-orange-200 drop-shadow-md"
                onClick={() => setOpen(true)}
              >
                <PlusIcon width={20} />
              </button>
              <button
                type="button"
                className="text-orange-500 rounded-full p-1.5 bg-orange-200 drop-shadow-md"
              >
                <ArchiveBoxXMarkIcon width={20} />
              </button>
            </TFlex>
            <div
              className="w-40 h-40 rounded-lg bg-black/60 flex justify-center items-center
                   text-white"
            >
              <p>upload thumbnail</p>
            </div>
          </div>
          {/* thumbnal end */}
          <input
            hidden
            ref={thumbnailRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setFieldValue("thumbnailFile", file);
              handleThumbnail(file);
            }}
          />
          <input
            hidden
            ref={galleryRef}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file || !currentG) return;
              setFieldValue("imageFiles", [
                ...formikValues.imageFiles.filter((img) => img.id !== currentG),
                { id: currentG, file },
              ]);
              handleGC(currentG, file);
            }}
          />
          {imagesPrev
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((image) => (
              <div key={image.id}>
                <TFlex className="py-2 items-center gap-2 justify-center">
                  <button
                    type="button"
                    className="text-orange-500 rounded-full p-1.5 ml-2
                         bg-orange-200 drop-shadow-md"
                    onClick={() => {
                      setCG(image.id);
                      galleryRef.current?.click();
                    }}
                  >
                    <PlusIcon width={20} />
                  </button>
                  <button
                    type="button"
                    className="text-orange-500 rounded-full p-1.5 bg-orange-200 drop-shadow-md"
                    onClick={() => {
                      setFieldValue(
                        "imageFiles",
                        formikValues.imageFiles.filter((img) => img.id !== pid)
                      );
                      removeGallery(image.id);
                    }}
                  >
                    <ArchiveBoxXMarkIcon width={20} />
                  </button>
                </TFlex>
                {image.url ? (
                  <Image
                    alt=""
                    src={image.url}
                    width={200}
                    height={200}
                    className="w-40 h-40 rounded-md"
                  />
                ) : (
                  <div
                    className="w-40 h-40 rounded-lg bg-black/60 flex justify-center items-center
                   text-white"
                  >
                    <p>upload image</p>
                  </div>
                )}
              </div>
            ))}
        </THStack>
        <h3 className="mt-3">More Descriptions</h3>
        <TDivider className="mb-4" />
        <THStack className="flex-wrap justify-center gap-5 md:flex-nowrap md:gap-1">
          {imagesPH.slice(0, 2).map((image) => (
            <div key={image.id} className="flex flex-col md:flex-row gap-2">
              <div>
                <TFlex className="pb-2 items-center gap-2 justify-center">
                  <button
                    type="button"
                    className="text-orange-500 rounded-full p-1.5 ml-2 bg-orange-200 drop-shadow-md"
                  >
                    <PlusIcon width={20} />
                  </button>
                  <button
                    type="button"
                    className="text-orange-500 rounded-full p-1.5 bg-orange-200 drop-shadow-md"
                  >
                    <ArchiveBoxXMarkIcon width={20} />
                  </button>
                </TFlex>
                <div
                  className="w-40 h-40 rounded-lg bg-black/60 flex justify-center items-center
                   text-white"
                >
                  <p>upload image</p>
                </div>
              </div>
              <div className="w-40 md:w-full">
                <textarea
                  className="bg-white rounded-lg ring-1 ring-neutral-300 w-full
                         outline-none py-1 px-2 resize-none"
                  placeholder="enter subject"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </THStack>
      </div>
    </>
  );
};

export default Gallery;
