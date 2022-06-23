import { useState } from "react";
import { PuttType } from "../constants";
import { apiPuttResult, puttUpdate } from "../types";
import PuttUpdateModalComponent from "./PuttUpdateModalComponent";

type PuttIndicatorComponentProps = {
  putt: apiPuttResult;
};

function PuttIndicatorComponent(props: PuttIndicatorComponentProps) {
  // This updatedPutt is shown if its defined. It becomes defined after a successful putt update.
  const [updatedPutt, setUpdatedPutt] = useState(
    undefined as apiPuttResult | undefined
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const putt = updatedPutt ?? props.putt;

  const isBullseyeDistance = putt.distance < 4;
  const isC2Distance = putt.distance >= 10;
  let backgroundColor = "#1e3";
  if (!putt.isMade) {
    backgroundColor = "#a00";
  } else if (isBullseyeDistance) {
    backgroundColor = "#0a0";
  } else if (isC2Distance) {
    backgroundColor = "#6f4";
  }

  const style = {
    backgroundColor,
    color: putt.isMade ? "#111" : "#fff",
    padding: "6px",
    margin: "4px",
    fontWeight: isC2Distance ? "700" : isBullseyeDistance ? "400" : "500",
    borderRadius: "25px",
    opacity: putt.isUndone ? "20%" : "100%",
    width: "25px",
    fontSize: "18px",
  };

  let typeColor = "#dde"; // PuttType.Test or PuttType.Unknown
  if (putt.type === PuttType.Competition) {
    typeColor = "#46f";
  } else if (putt.type === PuttType.Practice) {
    typeColor = "#ee4";
  }

  // TODO: Remove outcommented if not needed
  // const updatePutt = async (puttUpdate: puttUpdate) => {
  //   const updateResult: boolean = await updatePuttResult(puttUpdate);
  //   if (!updateResult) {
  //     toast.error("An error occured trying to update a putt.");
  //   } else if (updateResult === true) {
  //     toast.success("Putt succesfully updated.");
  //   }
  // };

  const openEditModal = async (putt: apiPuttResult) => {
    setIsUpdateModalOpen(true);
    console.log(putt);

    // // TODO: These values need to come from the modal
    const puttUpdate: puttUpdate = {
      distance: putt.distance,
      isMade: putt.isMade,
      isUndone: putt.isUndone,
      puttResultId: putt.puttResultId,
      type: putt.type,
    };

    // await updatePutt(puttUpdate);
    const updatedPuttForState: apiPuttResult = {
      ...puttUpdate,
      name: putt.name,
      puttTimestamp: putt.puttTimestamp,
      userId: putt.userId,
    };
    setUpdatedPutt(updatedPuttForState);
  };

  const handleUpdateModalClose = (puttUpdate: puttUpdate) => {
    setIsUpdateModalOpen(false);
    console.log(puttUpdate);
  };

  return (
    <div style={{ backgroundColor: typeColor }}>
      <div style={style} onClick={() => openEditModal(putt)}>
        {putt.distance === 21 ? "20+" : putt.distance}
      </div>
      <PuttUpdateModalComponent
        open={isUpdateModalOpen}
        putt={putt}
        onClose={handleUpdateModalClose}
      />
    </div>
  );
}

export default PuttIndicatorComponent;
