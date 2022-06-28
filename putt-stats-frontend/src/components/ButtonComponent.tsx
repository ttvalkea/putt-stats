import { useState } from "react";
import { toast, ToastOptions } from "react-toastify";
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

function ButtonComponent(props: ButtonComponentProps) {
  const [isLoadingMarkResult, setIsLoadingMarkResult] = useState(false);

  const markPuttResult = async (distance: number, puttResult: PuttResult) => {
    setIsLoadingMarkResult(true);
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
      const toastOptions: ToastOptions = {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "putt-result-marking-success-toast",
      };
      if (puttResult === PuttResult.Make) {
        toast.success(toastText, toastOptions);
      } else {
        toast.warn(toastText, toastOptions);
      }
    }
    setIsLoadingMarkResult(false);
  };

  const makeStyle = {
    backgroundColor: "#2d3",
    width: 90,
    marginRight: 40,
    marginBottom: 5,
    borderRadius: 10,
  };
  const missStyle = {
    backgroundColor: "red",
    width: 90,
    marginBottom: 5,
    borderRadius: 10,
  };
  return (
    <button
      style={props.puttResult === PuttResult.Make ? makeStyle : missStyle}
      id={`button-${props.puttResult}-${props.distance}`}
      onClick={() => markPuttResult(props.distance, props.puttResult)}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        {props.distance === 21 ? "> 20" : props.distance} m
        {isLoadingMarkResult ? (
          <div className="loader tiny" style={{ marginLeft: 3 }}></div>
        ) : (
          <></>
        )}
      </div>
    </button>
  );
}

export default ButtonComponent;
