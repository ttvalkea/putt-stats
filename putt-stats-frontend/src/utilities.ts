import { PuttType } from "./constants";

export const getPuttTypeFromLocalStorage = (): PuttType | undefined => {
  const puttTypeFromLocalStorage = localStorage.getItem("puttType");
  if (puttTypeFromLocalStorage) {
    // Maybe add a check for the parsed int to match the existing enums?
    const puttType = parseInt(puttTypeFromLocalStorage);
    return puttType;
  }
  return undefined;
};

export const getUserIdFromLocalStorage = (): number | undefined => {
  const userIdFromLocalStorage = localStorage.getItem("userId");
  if (userIdFromLocalStorage) {
    const userId = parseInt(userIdFromLocalStorage);
    return userId;
  }
  return undefined;
};
