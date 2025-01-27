import type { Maybe } from "./types";

export const makeClassString = (
  ...classNames: (Maybe<string> | boolean)[]
): string => classNames.filter((className) => className).join(" ");
