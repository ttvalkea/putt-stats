export enum PuttResult {
  Make = 1,
  Miss = 2,
}

export enum PuttType {
  Test = 1,
  Practice = 2,
  Competition = 3,
  Unknown = 4,
}

// Used when the user hasn't made a user selection yet, so no userId exists in localstorage
export const defaultUserId = 1;

// Used when the user hasn't made a putt type selection yet, so no puttType exists in localstorage
export const defaultPuttType = PuttType.Practice;
