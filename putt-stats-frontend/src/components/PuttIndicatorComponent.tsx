import { PuttType } from "../constants";
import { apiPuttResult } from "../types";

type PuttIndicatorComponentProps = {
  putt: apiPuttResult;
};

function PuttIndicatorComponent(props: PuttIndicatorComponentProps) {
  const { putt } = props;
  const style = {
    backgroundColor: putt.isMade ? "#1e3" : "#a00",
    color: putt.isMade ? "#111" : "#fff",
    padding: "6px",
    margin: "4px",
    fontWeight: "bold",
    borderRadius: "25px",
    opacity: putt.isUndone ? "20%" : "100%",
    width: "25px",
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
