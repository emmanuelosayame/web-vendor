import InputTemp from "@components/InputTemp";
import LayoutA from "@components/layout/Admin";
import AlertDialog from "@components/radix/Alert";
import { MenuFlex } from "@components/TElements";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Content, Root } from "@radix-ui/react-dialog";
import { Form, Formik } from "formik";
import Link from "next/link";
import { Fragment, useState } from "react";
import { useStore } from "store";
import type { NextPageWithLayout } from "t/shared";
import { api } from "@lib/api";
import { csToStyle } from "@lib/helpers";
import { categoryVS } from "@lib/validation";

const Categories: NextPageWithLayout = () => {
  const [edit, setEdit] = useState(false);

  const qc = api.useContext();
  const { data: topLevel } = api.category.many.useQuery({ tid: 1 });
  const { mutate: remove } = api.category.delete.useMutation({
    onSuccess: async () => {
      await qc.category.many.refetch();
    },
  });

  const bg = csToStyle(
    useStore((state) => state.colorScheme),
    true
  ).bg;

  return (
    <>
      <MenuFlex>
        <AddCategory edit={edit} />
        <button
          onClick={() => setEdit((state) => !state)}
          className={`py-1 px-4 flex gap-3 rounded-lg ${
            edit ? "bg-amber-400 text-white" : "bg-white"
          }`}
        >
          <span>Edit</span>
          <PencilIcon width={20} />
        </button>
      </MenuFlex>

      <div className="p-2 bg-white/40 rounded-lg h-[98%]">
        <div className="p-3 bg-white rounded-lg h-full overflow-y-auto flex gap-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full h-fit">
            {topLevel?.map((cat) => (
              <Fragment key={cat.id}>
                {edit ? (
                  <div
                    className={`border-200 rounded-xl  p-5 md:p-10 h-40 flex flex-col items-center
                 justify-center bg-white text-red-500`}
                  >
                    <p className="text-3xl">{cat.name}</p>
                    <AlertDialog
                      trigger={<TrashIcon width={30} />}
                      action="Delete"
                      actionStyles="bg-red-400 hover:bg-red-500"
                      title="Are you sure you want to delete this category?"
                      triggerStyles="text-red-500 text-white disabled:opacity-50"
                      onClickConfirm={() => remove({ id: cat.id, tid: 1 })}
                    />
                  </div>
                ) : (
                  <Link
                    href={`/admin/categories/${cat.id}`}
                    key={cat.id}
                    className={`border-200 rounded-xl p-5 md:p-16 flex flex-col items-center
                 justify-center hover:opacity-70 ${bg} text-white w-full`}
                  >
                    <p className="text-3xl">{cat.name}</p>
                  </Link>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

interface ACProps {
  edit: boolean;
}

const AddCategory = ({ edit }: ACProps) => {
  const [open, setOpen] = useState(false);

  const qc = api.useContext();
  const { mutate: create } = api.category.create.useMutation({
    onSuccess: async () => {
      await qc.category.many.refetch();
      setOpen(false);
    },
  });

  return (
    <Root open={open} onOpenChange={setOpen}>
      <button
        className="flex items-center gap-2 bg-white rounded-lg py-1 px-2"
        onClick={() => !edit && setOpen((state) => !state)}
      >
        <span>Add Category</span>
        <PlusIcon width={25} />
      </button>
      <Content
        className="fixed inset-x-3 md:center-x center-y 
          bg-white rounded-lg p-3 drop-shadow-md border-200 md:w-fit"
      >
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
            <Form className="space-y-3 w-full md:w-96">
              <InputTemp
                fieldProps={getFieldProps("name")}
                heading="Name"
                touched={touched.name}
                error={errors.name}
                placeholder="Enter category name"
              />
              <InputTemp
                fieldProps={getFieldProps("slug")}
                heading="Id"
                touched={touched.slug}
                error={errors.slug}
                placeholder="Category unique name e.g name lowercase..."
              />
              <button disabled={!dirty} type="submit" className="btn-green">
                Add
              </button>
            </Form>
          )}
        </Formik>
      </Content>
    </Root>
  );
};

Categories.getLayout = function getLayout(page) {
  return <LayoutA>{page}</LayoutA>;
};
export default Categories;
