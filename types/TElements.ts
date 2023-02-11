import { MouseEventHandler } from "react";
import { ReactNode } from "react";
import { HTMLAttributes } from "react";

export interface ElementProps {
  children?: ReactNode;
  className?: string;
}

export interface AvatarProps extends ElementProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  src?: string;
}

export interface ButtonProps extends ElementProps {
  type?: "button" | "submit";
  variant?: "solid" | "ghost" | "unstyled";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export interface IconButtonProps extends ElementProps {
  variant?: "solid" | "ghost" | "unstyled";
  onClick?: MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
}

export interface StackProps extends ElementProps {
  space?: string | number;
}
