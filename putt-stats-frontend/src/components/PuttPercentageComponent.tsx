import { apiPuttResult } from "../types";

type PuttPercentageComponentProps = {
  putts: apiPuttResult[];
  header: string;
};

function PuttPercentageComponent(props: PuttPercentageComponentProps) {
  const elementStyle = {
    marginLeft: "5px",
    backgroundColor: "#eee",
  };
  const madePutts = props.putts.filter((p) => p.isMade);

  const percentageString = props.putts.length
    ? ((madePutts.length / props.putts.length) * 100).toFixed(0) + "%"
    : "-";

  return (
    <span>
      {props.header}:
      <span style={elementStyle}>
        {madePutts.length}/{props.putts.length} = {percentageString}
      </span>
    </span>
  );
}

export default PuttPercentageComponent;
