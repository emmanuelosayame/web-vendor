import { Root, Thumb } from "@radix-ui/react-switch";

interface Props {
  label?: string;
  checked?: boolean;
  onCChange: (checked: boolean) => void;
}

const Switch = ({ label, checked, onCChange }: Props) => {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <label className="cursor-pointer" htmlFor={label}>
          {label}
        </label>
      )}
      <Root
        checked={checked}
        onCheckedChange={onCChange}
        id={label}
        className="w-11 h-6 rounded-full drop-shadow-md border-200 bg-neutral-100
       data-checked:bg-blue-400"
      >
        <Thumb
          className="w-5 h-5 rounded-full translate-x-[2px] block
        transition-transform will-change-transform drop-shadow-sm bg-blue-400
         data-checked:bg-white data-checked:translate-x-5"
        />
      </Root>
    </div>
  );
};

export default Switch;
