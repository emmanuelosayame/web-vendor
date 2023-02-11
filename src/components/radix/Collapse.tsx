import type { ReactNode } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

export interface CollapseProps {
  open: boolean;
  children: ReactNode;
}
const Collapse = ({ open, children }: CollapseProps) => {
  return (
    <Collapsible.Root open={open} className="w-full">
      <Collapsible.Content className="CollapsibleContent overflow-hidden w-full">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default Collapse;
