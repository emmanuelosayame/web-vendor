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
import img1 from "public/loginbg1.jpg";
import img2 from "public/flashsale.png";
import { type Reducer, useReducer, type ReactNode } from "react";
import { api } from "utils/api";

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
    texts: 1,
    images: 1,
    deals: 1,
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
          ? state.ids[action.id] + 1
          : state.ids[action.id] - 1;
      return {
        ...state,
        ids: {
          ...state.ids,
          [action.id]: newIndex,
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

  const { data } = api.asset.one.useQuery({ basepath: "", path: "/" });

  const [{ edits, ids }, dispatch] = useReducer(reducer, initialState);

  const activeText = data?.texts?.find((text) => ids.texts === Number(text.id));
  const activeImage = data?.images?.find(
    (image) => ids.images === Number(image.id)
  );
  // console.log(data);

  return (
    <div className="overflow-y-auto h-full py-2">
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
        className="outer-box h-auto md:h-[97%] w-full grid grid-cols-1 md:grid-cols-3 
        md:grid-rows-3 gap-3 "
      >
        <SlideContainer
          onAddClick={() => {}}
          onEditClick={() => dispatch({ type: "edit-texts" })}
          onLeftClick={() => dispatch({ type: "decrement-texts" })}
          onRightClick={() => dispatch({ type: "increment-texts" })}
          onSaveClick={() => {}}
          outerClassName="md:col-span-1 md:row-span-1"
          heading="Text Display"
          leftDisabled={ids.texts < 2}
          rightDisabled={data ? ids.texts === data.texts.length : true}
          edit={edits.texts}
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
          onAddClick={() => {}}
          onEditClick={() => dispatch({ type: "edit-images" })}
          onLeftClick={() => dispatch({ type: "decrement-images" })}
          onRightClick={() => dispatch({ type: "increment-images" })}
          outerClassName="md:col-span-2 md:row-span-3"
          heading="Image Display"
          onSaveClick={() => {}}
        >
          <Image alt="" src={img1} className="w-full h-4/5 rounded-lg" />
        </SlideContainer>

        <SlideContainer
          onAddClick={() => {}}
          onEditClick={() => dispatch({ type: "edit-deals" })}
          onLeftClick={() => dispatch({ type: "decrement-deals" })}
          onRightClick={() => dispatch({ type: "increment-deals" })}
          outerClassName="md:col-span-1 md:row-span-2"
          heading="Deals Display"
          onSaveClick={() => {}}
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
}: SlideProps) => {
  return (
    <div
      className={`inner-box ${outerClassName} flex flex-col gap-3 md:justify-between`}
    >
      <TFlex className="justify-between p-1 divider-200">
        <h3 className="text-xl">{heading}</h3>
        <TFlex className="gap-4 justify-between">
          <button onClick={onAddClick} disabled={addDisabled}>
            <PlusIcon width={30} />
          </button>
          {edit && (
            <button
              className="bg-green-400 text-white px-4 rounded-md 
              drop-shadow-sm hover:bg-green-500"
              onClick={onSaveClick}
            >
              save
            </button>
          )}
          <button onClick={onEditClick}>
            <PencilSquareIcon width={30} />
          </button>
        </TFlex>
      </TFlex>

      {children}

      <TFlex className="justify-between">
        <button
          onClick={onLeftClick}
          className="hover:text-amber-300 disabled:opacity-40"
          disabled={leftDisabled}
        >
          <ArrowLeftIcon width={30} />
        </button>

        <button
          onClick={onRightClick}
          className="hover:text-amber-300 disabled:opacity-40"
          disabled={rightDisabled}
        >
          <ArrowRightIcon width={30} />
        </button>
      </TFlex>
    </div>
  );
};

// const EditAddBtns = ({
//   onAddClick,
//   onEditClick,
// }: {
//   onAddClick: () => void;
//   onEditClick: () => void;
// }) => {
//   return (
//     <TFlex className="gap-4 justify-between">
//       <button onClick={onEditClick}>
//         <PencilSquareIcon width={30} />
//       </button>
//       <button onClick={onAddClick}>
//         <PlusIcon width={30} />
//       </button>
//     </TFlex>
//   );
// };

// const ArrowBtns = ({
//   onLeftClick,
//   onRightClick,
// }: {
//   onLeftClick: () => void;
//   onRightClick: () => void;
// }) => {
//   return (
//     <TFlex className="justify-between">
//       <button onClick={onLeftClick} className="hover:text-amber-300">
//         <ArrowLeftIcon width={30} />
//       </button>

//       <button onClick={onRightClick} className="hover:text-amber-300">
//         <ArrowRightIcon width={30} />
//       </button>
//     </TFlex>
//   );
// };

AssetsPage.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};

export default AssetsPage;
