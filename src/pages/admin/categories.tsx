import InputTemp from "@components/InputTemp";
import LayoutA from "@components/Layout/Admin";
import { Loading, LoadingBlur } from "@components/Loading";
import AlertDialog from "@components/radix/Alert";
import { IconButton, MenuFlex } from "@components/TElements";
import {
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import type { Category } from "@prisma/client";
import { Content, Root, Trigger } from "@radix-ui/react-dialog";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { useStore } from "store";
import { api } from "utils/api";
import { csToStyle } from "utils/helpers";
import { categoryVS } from "utils/validation";
import { type NextPageWithLayout } from "../_app";

const Categories: NextPageWithLayout = () => {
  const { data: topLevel, isLoading } = api.categories.many.useQuery(1);
  const { data: subLevel, isLoading: loadingSub } =
    api.categories.many.useQuery(2);

  const [selected, setSelected] = useState<string | null>();
  const currentSub = subLevel?.filter((cat) => selected === cat.parent);

  const [add, setAdd] = useState(false);

  const bg = csToStyle(
    useStore((state) => state.colorScheme),
    true
  ).bg;

  const qc = api.useContext();

  const { mutate: create, isLoading: creating } =
    api.categories.create.useMutation({
      onSuccess: () => qc.categories.many.refetch(),
    });
  const { mutate: remove, isLoading: deleting } =
    api.categories.delete.useMutation({
      onSuccess: () => qc.categories.many.refetch(),
    });

  if (isLoading || loadingSub || creating || deleting) return <Loading />;

  return (
    <>
      <MenuFlex>
        <p></p>
        <Root>
          <Trigger className="flex items-center gap-2 bg-white rounded-lg py-1 px-2">
            <span>Add Top Category</span>
            <PlusIcon width={25} />
          </Trigger>
          <Content className="fixed center-x center-y bg-white rounded-lg p-3 drop-shadow-md border-200">
            <Formik
              initialValues={{ name: "", slug: "" }}
              onSubmit={(values) => {
                create({
                  data: {
                    name: values.name,
                    slug: values.slug,
                    parent: null,
                    tid: 1,
                  },
                });
              }}
              validationSchema={categoryVS}
            >
              {({ getFieldProps, dirty, errors, touched }) => (
                <Form className="w-96 space-y-3">
                  <InputTemp
                    fieldProps={getFieldProps("name")}
                    heading="Name"
                    touched={touched.name}
                    error={errors.name}
                  />
                  <InputTemp
                    fieldProps={getFieldProps("slug")}
                    heading="Id"
                    touched={touched.slug}
                    error={errors.slug}
                  />
                  <button disabled={!dirty} type="submit" className="btn-green">
                    Add
                  </button>
                </Form>
              )}
            </Formik>
          </Content>
        </Root>
      </MenuFlex>

      <div className="p-2 bg-white/40 rounded-lg h-[98%]">
        <div className="p-3 bg-white rounded-lg h-full overflow-y-auto flex gap-4">
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
            {selected && topLevel && topLevel?.length > 0 ? (
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
                        tid: 2,
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

  const { mutate, isLoading: mutating } = api.categories.update.useMutation({
    onSuccess: () => qc.categories.many.refetch(),
  });
  const { mutate: create, isLoading: creating } =
    api.categories.create.useMutation({
      onSuccess: () => {
        setAdd(false);
        qc.categories.many.refetch();
      },
    });
  const { mutate: remove, isLoading: deleting } =
    api.categories.delete.useMutation({
      onSuccess: () => qc.categories.many.refetch(),
    });

  return (
    <>
      {(mutating || creating || deleting) && <LoadingBlur />}

      <div
        className={`p-2 rounded-lg border border-neutral-300 space-y-3 drop-shadow-sm ${
          category.id === "new" ? "bg-amber-100" : ""
        }`}
      >
        <div className="relative w-full h-8 rounded-lg border-200 overflow-hidden">
          <input
            disabled={!edit}
            placeholder="Enter category name"
            className="w-full p-1 bg-white h-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
                  { id: category?.id, tid: 2 },
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
                  { data: { name, parent, slug, tid: 2 } },
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
  const [edit, setEdit] = useState(false);
  useEffect(() => {
    category?.name && setName(category?.name);
  }, [category]);

  const qc = api.useContext();

  const { mutate, isLoading: mutating } = api.categories.update.useMutation({
    onSuccess: () => qc.categories.many.refetch(),
  });

  return (
    <>
      {mutating && <LoadingBlur />}

      <div className="p-3 rounded-lg border border-neutral-300 space-y-3 drop-shadow-sm">
        <div className="relative w-full h-10 rounded-lg border-200 overflow-hidden">
          <input
            disabled={!edit}
            className="w-full p-1 bg-white h-full text-lg text-center"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
Categories.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};
export default Categories;
