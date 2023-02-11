import { HTMLAttributes, ReactNode } from "react";
import type {
  // AvatarProps,
  ButtonProps,
  ElementProps,
  IconButtonProps,
  StackProps,
} from "types/TElements";

export const TButton = ({
  type = "button",
  children,
  className,
  variant = "solid",
  onClick,
  disabled,
}: ButtonProps) => {
  const defaultProps =
    variant === "solid"
      ? " py-1 px-3 rounded-lg text-white bg-black text-[14px] font-medium hover:opacity-75"
      : variant === "ghost" && "";
  return (
    <button
      type={type}
      className={`${defaultProps} inline-flex items-center justify-center text-center shadow-md ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export const TIconButton = ({
  children,
  className,
  variant = "solid",
  onClick,
  isDisabled = false,
}: IconButtonProps) => {
  const defaultProps =
    variant === "solid"
      ? " p-2 h-fit  rounded-xl text-white text-[14px] font-medium hover:opacity-80"
      : variant === "ghost" && "";
  return (
    <button
      className={`${defaultProps} ${className} disabled:opacity-60`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  );
};

export const TStack = ({
  children,
  className,
  space = "space-y-2",
}: StackProps) => {
  return (
    <div className={`flex flex-col ${space} ${className}`}>{children}</div>
  );
};

export const THStack = ({
  children,
  className,
  space = "space-x-2",
}: StackProps) => {
  return <div className={`flex ${space} ${className}`}>{children}</div>;
};

export const TFlex = ({ children, className }: ElementProps) => {
  return <div className={`flex ${className}`}>{children}</div>;
};

export const TDivider = ({ className }: ElementProps) => {
  return <div className={`border-b ${className}`} />;
};

export const TGrid = ({ className, children }: ElementProps) => {
  return <div className={`grid ${className}`}>{children}</div>;
};

export const IconButton = ({
  children,
  onClick,
  className,
  disabled,
}: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex gap-1 items-center rounded-md py-1 px-3 hover:opacity-75 disabled:opacity-75 bg-white ${className}`}
  >
    {children}
  </button>
);
