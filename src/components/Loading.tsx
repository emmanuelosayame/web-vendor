import { FadeLoader } from "react-spinners";

export const Loading = ({
  position = "fixed",
}: {
  position?: "fixed" | "absolute";
}) => {
  return (
    <div
      className={`flex justify-center items-center ${
        position === "fixed" ? "fixed" : "absolute"
      } inset-0 bg-white w-screen h-screen`}
    >
      <FadeLoader color="gray" />
    </div>
  );
};

export const LoadingBlur = () => {
  return (
    <div className="flex justify-center items-center fixed inset-0 bg-white bg-opacity-25">
      <FadeLoader />
    </div>
  );
};
