import LayoutA from "@components/Layout/Admin";
import Select from "@components/radix/Select";
import { MenuFlex, TFlex } from "@components/TElements";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PencilSquareIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { type NextPageWithLayout } from "@t/shared";
import Image from "next/image";
import { useRouter } from "next/router";
import { assetsSelectList } from "utils/list";
import img1 from "public/e7e850b1-79ff-4d42-9058-46bf415540a7.webp";
import img2 from "public/flashsale.png";
import {
  type Reducer,
  useReducer,
  type ReactNode,
  useState,
  useRef,
  type ChangeEvent,
} from "react";
import { api } from "utils/api";
import { LoadingBlur } from "@components/Loading";
import SelectImage from "@components/SelectImage";
import axios from "axios";

type Actions =
  | {
      type:
        | "increment-texts"
        | "increment-images"
        | "increment-deals"
        | "decrement-texts"
        | "decrement-images"
        | "decrement-deals";
      payload?: number;
    }
  | {
      type: "edit-texts" | "edit-images" | "edit-deals";
      payload?: boolean;
    };

const initialState = {
  ids: {
    texts: "1",
    images: "1",
    deals: "1",
  },
  edits: {
    texts: false,
    images: false,
    deals: false,
  },
};

const getAction = (action: string) => {
  const arr = action.split("-");
  if (arr.length > 1)
    return {
      type: arr[0] as "increment" | "decrement" | "edit",
      id: arr[1] as "images" | "texts" | "deals",
    };
  return {};
};
const reducer: Reducer<typeof initialState, Actions> = (state, actions) => {
  const action = getAction(actions.type);
  if (!action.id || !action.type) return state;

  switch (actions.type) {
    case "increment-deals":
    case "increment-images":
    case "increment-texts":
    case "decrement-deals":
    case "decrement-texts":
    case "decrement-images":
      const newIndex =
        action.type === "increment"
          ? Number(state.ids[action.id]) + 1
          : Number(state.ids[action.id]) - 1;
      return {
        ...state,
        ids: {
          ...state.ids,
          [action.id]: newIndex.toString(),
        },
        edits: {
          ...state.edits,
          [action.id]: state.edits[action.id] && false,
        },
      };
    case "edit-deals":
    case "edit-images":
    case "edit-texts":
      return {
        ...state,
        edits: { ...state.edits, [action.id]: !state.edits[action.id] },
      };
    default:
      return state;
  }
};

const AssetsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const imageRef = useRef<HTMLInputElement>(null);

  const { data, isFetching } = api.asset.one.useQuery({
    basepath: "",
    path: "/",
  });

  const [{ edits, ids }, dispatch] = useReducer(reducer, initialState);

  const activeText = data?.texts?.find((text) => ids.texts === text.id);
  const activeImage = data?.images?.find((image) => ids.images === image.id);

  const [open, setOpen] = useState<string | null>(null);

  const [prev, setPrev] = useState<{ id: string; url: string }>();
  const [croppedImage, setCroppedImage] = useState<{
    images?: { id: string; url: string; file: File | null };
    deals?: { id: string; url: string; file: File | null };
  }>({
    deals: { id: "server", url: "", file: null },
    images: { id: "server", url: "", file: null },
  });

  const handlePreview = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !open) return;
    if (prev?.url && prev.url.slice(0, 5) === "blob:") {
      URL.revokeObjectURL(prev?.url);
    }
    setPrev({ id: open, url: URL.createObjectURL(file) });
  };

  const handleCropped = (cropped: File, opened: string) => {
    switch (opened) {
      case "images-new":
        setCroppedImage((state) => ({
          images: {
            file: cropped,
            id: "new",
            url: URL.createObjectURL(cropped),
          },
          deals: state.deals,
        }));
        break;
      case "deals-new":
        setCroppedImage((state) => ({
          deals: {
            file: cropped,
            id: "new",
            url: URL.createObjectURL(cropped),
          },
          images: state.images,
        }));
        break;
      case "images":
        setCroppedImage((state) => ({
          images: {
            file: cropped,
            id: ids.images,
            url: URL.createObjectURL(cropped),
          },
          deals: state.deals,
        }));
        break;
      case "deals":
        setCroppedImage((state) => ({
          deals: {
            file: cropped,
            id: ids.deals,
            url: URL.createObjectURL(cropped),
          },
          images: state.images,
        }));
        break;
    }
    setOpen(null);
  };

  const { mutate } = api.asset.update.useMutation();

  const [uploading, setUploading] = useState(false);
  const saveImage = async ({
    imageId,
    file,
    tag,
  }: {
    imageId: string;
    file: File;
    tag: string;
  }) => {
    if (!data?.id) return;

    const form = new FormData();
    form.append("id", data.id);
    form.append("file", file);
    form.append("tag", tag);
    form.append("imageId", imageId);
    setUploading(true);
    try {
      await axios.put("/api/upload/asset", form, { params: { id: data?.id } });
      setUploading(false);
    } catch (err) {
      setUploading(false);
    }
  };

  return (
    <div className="overflow-y-auto h-full py-2">
      {(isFetching || uploading) && <LoadingBlur />}
      <SelectImage
        aspect={open === "images" || open === "images-new" ? 2 / 1 : 4 / 3}
        handleCropped={handleCropped}
        imageRef={imageRef}
        open={open}
        setOpen={setOpen}
        previewUrl={prev?.url}
      />
      <input
        hidden
        ref={imageRef}
        type="file"
        accept="image/jpeg, image/png, image/webp"
        onChange={handlePreview}
      />
      <MenuFlex>
        <Select<string>
          triggerStyles="w-fit bg-white"
          onValueChange={(page) => {
            router.replace(`/admin/assets/${page}`);
          }}
          defaultSelected=""
          selectList={assetsSelectList}
        />
      </MenuFlex>

      <div
        className="outer-box h-auto w-full grid grid-cols-1 md:grid-cols-3 
        md:grid-rows-3 gap-3 "
      >
        <SlideContainer
          onAddClick={() => {
            // dispatch({ type: "edit-texts" });
          }}
          onEditClick={() => dispatch({ type: "edit-texts" })}
          onLeftClick={() => dispatch({ type: "decrement-texts" })}
          onRightClick={() => dispatch({ type: "increment-texts" })}
          onSaveClick={() => {}}
          outerClassName="md:col-span-1 md:row-span-1"
          heading="Text Display"
          leftDisabled={Number(ids.texts) < 2}
          rightDisabled={
            data ? ids.texts === data.texts.length.toString() : true
          }
          edit={edits.texts}
          onCancelClick={() => {}}
        >
          {edits.texts ? (
            <input
              disabled={!edits.texts}
              placeholder="Enter slide text"
              className="resize-none border-200 p-2 w-full text-xl"
              defaultValue={activeText?.body}
            />
          ) : (
            <h3 className="border-200 p-2 w-full text-xl bg-neutral-100 text-neutral-600">
              {activeText?.body}
            </h3>
          )}
        </SlideContainer>

        <SlideContainer
          onAddClick={() => setOpen("images-new")}
          onEditClick={() => dispatch({ type: "edit-images" })}
          onLeftClick={() => dispatch({ type: "decrement-images" })}
          onRightClick={() => dispatch({ type: "increment-images" })}
          outerClassName="md:col-span-2 md:row-span-3"
          heading="Image Display"
          headerId={croppedImage.images?.id === "new" ? "New" : ids.images}
          onSaveClick={() => {
            const imageFile = croppedImage.images?.file;
            const imageId = croppedImage.images?.id;
            if (!imageFile || !imageId) return;
            saveImage({
              file: imageFile,
              imageId,
              tag: "slide",
            });
          }}
          saveDisabled={
            !!(open !== "images-new" && !croppedImage?.images?.file)
          }
          edit={!!croppedImage?.images?.file || edits.images}
          onCancelClick={() => {
            croppedImage?.images?.file &&
              setCroppedImage((state) => ({ deals: state.deals }));
            edits.images && dispatch({ type: "edit-images" });
          }}
          leftDisabled={Number(ids.images) < 2}
          rightDisabled={
            data ? ids.images === data.images.length.toString() : true
          }
        >
          {/* <a href={croppedImage.images?.url} download>
            download
          </a> */}
          <Image
            alt=""
            src={croppedImage.images?.url || img1}
            width={1200}
            height={700}
            className="w-full h-fit bg-black/30 rounded-lg overflow-hidden"
          />
        </SlideContainer>

        <SlideContainer
          onAddClick={() => setOpen("deals-new")}
          onEditClick={() => dispatch({ type: "edit-deals" })}
          onLeftClick={() => dispatch({ type: "decrement-deals" })}
          onRightClick={() => dispatch({ type: "increment-deals" })}
          outerClassName="md:col-span-1 md:row-span-2"
          heading="Deals Display"
          onSaveClick={() => {}}
          onCancelClick={() => {
            dispatch({ type: "edit-deals" });
          }}
        >
          <Image alt="" src={img2} className="w-full h-4/6 rounded-lg" />
        </SlideContainer>
      </div>
    </div>
  );
};

