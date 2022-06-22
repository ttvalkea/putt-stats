import { toast } from "react-toastify";
import "../App.css";
import { defaultPuttType, defaultUserId, PuttResult } from "../constants";
import { markNewPuttResult } from "../database";
import { newPuttInsert } from "../types";
import {
  getPuttTypeFromLocalStorage,
  getUserIdFromLocalStorage,
} from "../utilities";

type ButtonComponentProps = {
  puttResult: PuttResult;
  distance: number;
};

const markPuttResult = async (distance: number, puttResult: PuttResult) => {
  const markingResult = await markNewPuttResult({
    distance,
    isMade: puttResult === PuttResult.Make,
    userId: getUserIdFromLocalStorage() ?? defaultUserId,
    type: getPuttTypeFromLocalStorage() ?? defaultPuttType,
  } as newPuttInsert);
  if (!markingResult) {
    toast.error(
      `An error occured trying to mark a putt from ${
        distance === 21 ? "> 20" : distance
      } m`
    );
  } else {
    const toastText = `Putt ${
      puttResult === PuttResult.Make ? "made" : "missed"
    } from ${distance === 21 ? "> 20" : distance} m`;
    if (puttResult === PuttResult.Make) {
      toast.success(toastText);
    } else {
      toast.warn(toastText);
    }
  }
};

function ButtonComponent(props: ButtonComponentProps) {
  const makeStyle = {
    backgroundColor: "#2d3",
    width: 90,
    marginRight: 40,
    marginBottom: 5,
  };
  const missStyle = { backgroundColor: "red", width: 90, marginBottom: 5 };
  return (
    <button
      style={props.puttResult === PuttResult.Make ? makeStyle : missStyle}
      id={`button-${props.puttResult}-${props.distance}`}
      onClick={() => markPuttResult(props.distance, props.puttResult)}
    >
      {props.distance === 21 ? "> 20" : props.distance} m
    </button>
  );
}

export default ButtonComponent;
