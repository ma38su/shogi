type Props = {
  isOpen: boolean,
  handleClose: () => void,
};

function CheckAlertDialog(props: Props) {
  const { isOpen, handleClose } = props;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
        <h2 className="text-lg font-bold">王手</h2>
      </div>
    </div>
  );
}

export { CheckAlertDialog }
