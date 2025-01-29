import type { Maybe } from "./models/common";
import type { Reservation, UserReservation } from "./models/Reservation";

export const formatDate = (date: Date): string => {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const formatDateFromReservation = (
  reservation: Reservation | UserReservation
): string => {
  const [date] = reservation.start_date.split(" ");

  return date;
};

export const formatHoursFromReservation = (
  reservation: Reservation | UserReservation
): string => {
  const [, startHour] = reservation.start_date.split(" ");
  const [, endHour] = reservation.end_date.split(" ");

  return `${startHour} - ${endHour}`;
};

export const makeClassString = (
  ...classNames: (Maybe<string> | boolean)[]
): string => classNames.filter((className) => className).join(" ");
