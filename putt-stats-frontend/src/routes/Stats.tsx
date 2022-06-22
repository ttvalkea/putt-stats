import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPuttResults } from "../database";
import { apiPuttResult } from "../types";
import { groupBy, orderBy } from "lodash";
import { parseISO } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import PuttPercentageComponent from "../components/PuttPercentageComponent";
import { PuttType } from "../constants";
import PuttIndicatorComponent from "../components/PuttIndicatorComponent";

export default function Stats() {
  const [stats, setStats] = useState([] as apiPuttResult[]);
  const [showUndonePutts, setShowUndonePutts] = useState(false);
  const handleShowUndonePuttsChange = () => {
    setShowUndonePutts(!showUndonePutts);
  };

  useEffect(() => {
    const fetchData = async () => {
      const puttResults = await getPuttResults();
      if (!puttResults) {
        toast.error("An error occured trying to get putt results.");
      } else {
        setStats(puttResults);
      }
    };

    fetchData();
  }, []);
  const zerofilled = (num: number) => ("00" + num).slice(-2);
  const getStatsGroupedByDay = (
    stats: apiPuttResult[]
  ): { day: string; putts: apiPuttResult[] }[] => {
    const groupedStats = groupBy(
      stats.filter((p) => !p.isUndone || showUndonePutts),
      (result: apiPuttResult) => {
        const parsedDate = parseISO(result.puttTimestamp);
        return `${parsedDate.getFullYear()}-${zerofilled(
          parsedDate.getMonth() + 1
        )}-${zerofilled(parsedDate.getDate())}`;
      }
    );

    // Modify the dictionary into an array
    const objectArrayForStats: { day: string; putts: apiPuttResult[] }[] = [];
    Object.entries(groupedStats).forEach(([key, value]) => {
      objectArrayForStats.push({ day: key.toString(), putts: value });
    });

    return objectArrayForStats;
  };

  const statsForADayTables: any[] = [];
  const statsGroupedByDayAndSortedByDay = orderBy(
    getStatsGroupedByDay(stats),
    ["day"],
    ["desc"]
  );
  for (let index = 0; index < statsGroupedByDayAndSortedByDay.length; index++) {
    const statsForADay = statsGroupedByDayAndSortedByDay[index];
    const puttsForADayOrdered = orderBy(
      statsForADay.putts,
      ["puttResultId"],
      ["desc"]
    );

    const typesInArray = puttsForADayOrdered.map((p) => PuttType[p.type]);
    const daysPuttTypes = typesInArray.filter((x, i, a) => a.indexOf(x) === i);

    statsForADayTables.push(
      <h3 key={`day-title-${statsForADay.day}`}>
        {statsForADay.day}
        <span style={{ fontSize: 14, fontWeight: 300, paddingLeft: "10px" }}>
          {daysPuttTypes.toString()} (
          {puttsForADayOrdered.filter((x) => x.isMade && !x.isUndone).length})
        </span>
      </h3>
    );

    const styleForPercentageElement = { padding: "5px" };
    statsForADayTables.push(
      <div
        key={`percentage-element-${statsForADay.day}`}
        style={{ marginBottom: "10px" }}
      >
        <span style={styleForPercentageElement}>
          <PuttPercentageComponent
            putts={puttsForADayOrdered.filter(
              (p) => p.distance >= 4 && p.distance < 10
            )}
            header="C1"
          />
        </span>
        <span style={styleForPercentageElement}>
          <PuttPercentageComponent
            putts={puttsForADayOrdered.filter(
              (p) => p.distance >= 10 && p.distance < 21
            )}
            header="C2"
          />
        </span>
        <span style={styleForPercentageElement}>
          <PuttPercentageComponent
            putts={puttsForADayOrdered.filter((p) => p.distance < 4)}
            header="BE"
          />
        </span>
      </div>
    );

    const puttElementsForADay: any[] = [];
    for (let i = 0; i < puttsForADayOrdered.length; i++) {
      const putt = puttsForADayOrdered[i];
      puttElementsForADay.push(
        <PuttIndicatorComponent key={putt.puttResultId} putt={putt} />
      );
    }

    statsForADayTables.push(
      <div
        key={`day-stat-container-${statsForADay.day}`}
        style={{
          display: "flex",
          maxWidth: "100vw",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          paddingBottom: "50px",
        }}
      >
        {puttElementsForADay}
      </div>
    );
  }

  return (
    <main className="App">
      <ToastContainer />
      <h2>Putting stats</h2>
      <Link to="/" style={{ fontSize: "20px" }}>
        Back to marking
      </Link>
      <br />
      <input
        type="checkbox"
        id="show-undone-putts-checkbox"
        checked={showUndonePutts}
        onChange={handleShowUndonePuttsChange}
        style={{ marginTop: "20px" }}
      />
      <label htmlFor="show-undone-putts-checkbox">Show undone putts</label>
      <hr
        style={{
          borderTop: "3px dashed #bbb",
        }}
      />
      {statsForADayTables}
    </main>
  );
}
