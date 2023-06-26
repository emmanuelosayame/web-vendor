import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface Props {
  dataLength?: number;
  total?: number;
  limit: number;
}

const TableFooter = ({ dataLength, limit, total }: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const pagn = Number(searchParams.get("pg") || "1");

  return (
    <div className="">
      <div className="bottom-b" />
      <div className="flex justify-between p-2">
        <h3 className="px-2 text-neutral-700 text-lg">
          <span>{(pagn - 1) * 10}</span> to{" "}
          <span>{(pagn - 1) * 10 + (dataLength || 0)}</span> of{" "}
          <span>{total}</span>
        </h3>

        <div className="flex gap-4 items-center">
          <button
            className="text-black hover:opacity-60 transition-all disabled:opacity-50"
            aria-label="prev"
            disabled={pagn < 2}
            onClick={() => {
              router.replace(pathname + "?pg=" + (pagn - 1));
            }}
          >
            Prev
          </button>
          <p className="text-neutral-800">{pagn}</p>
          <button
            className="text-black hover:opacity-60 transition-all disabled:opacity-50"
            aria-label="next"
            disabled={!dataLength || dataLength < limit}
            onClick={() => {
              router.replace(pathname + "?pg=" + (pagn + 1));
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableFooter;
