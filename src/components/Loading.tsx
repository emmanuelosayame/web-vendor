import { csToStyle } from "@lib/helpers";
import { CirclesWithBar } from "react-loader-spinner";
import { useStore } from "store";

export const Loading = ({
  position = "fixed",
}: {
  position?: "fixed" | "absolute";
}) => {
  return (
    <div
      className={`flex justify-center items-center ${
        position === "fixed" ? "fixed" : "absolute"
      } inset-0 bg-white z-50 w-screen h-screen`}
    >
      <CirclesWithBar width={70} color="gray" />
    </div>
  );
};

export const LoadingBlur = ({
  position = "fixed",
}: {
  position?: "fixed" | "absolute";
}) => {
  const style = csToStyle(useStore((state) => state.colorScheme)).style;

  console.log(style);

  return (
    <div
      className={`flex justify-center items-center fixed inset-0 bg-white/30
     backdrop-blur-[2px] z-50 ${position} ${
        position === "absolute" ? "inset-[2px]" : ""
      }`}
    >
      <CirclesWithBar width={70} color={"gray"} />
    </div>
  );
};
