import { PuttType } from "./constants";

export type apiPuttResult = {
  distance: number;
  isMade: boolean;
  isUndone: boolean;
  name: string;
  puttResultId: number;
  puttTimestamp: string;
  userId: number;
  type: PuttType;
};

export type newPuttInsert = {
  distance: number;
  isMade: boolean;
  userId: number;
  type: PuttType;
};

export type user = {
  userId: number;
  name: string;
};
