export interface Reservation {
  id: number;
  fk_user: number;
  fk_room: number;
  start_date: string;
  end_date: string;
  is_realized: boolean;
  is_finalized: boolean;
  name: string;
  surname: string;
}
