import mysql, { Connection } from "promise-mysql";
import dotenv from "dotenv";
import {
  apiPuttResult,
  dbPuttResult,
  newPuttInsert,
  puttUpdate,
  user,
} from "./types";
dotenv.config();
import http from "http";
import { mapDbPuttResultToApiPuttResult } from "./utilities";

let retriedToConnectAmount = 0;

export const createConnection = async (
  doRetryAttempt: boolean = true
): Promise<Connection> => {
  const maximumRetryConnectionCreationAttempts = 3;

  console.log("Creating database connection.");
  try {
    const connectionParameters = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    };

    http.get({ host: "api.ipify.org", port: 80, path: "/" }, function (resp) {
      resp.on("data", function (ip) {
        // This is here because the network where the API is running needs to be authorized from Cloud SQL
        console.log("My public IP address is: " + ip);
      });
    });
    const connection = await mysql.createConnection(connectionParameters);

    console.log("Database connection created successfully.");
    retriedToConnectAmount = 0; // This is useless/doesn't do anything?
    return connection;
  } catch (exception) {
    retriedToConnectAmount++;
    if (
      retriedToConnectAmount <= maximumRetryConnectionCreationAttempts &&
      doRetryAttempt
    ) {
      console.log(
        `Trying again to form a database connection. Attempt number ${
          retriedToConnectAmount + 1
        }.`
      );
      return await createConnection();
    } else {
      console.log(
        `Couldn't connect to database after ${retriedToConnectAmount} retries.`
      );
      console.log(exception);

      return null;
    }
  }
};

export const queryAllPuttResults = async (
  connection: Connection,
  userId: number | undefined
): Promise<{
  result: apiPuttResult[];
  shouldRecreateDatabaseConnection: boolean;
}> => {
  console.log(`Querying for all putt results for userId ${userId}.`);

  if (connection) {
    try {
      let query =
        "select p.*, u.name from puttResult p left join user u on p.userId = u.userId";
      if (userId) {
        query += ` where p.userId=${userId}`;
      }
      query += ";";
      const puttResults: dbPuttResult[] = await connection.query(query);
      console.log(
        "All putt results queried successfully. Rows returned: " +
          puttResults.length
      );

      return {
        result: puttResults.map((dbPuttResult: dbPuttResult) =>
          mapDbPuttResultToApiPuttResult(dbPuttResult)
        ),
        shouldRecreateDatabaseConnection: false,
      };
    } catch (error) {
      console.log("Error querying the database for all putt results:");
      console.log(error);

      return { result: [], shouldRecreateDatabaseConnection: true };
    }
  } else {
    console.log(
      "Cannot query database for putt results. No database connection."
    );
    return { result: [], shouldRecreateDatabaseConnection: true };
  }
};

export const insertNewPuttResult = async (
  connection: Connection,
  puttData: newPuttInsert
): Promise<{ result: boolean; shouldRecreateDatabaseConnection: boolean }> => {
  console.log("Inserting a new putt result");

  if (connection) {
    try {
      // Using parseInt for all values to protect against malicious input data in the form of SQL injection
      const query = `INSERT INTO puttResult (userId, distance, isMade, isUndone, type, puttTimestamp) values (${parseInt(
        puttData.userId as any
      )}, ${parseInt(puttData.distance as any)}, ${
        puttData.isMade ? 1 : 0
      }, 0, ${parseInt(puttData.type as any)}, CURRENT_TIMESTAMP());`;
      await connection.query(query);
      console.log("Putt result inserted: " + JSON.stringify(puttData));
      return { result: true, shouldRecreateDatabaseConnection: false };
    } catch (error) {
      console.log("Error inserting a putt result:");
      console.log(error);
      return { result: false, shouldRecreateDatabaseConnection: true };
    }
  } else {
    console.log(
      "Cannot insert putt result to database. No database connection."
    );
    return { result: false, shouldRecreateDatabaseConnection: true };
  }
};

// Marks the last putt with isUndone = 0 to have isUndone = 1
export const undoLastPutt = async (
  connection: Connection,
  userId: number
): Promise<{
  result: apiPuttResult | boolean;
  shouldRecreateDatabaseConnection: boolean;
}> => {
  console.log(`Undoing last putt for userId ${userId}.`);

  if (connection) {
    try {
      // Select the row first for returning
      const selectQuery = `select p.*, u.name from puttResult p left join user u on p.userId = u.userId WHERE p.isUndone=0 AND p.userId=${userId} ORDER BY puttResultId DESC LIMIT 1;`;
      const rowToUndo: dbPuttResult[] = await connection.query(selectQuery);

      // Undoing operation
      const undoQuery = `UPDATE puttResult SET isUndone=1 WHERE isUndone=0 AND userId=${userId} ORDER BY puttResultId DESC LIMIT 1;`;
      const undoResult: any = await connection.query(undoQuery);
      if (undoResult?.changedRows === 1) {
        // Return the undone row's data if undo is successful
        return {
          result: rowToUndo.map((dbPuttResult: dbPuttResult) =>
            mapDbPuttResultToApiPuttResult(dbPuttResult)
          )[0],
          shouldRecreateDatabaseConnection: false,
        };
      } else if (undoResult?.changedRows === 0) {
        return { result: true, shouldRecreateDatabaseConnection: false }; // No errors, but also no rows to undo.
      }
    } catch (error) {
      console.log("Error undoing the last putt result:");
      console.log(error);
      return { result: false, shouldRecreateDatabaseConnection: true };
    }
  } else {
    console.log("Cannot undo last putt result. No database connection.");
    return { result: false, shouldRecreateDatabaseConnection: true };
  }
};

export const updatePuttResult = async (
  connection: Connection,
  updateData: puttUpdate
): Promise<{ result: boolean; shouldRecreateDatabaseConnection: boolean }> => {
  console.log("Updating a putt result.");

  if (connection) {
    try {
      // Using parseInt for all values to protect against malicious input data in the form of SQL injection
      const query = `UPDATE puttResult SET distance=${parseInt(
        updateData.distance as any
      )}, isMade=${updateData.isMade ? 1 : 0}, type=${parseInt(
        updateData.type as any
      )}, isUndone=${updateData.isUndone ? 1 : 0} WHERE puttResultId=${parseInt(
        updateData.puttResultId as any
      )};`;
      await connection.query(query);
      console.log("Putt result updated: " + JSON.stringify(updateData));
      return { result: true, shouldRecreateDatabaseConnection: false };
    } catch (error) {
      console.log("Error updating a putt result:");
      console.log(error);
      return { result: false, shouldRecreateDatabaseConnection: true };
    }
  } else {
    console.log(
      "Cannot insert putt result to database. No database connection."
    );
    return { result: false, shouldRecreateDatabaseConnection: true };
  }
};

export const queryAllUsers = async (
  connection: Connection
): Promise<{ result: user[]; shouldRecreateDatabaseConnection: boolean }> => {
  console.log("Querying for all users.");

  if (connection) {
    try {
      const query = "select userId, name from user;";
      const userQueryResults: user[] = await connection.query(query);
      console.log(
        "All users queried successfully. Rows returned: " +
          userQueryResults.length
      );
      return {
        result: userQueryResults,
        shouldRecreateDatabaseConnection: false,
      };
    } catch (error) {
      console.log("Error querying the database for all users:");
      console.log(error);
      return { result: [], shouldRecreateDatabaseConnection: true };
    }
  } else {
    console.log("Cannot query database for users. No database connection.");
    return { result: [], shouldRecreateDatabaseConnection: true };
  }
};
