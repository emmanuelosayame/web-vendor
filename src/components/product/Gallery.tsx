import { TDivider, TFlex, THStack } from "@components/TElements";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { type ChangeEvent, useRef, useState } from "react";
import "react-easy-crop/react-easy-crop.css";
import { type FormValues } from "utils/placeholders";
import SelectImage from "@components/SelectImage";

interface Props {
  thumbnail: string | undefined;
  images?: { id: string; url: string }[];
  formikValues: FormValues;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  pid?: string;
}

const imagesPH = ["1", "2", "3", "4"];

const Gallery = ({
  thumbnail,
  images,
  formikValues,
  setFieldValue,
  pid,
}: Props) => {
  const imageRef = useRef<HTMLInputElement>(null);

  const [croppedTN, setCTNP] = useState(thumbnail);

  const [croppedGP, setCGP] = useState(
    imagesPH.map((ph) => ({
      id: ph,
      url: images?.find((fileUrl) => fileUrl.id === ph)?.url || "",
    }))
  );

  const [open, setOpen] = useState<string | "thumbnail" | null>(null);
  const [thumbnailPrev, setTNP] = useState<string | undefined>();
  const [imagesPrev, setIP] = useState<{ id: string; url: string }[]>(
    imagesPH.map((id) => {
      return { id, url: "" };
    })
  );

  const openPrev = () => {
    switch (open) {
      case "thumbnail":
        return { id: "thumbnail", url: thumbnailPrev };
      case "1":
      case "2":
      case "3":
      case "4":
        return imagesPrev.find((file) => open === file.id);
      default:
        return undefined;
    }
  };

  const preview = openPrev();

  const handleGP = (id: string, file: File) => {
    const currentPrev = imagesPrev.find((prev) => prev.id === id);
    if (currentPrev && currentPrev.url.slice(0, 5) === "blob:") {
      URL.revokeObjectURL(currentPrev.url);
    }
    const updatedIP = { id, url: URL.createObjectURL(file) };
    setIP((state) => [...state.filter((prev) => prev.id !== id), updatedIP]);
  };

  const removeGallery = (id: string) => {
    const currentPrev = imagesPrev.find((prev) => prev.id === id);
    const serverUrl =
      images?.find((imageFile) => id === imageFile.id)?.url || "";
    if (currentPrev && currentPrev.url.slice(0, 5) === "blob:")
      URL.revokeObjectURL(currentPrev.url);
    setCGP((state) => [
      ...state.filter((prev) => prev.id !== id),
      { id, url: serverUrl },
    ]);
    setFieldValue(
      "imageFiles",
      formikValues.imageFiles.filter((f) => f.id !== id)
    );
  };

  const handlePreview = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    switch (open) {
      case "thumbnail":
        if (thumbnailPrev && thumbnailPrev.slice(0, 5) === "blob:")
          URL.revokeObjectURL(thumbnailPrev);
        setTNP(URL.createObjectURL(file));
        break;
      case "1":
      case "2":
      case "3":
      case "4":
        handleGP(open, file);
        break;
      default:
        return;
    }
  };

  const handleCGP = (id: string, croppedImage: File) => {
    const currentPrev = croppedGP.find((f) => f.id === id)?.url;
    if (currentPrev && currentPrev.slice(0, 5) === "blob:")
      URL.revokeObjectURL(currentPrev);
    setCGP((state) => [
      ...state.filter((prev) => id !== prev.id),
      { id, url: URL.createObjectURL(croppedImage) },
    ]);
    setFieldValue("imageFiles", [
      ...formikValues.imageFiles.filter((file) => file.id !== id),
      { id, file: croppedImage },
    ]);
  };

  const handleCropped = async (croppedImage: File, opened: string) => {
    switch (opened) {
      case "thumbnail":
        if (croppedTN && croppedTN.slice(0, 5) === "blob:")
          URL.revokeObjectURL(croppedTN);
        setCTNP(URL.createObjectURL(croppedImage));
        setFieldValue("thumbnailFile", croppedImage);
        break;
      case "1":
      case "2":
      case "3":
      case "4":
        handleCGP(opened, croppedImage);
    }
    setOpen(null);
  };

  return (
    <>
      <SelectImage
        open={open}
        previewUrl={preview?.url}
        setOpen={setOpen}
        handleCropped={handleCropped}
        imageRef={imageRef}
      />

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
                onClick={() => setOpen("thumbnail")}
              >
                <PlusIcon width={20} />
              </button>
              <button
                type="button"
                className="text-orange-500 rounded-full p-1.5 bg-orange-200 drop-shadow-md"
                onClick={() => {
                  // setTNP(undefined);
                  setCTNP(undefined);
                  setFieldValue("thumbnailFile", null);
                }}
              >
                <ArchiveBoxXMarkIcon width={20} />
              </button>
            </TFlex>
            {croppedTN || croppedTN ? (
              <Image
                alt=""
                src={croppedTN}
                width={200}
                height={200}
                className="w-40 h-40 rounded-md"
              />
            ) : (
              <div
                className="w-40 h-40 rounded-lg bg-black/60 flex justify-center items-center
                   text-white"
              >
                <p>upload thumbnail</p>
              </div>
            )}
          </div>
          {/* thumbnal end */}
          <input
            hidden
            ref={imageRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handlePreview}
          />

          {croppedGP
            .sort((a, b) => Number(a.id) - Number(b.id))
            .map((image) => (
              <div key={image.id}>
                <TFlex className="py-2 items-center gap-2 justify-center">
                  <button
                    type="button"
                    className="text-orange-500 rounded-full p-1.5 ml-2
                         bg-orange-200 drop-shadow-md"
                    onClick={() => {
                      setOpen(image.id);
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
                        formikValues.imageFiles.filter(
                          (img) => img.id !== image.id
                        )
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
        {/* <h3 className="mt-3">More Descriptions</h3>
        <TDivider className="mb-4" />
        <THStack className="flex-wrap justify-center gap-5 md:flex-nowrap md:gap-1">
          {imagesPH.slice(0, 2).map((image) => (
            <div key={image} className="flex flex-col md:flex-row gap-2">
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
        </THStack> */}
      </div>
    </>
  );
};

export default Gallery;
