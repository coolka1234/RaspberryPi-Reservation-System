export interface Room {
  id?: number;
  number: string;
  capacity: number;
  equipment: string;
  is_active?: boolean;
}
