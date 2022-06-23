import { PuttType } from "../constants";
import { apiPuttResult } from "../types";

type PuttIndicatorComponentProps = {
  putt: apiPuttResult;
};

function PuttIndicatorComponent(props: PuttIndicatorComponentProps) {
  const { putt } = props;
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

  return (
    <div style={{ backgroundColor: typeColor }}>
      <div style={style}>{putt.distance === 21 ? "20+" : putt.distance}</div>
    </div>
  );
}

export default PuttIndicatorComponent;
