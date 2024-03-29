import { XMarkIcon } from "@heroicons/react/24/solid";
import * as ToastPrimitive from "@radix-ui/react-toast/dist";
import { useState } from "react";

interface ToastProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  description?: string;
  duration?: number;
  styles?: string;
}

export const useToastTrigger = (duration: number = 400) => {
  const [open, setOpen] = useState(false);

  const trigger = () => {
    if (open) {
      setOpen(false);
      setTimeout(() => {
        setOpen(true);
      }, duration);
    } else {
      setOpen(true);
    }
  };
  return { trigger, open, setOpen };
};

export const Toast = ({
  open,
  setOpen,
  title,
  description,
  duration = 5000,
  styles,
}: ToastProps) => {
  return (
    <ToastPrimitive.Provider duration={duration}>
      <ToastPrimitive.Root
        open={open}
        onOpenChange={setOpen}
        className={` fixed inset-x-4 bottom-4 z-50 mx-auto w-5/6 rounded-2xl bg-white
         ring-1 ring-neutral-400 shadow-lg
          focus-visible:ring-opacity-75 md:bottom-4
           md:right-4 md:left-auto md:top-auto md:w-full md:max-w-xs ${styles}`}
      >
        <div className="flex">
          <div className="flex w-0 flex-1 items-center py-2 pl-5">
            <div className="radix w-full">
              <ToastPrimitive.Title className="text-xl text-neutral-700 font-medium">
                {title}
              </ToastPrimitive.Title>
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-700 dark:text-gray-400">
                {description}
              </ToastPrimitive.Description>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col space-y-1 px-3 py-2">
              {/* <div className='h-0 flex-1 flex'>
                <ToastPrimitive.Action
                  altText='view now'
                  className='w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-purple-600 dark:text-purple-500 hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
                  onClick={(e) => {
                    e.preventDefault();
                  }}>
                  Review
                </ToastPrimitive.Action>
              </div> */}
              <div className="flex items-center flex-1">
                <ToastPrimitive.Close
                  className="flex w-full h-fit rounded-lg 
                bg-white ring-1 ring-neutral-200 px-3 py-2 text-sm text-gray-700
                 hover:bg-neutral-100 focus:z-10 dark:text-gray-100 dark:hover:bg-gray-900"
                >
                  Dismiss
                </ToastPrimitive.Close>
              </div>
            </div>
          </div>
        </div>
      </ToastPrimitive.Root>

      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  );
};

export default Toast;
