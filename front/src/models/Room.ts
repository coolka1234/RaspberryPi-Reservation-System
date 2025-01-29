import type { ObjectValues } from "./common";

export const ROOM_STATUS = {
  Free: "free",
  Taken: "taken",
  Overtime: "overtime",
} as const;
export type RoomStatus = ObjectValues<typeof ROOM_STATUS>;

export interface RoomReservation {
  start_date: string;
  end_date: string;
  name: string;
  surname: string;
  is_realized: boolean;
  is_finalized: boolean;
}

export interface Room {
  id?: number;
  number: string;
  capacity: number;
  equipment: string;
  is_active?: boolean;
  reservations: RoomReservation[];
  status: RoomStatus;
}
