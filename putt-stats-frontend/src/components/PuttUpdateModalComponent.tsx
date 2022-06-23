import { apiPuttResult, puttUpdate } from "../types";
import { Dialog } from "@mui/material";

type PuttUpdateModalComponentProps = {
  putt: apiPuttResult;
  open: boolean;
  onClose: (value: puttUpdate) => void;
};

function PuttUpdateModalComponent(props: PuttUpdateModalComponentProps) {
  const { onClose, open, putt } = props;

  const handleClose = () => {
    onClose({
      distance: putt.distance,
      isMade: putt.isMade,
      isUndone: putt.isUndone,
      puttResultId: putt.puttResultId,
      type: putt.type,
    });
  };

  return (
    <div>
      <Dialog onClose={handleClose} open={open}>
        <div style={{ padding: 10 }}>
          <h3>Update putt result</h3>
          {/* TODO: Distance, isMade, isUndone, type. Each on their own row as an editable value. */}
        </div>
      </Dialog>
    </div>
  );
}

export default PuttUpdateModalComponent;
