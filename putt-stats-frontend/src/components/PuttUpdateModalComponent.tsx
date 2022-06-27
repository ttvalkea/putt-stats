import { apiPuttResult, puttUpdate } from "../types";
import { Dialog } from "@mui/material";
import DropdownComponent from "./DropdownComponent";
import { useState } from "react";
import { PuttType } from "../constants";

type PuttUpdateModalComponentProps = {
  putt: apiPuttResult;
  open: boolean;
  onClose: (value: puttUpdate | undefined) => void;
};

function PuttUpdateModalComponent(props: PuttUpdateModalComponentProps) {
  const { onClose, open, putt } = props;

  const [distance, setDistance] = useState(props.putt.distance);
  const [type, setType] = useState(props.putt.type);
  const [isMade, setIsMade] = useState(props.putt.isMade);
  const [isUndone, setIsUndone] = useState(props.putt.isUndone);

  const handleClose = (puttUpdate: puttUpdate | undefined) => {
    onClose(puttUpdate);
  };

  const handleDistanceChange = (event: any) => {
    const valueAsANumber: number = parseInt(event.target.value);
    setDistance(valueAsANumber);
  };
  const handleTypeChange = (event: any) => {
    const valueAsANumber: number = parseInt(event.target.value);
    setType(valueAsANumber);
  };
  const handleIsMadeChange = () => {
    setIsMade(!isMade);
  };
  const handleIsUndoneChange = () => {
    setIsUndone(!isUndone);
  };

  const distanceDropdownOptions: { value: number; label: string }[] = [];
  for (let index = 1; index <= 20; index++) {
    distanceDropdownOptions.push({ value: index, label: `${index} m` });
  }
  distanceDropdownOptions.push({ value: 21, label: "21+ m" });
  const typeDropdownOptions: { value: number; label: string }[] = [
    { value: PuttType.Competition, label: "Competition" },
    { value: PuttType.Practice, label: "Practice" },
    { value: PuttType.Test, label: "Test" },
  ];

  const updateButtonClicked = () => {
    const puttUpdate: puttUpdate = {
      distance: distance,
      isMade: isMade,
      isUndone: isUndone,
      puttResultId: putt.puttResultId,
      type: type,
    };
    // When giving a defined puttUpdate object to handleClose, the update operation will trigger
    handleClose(puttUpdate);
  };

  return (
    <div>
      <Dialog onClose={() => handleClose(undefined)} open={open}>
        <div style={{ padding: 20 }}>
          <div style={{ paddingBottom: 20, fontSize: 20 }}>
            Update putt result
          </div>
          <DropdownComponent
            label={"Distance "}
            onChangeFunction={handleDistanceChange}
            options={distanceDropdownOptions}
            value={distance}
          ></DropdownComponent>
          <br />
          <DropdownComponent
            label={"Type "}
            onChangeFunction={handleTypeChange}
            options={typeDropdownOptions}
            value={type}
          ></DropdownComponent>
          <br />
          <label>
            <input
              style={{ marginTop: 10 }}
              type="checkbox"
              checked={isMade}
              onChange={handleIsMadeChange}
            />
            Putt is a make
          </label>
          <br />
          <label>
            <input
              style={{ marginTop: 10 }}
              type="checkbox"
              checked={isUndone}
              onChange={handleIsUndoneChange}
            />
            Putt is cancelled
          </label>
          <br />
          <button
            style={{ marginTop: 30, fontSize: 20 }}
            onClick={updateButtonClicked}
          >
            Update
          </button>
        </div>
      </Dialog>
    </div>
  );
}

export default PuttUpdateModalComponent;
