import { Loading, LoadingBlur } from "@components/Loading";
import { TDivider } from "@components/TElements";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "utils/api";

interface Props {
  refetch: () => void;
  onSwitchedFn?: () => void;
}

const SelectStore = ({ onSwitchedFn = () => {} }: Props) => {
  const router = useRouter();
  const qc = api.useContext();

  const { data: accounts, isLoading } = api.vendor.accounts.useQuery({});

  if (isLoading) return <LoadingBlur />;

  return (
    <div
      className=" p-3 rounded-lg border flex flex-col w-full h-full
           border-neutral-200 bg-white shadow-md shadow-gray-500 transition-all outline-none"
    >
      <h3 className="text-2xl text-blue-500 font-medium mb-2">select store</h3>
      <TDivider />
      <div className="w-full rounded-lg my-2 space-y-2 flex-1">
        {accounts?.map((account) => (
          <button
            className="w-full text-black/90 p-3 drop-shadow-sm ring-1 ring-black/10 bg-white rounded-lg
                     hover:bg-neutral-100 hover:text-blue-500 text-lg"
            key={account.id}
            onClick={async () => {
              setCookie("sid", account.id, {
                sameSite: true,
                secure: true,
              });
              await router.replace("/");
              await qc.invalidate();
              await qc.product.one.reset();
              onSwitchedFn();
            }}
          >
            {account.name}
          </button>
        ))}
      </div>

      {
        !(
          router.pathname === "/create-store" ||
          (accounts && accounts?.length > 1 && (
            <>
              <TDivider className="my-3" />
              <button
                onClick={() => router.push("/create-store")}
                className="w-full text-center p-2 bg-blue-600 disabled:opacity-50
         hover:bg-blue-700 drop-shadow-md text-white rounded-lg"
              >
                Create
              </button>
            </>
          ))
        )
      }
    </div>
  );
};

export default SelectStore;
