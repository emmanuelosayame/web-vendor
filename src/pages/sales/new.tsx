import { IconBack, IconButton, MenuFlex } from "@components/TElements";
import { CheckIcon } from "@heroicons/react/24/outline";

const New = () => {
  return (
    <>
      <MenuFlex>
        <IconBack>Back</IconBack>
        <IconButton>
          <p>Edit</p>
          <CheckIcon width={20} />
        </IconButton>
      </MenuFlex>
    </>
  );
};

export default New;
