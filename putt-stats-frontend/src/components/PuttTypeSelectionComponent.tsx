import { useState } from "react";
import { PuttType } from "../constants";
import { getPuttTypeFromLocalStorage } from "../utilities";

function PuttTypeSelectionComponent() {
  const [puttType, setPuttType] = useState(
    getPuttTypeFromLocalStorage() ?? PuttType.Practice
  );

  const handlePuttTypeChange = (event: any) => {
    const valueAsEnum: PuttType = parseInt(event.target.value);
    // Put the selected value into localstorage for a better (persistent) user experience
    localStorage.setItem("puttType", valueAsEnum.toString());
    setPuttType(valueAsEnum);
  };

  const radioButtonContainerStyle = { paddingLeft: 10 };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      Putt type:
      <div style={radioButtonContainerStyle}>
        <input
          type="radio"
          id="puttTypeRadioButtonPractice"
          value={PuttType.Practice}
          checked={puttType === PuttType.Practice}
          onChange={handlePuttTypeChange}
        />{" "}
        <label htmlFor="puttTypeRadioButtonPractice">Practice</label>
      </div>
      <div style={radioButtonContainerStyle}>
        <input
          type="radio"
          id="puttTypeRadioButtonCompetition"
          value={PuttType.Competition}
          checked={puttType === PuttType.Competition}
          onChange={handlePuttTypeChange}
        />{" "}
        <label htmlFor="puttTypeRadioButtonCompetition">Competition</label>
      </div>
      <div style={radioButtonContainerStyle}>
        <input
          type="radio"
          id="puttTypeRadioButtonTest"
          value={PuttType.Test}
          checked={puttType === PuttType.Test}
          onChange={handlePuttTypeChange}
        />{" "}
        <label htmlFor="puttTypeRadioButtonTest">Test</label>
      </div>
    </div>
  );
}

export default PuttTypeSelectionComponent;
