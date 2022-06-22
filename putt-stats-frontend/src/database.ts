import axios from "axios";
import { defaultUserId } from "./constants";
import { apiPuttResult, newPuttInsert, user } from "./types";
import { getUserIdFromLocalStorage } from "./utilities";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_DATABASE_URL,
  headers: {
    "Content-type": "application/json",
  },
});

const headerConfiguration = {
  headers: {
    throwdata: true,
  },
};

const getPuttResults = async (): Promise<apiPuttResult[] | undefined> => {
  try {
    const userId = getUserIdFromLocalStorage() ?? defaultUserId;
    const res = await axiosInstance.get(
      `/putt-results/${userId}`,
      headerConfiguration
    );
    const result = {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    };
    console.log(result);
    return result.data;
  } catch (err) {
    console.log("Error occured on 'getPuttResults'");
    return undefined;
  }
};

const markNewPuttResult = async (puttData: newPuttInsert): Promise<any> => {
  try {
    const res = await axiosInstance.post(
      "/mark-putt",
      puttData,
      headerConfiguration
    );
    const result = {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    };
    console.log(result);
    return result.data;
  } catch (err) {
    console.log("Error occured on 'markNewPuttResult'");
    return undefined;
  }
};

const undoLastPuttResult = async (): Promise<any> => {
  const userId = getUserIdFromLocalStorage() ?? defaultUserId;
  try {
    const result = await axiosInstance.patch(
      `/undo-putt/${userId}`,
      undefined,
      headerConfiguration
    );
    console.log(result);
    return result.data;
  } catch (err) {
    console.log("Error occured on 'undoLastPuttResult'");
    return undefined;
  }
};

const getUsers = async (): Promise<user[] | undefined> => {
  try {
    const res = await axiosInstance.get("/users", headerConfiguration);
    const result = {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
    };
    console.log(result);
    return result.data;
  } catch (err) {
    console.log("Error occured on 'getUsers'");
    return undefined;
  }
};

export { getPuttResults, markNewPuttResult, undoLastPuttResult, getUsers };
