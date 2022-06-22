import "./App.css";
import ButtonComponent from "./components//ButtonComponent";
import { PuttResult } from "./constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { undoLastPuttResult } from "./database";
import { apiPuttResult } from "./types";
import { Link } from "react-router-dom";
import PuttTypeSelectionComponent from "./components/PuttTypeSelectionComponent";
import UserSelectionComponent from "./components/UserSelectionComponent";

function App() {
  const buttonComponents: any[] = [];

  for (let index = 1; index <= 20; index++) {
    buttonComponents.push(
      <ButtonComponent
        distance={index}
        puttResult={PuttResult.Make}
        key={`button-make-${index}`}
      />
    );
    buttonComponents.push(
      <ButtonComponent
        distance={index}
        puttResult={PuttResult.Miss}
        key={`button-miss-${index}`}
      />
    );
    buttonComponents.push(<br key={`br-${index}`} />);
  }

  const actionButtonStyle = {
    width: 100,
    height: 40,
    margin: 30,
  };

  const undoPreviousPutt = async () => {
    const undoResult: apiPuttResult | boolean = await undoLastPuttResult();
    if (!undoResult) {
      toast.error("An error occured trying to undo a putt.");
    } else if (undoResult === true) {
      toast.warn("No putt results to undo!");
    } else {
      const lastPuttDistance = (undoResult as apiPuttResult).distance;
      const lastPuttResult = (undoResult as apiPuttResult).isMade;
      toast(
        `↩️ Undid previous putt (${
          lastPuttDistance === 21 ? "> 20" : lastPuttDistance
        } m ${lastPuttResult ? "make" : "miss"})`
      );
    }
  };

  const environmentTextStyle = {
    fontSize: "10px",
    fontWeight: 200,
    marginLeft: "10px",
  };
  const environment = process.env.NODE_ENV;

  return (
    <div className="App">
      <ToastContainer />
      <h1>
        Putt results
        <span style={environmentTextStyle}>{environment}</span>{" "}
      </h1>
      {buttonComponents}
      {/* Distance over 20 meters is marked as 21 meters */}
      <ButtonComponent distance={21} puttResult={PuttResult.Make} />
      <ButtonComponent distance={21} puttResult={PuttResult.Miss} />
      <br />
      <br />
      <Link
        to="/stats"
        style={{ paddingBottom: 50, paddingRight: 30, fontSize: 20 }}
      >
        Putting stats
      </Link>
      <button style={actionButtonStyle} key="undo" onClick={undoPreviousPutt}>
        ↩️ Undo previous putt
      </button>
      <br />
      <PuttTypeSelectionComponent />
      <br />
      <UserSelectionComponent />
      <br /> <br />
    </div>
  );
}

export default App;
