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
  trigger?: ReactNode;
  triggerStyles?: string;
  children?: ReactNode;
  actionStyles?: string;
  disabled?: boolean;
}

const AlertDialog = ({
  title,
  action = "okay",
  actionStyles = "bg-red-600 hover:bg-red-700",
  description,
  triggerStyles,
  trigger,
  children,
  onClickCancel,
  onClickConfirm,
  disabled,
}: Props) => {
  return (
    <Root>
      <Trigger disabled={disabled} type="button" className={triggerStyles}>
        {trigger}
      </Trigger>
      <Portal>
        <Overlay className="fixed inset-0 z-20 bg-black/50" />
        <Content
          className={`fixed z-50 w-[95vw] max-w-md rounded-lg p-4 md:w-full top-[50%] left-[50%]
           -translate-x-[50%] -translate-y-[50%] bg-white focus:outline-none focus-visible:ring
           focus-visible:ring-red-500 focus-visible:ring-opacity-75`}
        >
          {children}
          <Title className="text-sm font-medium text-gray-900 mb-5 p-2">
            {title}
          </Title>

          <Description className="mt-2 text-sm font-normal text-gray-700">
            {description}
          </Description>
          <div className="flex items-center justify-end gap-2">
            <Cancel
              className="inline-flex select-none justify-center rounded-md px-4 py-2 text-sm font-medium
            bg-white text-gray-900 hover:bg-gray-50  border border-gray-300 focus:outline-none
              focus-visible:ring focus-visible:ring-red-500 focus-visible:ring-opacity-75"
              onClick={onClickCancel}
            >
              Cancel
            </Cancel>
            <Action
              className={`inline-flex select-none justify-center 
              rounded-md px-4 py-2 text-sm font-medium text-white  
               border border-transparent ${actionStyles}`}
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
