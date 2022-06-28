import {
  createConnection,
  insertNewPuttResult,
  queryAllPuttResults,
  queryAllUsers,
  undoLastPutt,
  updatePuttResult,
} from "./database";
import express, { NextFunction, Request, Response } from "express";
import { Connection } from "promise-mysql";
import { newPuttInsert, puttUpdate } from "./types";
import dotenv from "dotenv";
import { checkHeaders, getUserIdFromPath } from "./utilities";

dotenv.config();
const app = express();
app.use(express.json()); // For reading request bodies as json

// --- CORS ---
app.use(function (request: Request, response: Response, next: NextFunction) {
  response.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CORS_ALLOWED_ORIGIN
  );
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET, PUT, POST, DELETE, PATCH, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With, throwdata"
  );
  // allow preflight
  if (request.method === "OPTIONS") {
    response.sendStatus(200);
  } else {
    next();
  }
});

const port = 8081;
const hostname = "127.0.0.1";

// --- Endpoints ---
let connection: Connection | undefined = undefined;

// Returns all putt results for a user
app.get(
  "/putt-results/:userId",
  async (request: Request, response: Response) => {
    if (checkHeaders(request)) {
      if (!connection) {
        connection = await createConnection();
      }
      const userId = getUserIdFromPath(request);
      let allPuttResults = await queryAllPuttResults(connection, userId);
      // Recreate db connection if shouldDoDbReconnect === true and redo the query.
      if (allPuttResults.shouldRecreateDatabaseConnection) {
        connection = await createConnection();
        allPuttResults = await queryAllPuttResults(connection, userId);
      }
      response.end(JSON.stringify(allPuttResults.result));
    }
    response.status(401);
    response.end();
  }
);

// Creates a new row to the db to puttResult table
app.post("/mark-putt", async (request: Request, response: Response) => {
  if (checkHeaders(request)) {
    if (!connection) {
      connection = await createConnection();
    }
    const puttData: newPuttInsert | undefined = request.body;
    if (puttData) {
      console.log(
        "Inserting a new row into puttResult table: " + JSON.stringify(puttData)
      );
      let insertResult = await insertNewPuttResult(connection, puttData);
      // Recreate db connection if shouldDoDbReconnect === true and redo the query.
      if (insertResult.shouldRecreateDatabaseConnection) {
        connection = await createConnection();
        insertResult = await insertNewPuttResult(connection, puttData);
      }
      response.end(JSON.stringify(insertResult.result));
    } else {
      response.end("Error marking a putt: No putt data in the request body");
    }
  }
  response.status(401);
  response.end();
});

// Undo the last putt result that is not undone for a user. Returns the undone putt or true, if no there is no putt to to undo.
app.patch(
  "/undo-putt/:userId",
  async (request: Request, response: Response) => {
    if (checkHeaders(request)) {
      if (!connection) {
        connection = await createConnection();
      }
      const userId = getUserIdFromPath(request);
      let undoResult = await undoLastPutt(connection, userId);
      // Recreate db connection if shouldDoDbReconnect === true and redo the query.
      if (undoResult.shouldRecreateDatabaseConnection) {
        connection = await createConnection();
        undoResult = await undoLastPutt(connection, userId);
      }
      response.end(JSON.stringify(undoResult.result));
    }
    response.status(401);
    response.end();
  }
);

// Returns all users
app.get("/users", async (request: Request, response: Response) => {
  if (checkHeaders(request)) {
    if (!connection) {
      connection = await createConnection();
    }
    let allUsers = await queryAllUsers(connection);
    // Recreate db connection if shouldDoDbReconnect === true and redo the query.
    if (allUsers.shouldRecreateDatabaseConnection) {
      connection = await createConnection();
      allUsers = await queryAllUsers(connection);
    }
    response.end(JSON.stringify(allUsers.result));
  }
  response.status(401);
  response.end();
});

// Update a putt result. Returns true if succeeds, false otherwise.
app.patch("/update-putt", async (request: Request, response: Response) => {
  if (checkHeaders(request)) {
    if (!connection) {
      connection = await createConnection();
    }
    const puttUpdate: puttUpdate | undefined = request.body;
    if (puttUpdate) {
      console.log("Updating an existing putt: " + JSON.stringify(puttUpdate));
      let updateResult = await updatePuttResult(connection, puttUpdate);

      // Recreate db connection if shouldDoDbReconnect === true and redo the query.
      if (updateResult.shouldRecreateDatabaseConnection) {
        connection = await createConnection();
        updateResult = await updatePuttResult(connection, puttUpdate);
      }

      response.end(JSON.stringify(updateResult.result));
    } else {
      response.end("Error marking a putt: No putt data in the request body");
    }
  }
  response.status(401);
  response.end();
});

app.listen(port, () => {
  console.log(
    "Putt stats API app listening at http://%s:%s . Allowing API calls from %s (%s)",
    hostname,
    port,
    process.env.CORS_ALLOWED_ORIGIN,
    process.env.NODE_ENV
  );
});
