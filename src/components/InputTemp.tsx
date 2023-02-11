import type { FieldInputProps } from "formik";
import type { HTMLInputTypeAttribute } from "react";

interface Props {
  heading: string;
  type?: HTMLInputTypeAttribute;
  fieldProps: FieldInputProps<string | number | readonly string[] | undefined>;
  touched?: boolean;
  error?: string;
  placeholder?: string;
  Ibg?: string;
  style?: { heading?: any; input?: any };
  className?: string;
}

interface TextareaProps extends Omit<Props, "type"> {
  rows?: number;
}

const InputTemp = ({
  heading,
  type,
  fieldProps,
  touched,
  error,
  placeholder,
  Ibg = "",
  style = { heading: { fontWeight: 600 } },
  className,
}: Props) => {
  //TODO switch ibg to inputprops
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <p {...style.heading}>{heading}</p>
        {touched && error && (
          <p className="text-neutral-500 text-center italic text-sm">{error}</p>
        )}
      </div>
      <input
        className={`rounded-md w-full py-1 px-2 ring-1 ring-neutral-300 outline-none ${className}`}
        type={type}
        {...fieldProps}
        placeholder={placeholder}
        {...style.input}
      />
    </div>
  );
};

export const TextareaTemp = ({
  heading,
  fieldProps,
  touched,
  error,
  placeholder,
  Ibg = "",
  style = { heading: { fontWeight: 600 } },
  rows,
  className,
}: TextareaProps) => {
  //TODO switch ibg to inputprops
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <p {...style.heading}>{heading}</p>
        {touched && error && (
          <p className="text-neutral-500 text-center italic text-sm">{error}</p>
        )}
      </div>
      <textarea
        className={`rounded-md w-full py-1 px-2 ring-1 ring-neutral-300 outline-none resize-none ${className}`}
        rows={rows}
        {...fieldProps}
        placeholder={placeholder}
        {...style.input}
      />
    </div>
  );
};

export default InputTemp;
