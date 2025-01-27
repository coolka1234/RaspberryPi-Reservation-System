import type { Maybe } from "./types";

export const formatDate = (date: Date): string => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const makeClassString = (
  ...classNames: (Maybe<string> | boolean)[]
): string => classNames.filter((className) => className).join(" ");
