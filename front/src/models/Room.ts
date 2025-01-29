export interface RoomReservation {
  start_date: string;
  end_date: string;
  name: string;
  surname: string;
}

export interface Room {
  id?: number;
  number: string;
  capacity: number;
  equipment: string;
  is_active?: boolean;
  reservations: RoomReservation[];
}
