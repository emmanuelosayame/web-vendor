import ReactCrop, { type Area } from "react-easy-crop";
import { Content, Root } from "@radix-ui/react-dialog";
import {
  type RefObject,
  useState,
  type SetStateAction,
  useCallback,
} from "react";
import getCroppedImg from "./product/helper";
import { LoadingBlur } from "./Loading";

interface Props {
  open: string | null;
  setOpen: (value: SetStateAction<string | null>) => void;
  previewUrl?: string;
  handleCropped: (cropppedImage: File, opened: string) => void;
  imageRef: RefObject<HTMLInputElement>;
  aspect?: number;
}

const SelectImage = ({
  open,
  previewUrl,
  setOpen,
  handleCropped,
  imageRef,
  aspect = 1,
}: Props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleSelected = async () => {
    if (!previewUrl || !croppedAreaPixels || !open) return;
    setLoading(true);
    const croppedImage = await getCroppedImg(
      previewUrl,
      croppedAreaPixels,
      open
    );
    setLoading(false);
    if (!croppedImage) return;
    handleCropped(croppedImage, open);
  };

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  return (
    <>
      {loading && <LoadingBlur />}

      <Root open={!!open} onOpenChange={(state) => !state && setOpen(null)}>
        <Content
          className="fixed outline-none z-40 top-1/2 -translate-y-1/2
          left-1/2 -translate-x-1/2 w-auto  
        rounded-lg drop-shadow-md flex flex-col gap-3 justify-center items-center
         bg-white border border-neutral-300 p-3"
        >
          <div
            className="relative flex flex-col h-[358px] md:h-[500px] 
          w-[358px] md:w-[500px] rounded-md overflow-hidden"
          >
            {!!previewUrl ? (
              <ReactCrop
                image={previewUrl}
                aspect={aspect}
                crop={crop}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                // objectFit=""
                classes={{
                  containerClassName: "bg-black/40",
                  cropAreaClassName:
                    "border border-red-500 rounded-md outline-none",
                }}
              />
            ) : (
              <div
                className="m-auto bg-black/50 w-full h-full rounded-md opacity-70
               flex justify-center items-center text-white text-xl"
              >
                <p>upload image</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 items-center w-full">
            <button
              type="button"
              className={!!previewUrl ? "btn-amber" : "btn-green"}
              onClick={() => {
                imageRef.current?.click();
              }}
            >
              {!!previewUrl ? "Change" : "Choose image"}
            </button>
            <button
              disabled={!previewUrl}
              type="button"
              className={!!previewUrl ? "btn-green" : "hidden"}
              onClick={handleSelected}
            >
              Select
            </button>
          </div>
        </Content>
      </Root>
    </>
  );
};

export default SelectImage;
