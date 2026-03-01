import { Dialog } from "@chakra-ui/react";

type Props = {
  isOpen: boolean,
  handleClose: () => void,
};

function CheckAlertDialog(props: Props) {
  const {
    isOpen,
    handleClose,
  } = props;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => { if (!e.open) handleClose(); }} placement="center">
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Header>王手</Dialog.Header>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}

export { CheckAlertDialog }
