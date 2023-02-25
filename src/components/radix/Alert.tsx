import {
  Root,
  Trigger,
  Overlay,
  Portal,
  Content,
  Title,
  Description,
  Cancel,
  Action,
} from "@radix-ui/react-alert-dialog/dist";
import { type ReactNode } from "react";

interface Props {
  onClickCancel?: () => void;
  onClickConfirm?: () => void;
  title?: string;
  action?: string;
  description?: string;
  trigger?: string;
  triggerStyles?: string;
  children?: ReactNode;
}

const AlertDialog = ({
  title,
  action = "okay",
  description,
  triggerStyles,
  trigger,
  children,
  onClickCancel,
  onClickConfirm,
}: Props) => {
  return (
    <Root>
      <Trigger type="button" className={triggerStyles}>
        {trigger}
      </Trigger>
      <Portal>
        <Overlay className="fixed inset-0 z-20 bg-black/50" />
        <Content
          className={`fixed z-50 w-[95vw] max-w-md rounded-lg p-4 md:w-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-white dark:bg-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75`}
        >
          {children}
          <Title className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-5 p-2">
            {title}
          </Title>

          <Description className="mt-2 text-sm font-normal text-gray-700 dark:text-gray-400">
            {description}
          </Description>
          <div className="flex items-center justify-end gap-2">
            <Cancel
              className="inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium
            bg-white text-gray-900 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-100
             hover:dark:bg-gray-600 border border-gray-300 dark:border-transparent focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
              onClick={onClickCancel}
            >
              Cancel
            </Cancel>
            <Action
              className="inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 focus:outline-none focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75
             dark:text-gray-100 dark:hover:bg-red-600 border border-transparent"
              onClick={onClickConfirm}
            >
              {action}
            </Action>
          </div>
        </Content>
      </Portal>
    </Root>
  );
};

export default AlertDialog;
