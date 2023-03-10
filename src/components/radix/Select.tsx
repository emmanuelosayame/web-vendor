import { ChevronDownIcon } from "@heroicons/react/24/solid";
import * as RadixSelect from "@radix-ui/react-select";
import { type CSSProperties } from "react";

interface SelectProps<T> {
  triggerStyles?: string;
  contentStyles?: string;
  defaultSelected?: string;
  onValueChange: (value: T) => void;
  selectList: { value: string; item: string }[];
  value?: T;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  style?: CSSProperties;
}

const Select = <T,>({
  defaultSelected,
  onValueChange,
  selectList,
  contentStyles = "bg-white",
  triggerStyles = "bg-white w-24",
  value,
  disabled,
  required,
  placeholder,
  style,
}: SelectProps<T>) => {
  return (
    <RadixSelect.Root
      value={value as string}
      defaultValue={defaultSelected}
      onValueChange={(e) => onValueChange(e as T)}
      disabled={disabled}
      required={required}
    >
      <RadixSelect.Trigger
        type="button"
        className={`${triggerStyles} rounded-md outline-none py-1 px-3 flex  justify-between`}
        aria-label="Sort"
        style={style}
      >
        <div className="">
          <RadixSelect.Value
            placeholder={placeholder}
            className="text-white  text-center"
          />
        </div>
        <RadixSelect.Icon className=" ml-1 ">
          <ChevronDownIcon width={25} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          className={` ${contentStyles} border border-neutral-100 shadow-lg z-50 overflow-hidden rounded-2xl`}
        >
          <RadixSelect.Viewport className="z-50">
            {selectList.map((selectItem) => (
              <RadixSelect.Item
                key={selectItem.value}
                value={selectItem.value}
                className="py-1.5 px-5 hover:text-blue-500 cursor-pointer text-base outline-none"
              >
                <RadixSelect.ItemText>{selectItem.item}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator />
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
};

export default Select;
