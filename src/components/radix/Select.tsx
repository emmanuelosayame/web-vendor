import { ChevronDownIcon } from "@heroicons/react/24/solid";
import * as RadixSelect from "@radix-ui/react-select";

interface SelectProps {
  triggerStyles?: string;
  contentStyles?: string;
  defaultSelected?: string;
  onValueChange: (value: string) => void;
  selectList: { value: string; item: string }[];
  value?: string;
}

const Select = ({
  defaultSelected,
  onValueChange,
  selectList,
  contentStyles,
  triggerStyles,
  value,
}: SelectProps) => {
  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultSelected}
      onValueChange={onValueChange}
    >
      <RadixSelect.Trigger
        className={`${triggerStyles} outline-none py-1 px-3 flex`}
        aria-label="Sort"
      >
        <div className="">
          <RadixSelect.Value className="text-white  text-center" />
        </div>
        <RadixSelect.Icon className=" ml-1 ">
          <ChevronDownIcon width={25} />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      {/* <RadixSelect.Portal> */}
      <RadixSelect.Content
        className={` ${contentStyles} shadow-lg z-50 overflow-hidden rounded-2xl`}
      >
        <RadixSelect.Viewport className="">
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
      {/* </RadixSelect.Portal> */}
    </RadixSelect.Root>
  );
};

export default Select;
