"use client";

import { InputTemp } from "@components/InputTemp";
import { Loading, LoadingBlur } from "@components/Loading";
import AlertDialog from "@components/radix/Alert";
import { IconBack, MenuFlex } from "@components/TElements";
import {
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Category } from "@prisma/client";
import { Content, Root, Trigger } from "@radix-ui/react-dialog";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "store";
import { api } from "src/server/api";
import { csToStyle } from "@lib/helpers";
import useMediaQuery from "@lib/useMediaQuery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type CategoryS, categoryS } from "src/server/zod";

const CategoriesPage = () => {
  const router = useRouter();
  const id = useParams()?.id?.toString();

  const mq = useMediaQuery("(min-width: 800px)");

  const { data: parent, isFetching: fetchingParent } =
    api.category.one.useQuery({ id }, { enabled: !!id });
  const { data: topLevel, isFetching } = api.category.many.useQuery(
    { parent: id },
    {
      enabled: !!parent,
    }
  );

  const [selected, setSelected] = useState<string | null>();
  const { data: subLevel, isFetching: loadingSub } = api.category.many.useQuery(
    { tid: 3 },
    { enabled: !!selected }
  );
  const currentSub = subLevel?.filter((cat) => selected === cat.parent);

  const [add, setAdd] = useState(false);

  const bg = csToStyle(
    useStore((state) => state.colorScheme),
    true
  ).bg;

  const qc = api.useContext();

  const { mutate: create, isLoading: creating } =
    api.category.create.useMutation({
      onSuccess: () => qc.category.many.refetch(),
    });
  const { mutate: remove, isLoading: deleting } =
    api.category.delete.useMutation({
      onSuccess: () => qc.category.many.refetch(),
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, touchedFields },
  } = useForm<CategoryS>({ resolver: zodResolver(categoryS.partial()) });

  if (isFetching || loadingSub || creating || deleting || fetchingParent)
    return <Loading />;

  if (!parent)
    return (
      <div className="bg-white rounded-lg mx-auto w-fit p-3 gap-3 flex flex-col justify-center items-center">
        <p>Something went wrong</p>
        <Link href={"/"} className="border-200 p-1 rounded-lg">
          Go back
        </Link>
      </div>
    );

  return (
    <>
      <MenuFlex>
        <IconBack>Back</IconBack>
        <h3 className="py-1 px-4 bg-white rounded-lg">{parent.name}</h3>
        <Root>
          <Trigger className="flex items-center gap-2 bg-white rounded-lg py-1 px-2">
            <span>{mq ? "Add Top Category" : "Add"}</span>
            <PlusIcon width={25} />
          </Trigger>
          <Content
            className="fixed inset-x-3 md:center-x center-y 
          bg-white rounded-lg p-3 drop-shadow-md border-200 md:w-fit"
          >
            <form
              onSubmit={handleSubmit((values) => {
                if (!parent.id) return;
                create({
                  data: {
                    name: values.name,
                    slug: values.slug,
                    parent: parent.id,
                    tid: 2,
                  },
                });
              })}
              className="space-y-3 w-full md:w-96"
            >
              <InputTemp
                {...register("name")}
                label="Name"
                touched={touchedFields.name}
                error={errors.name?.message}
                placeholder="Enter category name"
              />
              <InputTemp
                {...register("slug")}
                label="Id"
                touched={touchedFields.slug}
                error={errors.slug?.message}
                placeholder="Category unique name e.g name lowercase..."
              />
              <button disabled={!isDirty} type="submit" className="btn-green">
                Add
              </button>
            </form>
          </Content>
        </Root>
      </MenuFlex>

      <div className="outer-box h-[98%]">
        <div className="inner-box overflow-y-auto flex gap-4">
          <div
            className={`md:grid md:grid-cols-2 gap-2 h-fit w-full md:w-1/2 ${
              selected ? "hidden " : "flex flex-col "
            }`}
          >
            {topLevel?.map((cat) => (
              <div
                key={cat.id}
                className={`px-3 py-5 rounded-lg border border-neutral-200
                 drop-shadow-sm ${bg} cursor-pointer`}
                onClick={() => setSelected(cat.id)}
              >
                <h3 className="text-xl text-center text-white font-semibold">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="border-l border-l-neutral-200 hidden md:block" />

          <div
            className={`${!selected ? "hidden md:block" : ""} w-full md:w-1/2`}
          >
            {!!selected && !!currentSub && topLevel && topLevel?.length > 0 ? (
              <>
                <div className="flex w-full justify-between relative mb-2">
                  <button
                    className="md:hidden"
                    onClick={() => setSelected(undefined)}
                  >
                    <ChevronLeftIcon width={30} />
                  </button>

                  <button
                    disabled={add}
                    className="flex gap-2 items-center bg-amber-300 rounded-lg drop-shadow-md
               py-1 px-2 text-white disabled:opacity-60"
                    onClick={() => setAdd(true)}
                  >
                    <span>Add</span>
                    <PlusIcon width={25} />
                  </button>

                  <AlertDialog
                    trigger={
                      <>
                        <span>Delete</span>
                        <TrashIcon width={25} />
                      </>
                    }
                    action="Delete"
                    actionStyles="bg-red-400 hover:bg-red-500"
                    title="Are you sure you want to delete this category?"
                    triggerStyles="bg-red-500 flex px-3 py-1 rounded-lg text-white text-sm disabled:opacity-50"
                    onClickConfirm={() => remove({ id: selected, tid: 1 })}
                  />
                </div>
                <TCat category={topLevel?.find((cat) => cat.id === selected)} />
                <div className="border-b border-b-neutral-300 my-4" />

                <div className="grid grid-cols-2 gap-2">
                  {add ? (
                    <SCat
                      category={{
                        id: "new",
                        name: "",
                        parent: "",
                        tid: 3,
                        slug: "",
                      }}
                      setAdd={setAdd}
                      parent={selected}
                    />
                  ) : null}
                  {currentSub?.map((cat) => (
                    <SCat
                      key={cat.id}
                      category={cat}
                      setAdd={setAdd}
                      parent={selected}
                    />
                  ))}
                </div>
              </>
            ) : (
              <h3 className="text-center">Click on the category to select</h3>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const SCat = ({
  category,
  setAdd,
  parent,
}: {
  category: Category;
  setAdd: (state: boolean) => void;
  parent: string | undefined;
}) => {
  const [name, setName] = useState<string>(category?.name || "");
  const [slug, setSlug] = useState<string>(category?.slug || "");
  const [edt, setEdit] = useState(false);
  const edit = category.id === "new" || edt;

  const qc = api.useContext();

  const { mutate, isLoading: mutating } = api.category.update.useMutation({
    onSuccess: () => qc.category.many.refetch(),
  });
  const { mutate: create, isLoading: creating } =
    api.category.create.useMutation({
      onSuccess: () => {
        setAdd(false);
        qc.category.many.refetch();
      },
    });
  const { mutate: remove, isLoading: deleting } =
    api.category.delete.useMutation({
      onSuccess: () => qc.category.many.refetch(),
    });

  return (
    <>
      {(mutating || creating || deleting) && <LoadingBlur />}

      <div
        className={`p-2 rounded-lg border border-neutral-300 space-y-3 drop-shadow-sm ${
          category.id === "new" ? "bg-amber-100" : ""
        }`}
      >
        <div className="relative w-full space-y-2 overflow-hidden">
          <input
            disabled={!edit}
            placeholder="Enter category name"
            className="w-full bg-white h-8 rounded-lg border-200 px-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            disabled={!edit}
            placeholder="Enter unique name (Lowercase)"
            className="w-full bg-white h-8 rounded-lg border-200 px-2"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="flex gap-2 h-8">
          {!edit ? (
            <AlertDialog
              trigger="Delete"
              action="Confirm"
              actionStyles="bg-red-400 hover:bg-red-500"
              title="Are you sure you want to rename this category?"
              triggerStyles="bg-red-500 p-2 rounded-lg text-white text-sm w-full disabled:opacity-50"
              onClickConfirm={() =>
                category &&
                remove(
                  { id: category?.id, tid: 3 },
                  { onSuccess: () => setEdit(false) }
                )
              }
            />
          ) : null}
          {edit ? (
            <button
              onClick={() =>
                category?.id === "new" ? setAdd(false) : setEdit(false)
              }
              className="bg-amber-400 px-2 py-1 rounded-lg text-white text-sm w-full"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="bg-green-500 px-2 py-1 rounded-lg text-white text-sm w-full"
            >
              Rename
            </button>
          )}

          {edit && category.id === "new" ? (
            <button
              onClick={() =>
                parent &&
                create(
                  { data: { name, parent, slug, tid: 3 } },
                  { onSuccess: () => setEdit(false) }
                )
              }
              className="bg-blue-500 px-2 py-1 rounded-lg text-white text-sm w-full"
            >
              Add
            </button>
          ) : edit ? (
            <AlertDialog
              disabled={category?.name === name}
              trigger="Save"
              action="Rename"
              actionStyles="bg-amber-400 hover:bg-amber-500"
              title="Are you sure you want to rename this category?"
              triggerStyles="bg-blue-500 p-2 rounded-lg text-white text-sm w-full disabled:opacity-50"
              onClickConfirm={() =>
                category &&
                mutate(
                  { id: category?.id, data: { name } },
                  { onSuccess: () => setEdit(false) }
                )
              }
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

const TCat = ({ category }: { category?: Category }) => {
  const [name, setName] = useState<string>(category?.name || "");
  const [slug, setSlug] = useState<string>(category?.slug || "");

  const [edit, setEdit] = useState(false);
  useEffect(() => {
    category?.name && setName(category?.name);
    category?.slug && setSlug(category?.slug);
  }, [category]);

  const qc = api.useContext();

  const { mutate, isLoading: mutating } = api.category.update.useMutation({
    onSuccess: () => qc.category.many.refetch(),
  });

  return (
    <>
      {mutating && <LoadingBlur />}

      <div className="p-3 rounded-lg border border-neutral-300 space-y-3 drop-shadow-sm">
        <div className="relative w-full overflow-hidden flex gap-2">
          <input
            disabled={!edit}
            className="w-full px-2 bg-white text-lg text-center h-10 rounded-lg border-200"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            disabled={!edit}
            className="w-full px-2 bg-white text-lg text-center h-10 rounded-lg border-200"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
        <div className="flex gap-2 h-fit">
          {edit ? (
            <button
              onClick={() => setEdit(false)}
              className="bg-amber-400 p-2 rounded-lg text-white text-sm w-full"
            >
              Cancel
            </button>
          ) : (
            <button
              onClick={() => setEdit(true)}
              className="bg-green-500 p-2 rounded-lg text-white w-full"
            >
              Rename
            </button>
          )}

          {edit ? (
            <AlertDialog
              disabled={
                category?.name === name ||
                (category && category?.slug.length < 2)
              }
              trigger="Save"
              action="Rename"
              actionStyles="bg-amber-400 hover:bg-amber-500"
              title="Are you sure you want to rename this category?"
              triggerStyles="bg-blue-500 p-2 rounded-lg text-white text-sm w-full disabled:opacity-50"
              onClickConfirm={() =>
                category &&
                mutate(
                  { id: category?.id, data: { name } },
                  { onSuccess: () => setEdit(false) }
                )
              }
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
