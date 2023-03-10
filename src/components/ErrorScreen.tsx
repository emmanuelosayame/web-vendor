import { type CSSProperties } from "react";

interface Props {
  style?: CSSProperties;
  title?: string;
  description: string;
}

const ErrorScreen = ({
  style,
  title = "Access Denied !",
  description,
}: Props) => {
  return (
    <div
      className={` h-screen w-screen flex justify-center items-center`}
      style={style}
    >
      <div className="px-3 py-5 rounded-lg bg-neutral-200 text-neutral-600 text-center">
        <h3>{title}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default ErrorScreen;
