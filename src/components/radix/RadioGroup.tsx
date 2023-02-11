import * as RadixRadioGroup from "@radix-ui/react-radio-group/dist";

interface RadioGroupProps<Type> {
  value?: string;
  items?: { value: string; display: string }[];
  onValueChange?: (selected: Type) => void;
  defaultValue?: string;
}

const RadioGroup = <Type,>({
  defaultValue,
  value,
  onValueChange,
  items,
}: RadioGroupProps<Type>) => {
  return (
    <RadixRadioGroup.Root
      value={value}
      onValueChange={onValueChange as (value: string) => void}
      className='flex flex-col gap-2'
      defaultValue={defaultValue}
      aria-label='View density'>
      {items?.map((item) => (
        <div key={item.value} className='flex items-center'>
          <RadixRadioGroup.Item
            className='w-9 h-9 rounded-2xl shadow-md border border-bordergray shadow-neutral-200 bg-white'
            value={item.value}
            id='r1'>
            <RadixRadioGroup.Indicator
              className='flex relative w-full h-full p-1 items-center justify-center
             after:bg-black after:w-full after:h-full after:rounded-xl after:block'
            />
          </RadixRadioGroup.Item>
          <label className='mx-2 text-lg' htmlFor='r1'>
            {item.display}
          </label>
        </div>
      ))}
    </RadixRadioGroup.Root>
  );
};

export default RadioGroup;
