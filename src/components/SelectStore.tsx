import { Loading } from "@components/Loading";
import { TDivider } from "@components/TElements";
import { setCookie } from "cookies-next";
import { api } from "utils/api";

interface Props {
  refetch: () => void;
}

const SelectStore = ({ refetch }: Props) => {
  const { data: accounts, isLoading } = api.vendor.accounts.useQuery({});

  if (isLoading) return <Loading />;
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-blue-300">
      <div
        className="h-fit max-h-96 p-3 rounded-lg border-t w-full mx-4
           border-gray-200 bg-white shadow-md shadow-gray-500 transition-all
           sm:max-w-sm outline-none"
      >
        <h3 className="text-2xl text-blue-500 font-medium mb-2">
          select store
        </h3>
        <TDivider />
        <div className="w-full rounded-lg my-2 gap-2">
          {accounts?.map((account) => (
            <button
              className="w-full text-black/90 p-3 drop-shadow-sm ring-1 ring-black/10 bg-white rounded-lg
                     hover:bg-neutral-100 hover:text-blue-500 text-lg"
              key={account.id}
              onClick={() => {
                setCookie("sid", account.id, {
                  sameSite: true,
                  secure: true,
                });
                refetch();
              }}
            >
              {account.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectStore;
