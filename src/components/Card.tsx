import type { ReactNode } from "react";
import { THStack } from "./TElements";

export const Card1 = ({
  children,
  text,
  value,
}: //   color,
{
  children: ReactNode;
  text: string;
  value: string;
  //   color: string;
}) => {
  return (
    <>
      <THStack className="w-44 items-center rounded-xl bg-white bg-opacity-60 py-3 px-4 backdrop:blur-md">
        {children}
        <div className="flex-1">
          <p className="text-center font-semibold">{value}</p>
          <p className="text-center text-sm">{text}</p>
        </div>
      </THStack>
    </>
  );
};