interface SlideProps {
  onAddClick: () => void;
  onEditClick: () => void;
  onLeftClick: () => void;
  onRightClick: () => void;
  children?: ReactNode;
  outerClassName?: string;
  heading: string;
  edit?: boolean;
  addDisabled?: boolean;
  leftDisabled?: boolean;
  rightDisabled?: boolean;
  onSaveClick: () => void;
  onCancelClick: () => void;
  saveDisabled?: boolean;
  headerId?: string;
}

const SlideContainer = ({
  onAddClick,
  onEditClick,
  onLeftClick,
  onRightClick,
  children,
  outerClassName,
  heading,
  addDisabled,
  edit,
  leftDisabled,
  rightDisabled,
  onSaveClick,
  onCancelClick,
  saveDisabled,
  headerId,
}: SlideProps) => {
  return (
    <div
      className={`inner-box ${outerClassName} flex flex-col gap-3 md:justify-between`}
    >
      <TFlex className="justify-between p-1 divider-200">
        <h3 className="text-xl">{heading}</h3>
        <h3 className="text-xl text-red-500">{headerId}</h3>
        <TFlex className="gap-4 justify-between h-8 items-center">
          {!edit && (
            <button onClick={onAddClick} disabled={addDisabled}>
              <PlusIcon width={30} />
            </button>
          )}
          {edit && (
            <button
              disabled={saveDisabled}
              className="bg-green-400 text-white px-4 rounded-md h-full 
              drop-shadow-sm hover:bg-green-500 disabled:opacity-60 disabled:hover:bg-green-400"
              onClick={onSaveClick}
            >
              save
            </button>
          )}
          {edit ? (
            <button
              className="bg-amber-400 text-white px-4 rounded-md h-full 
              drop-shadow-sm hover:bg-amber-500"
              onClick={onCancelClick}
            >
              Cancel
            </button>
          ) : (
            <button onClick={onEditClick}>
              <PencilSquareIcon width={30} />
            </button>
          )}
        </TFlex>
      </TFlex>

      {children}

      <TFlex className="justify-between">
        <button
          onClick={onLeftClick}
          className="hover:text-amber-300 disabled:opacity-40"
          disabled={leftDisabled || edit}
        >
          <ArrowLeftIcon width={30} />
        </button>

        <button
          onClick={onRightClick}
          className="hover:text-amber-300 disabled:opacity-40"
          disabled={rightDisabled || edit}
        >
          <ArrowRightIcon width={30} />
        </button>
      </TFlex>
    </div>
  );
};

AssetsPage.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};

export default AssetsPage;
