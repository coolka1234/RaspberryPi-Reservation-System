export const FETCH_KEYS = {
  AddReservationRoom: "fetchAddReservationRoom",
  ArchivedReservations: "fetchArchivedReservations",
  ArchivedReservationsRoom: "fetchArchivedReservationRoom",
  Reservations: "fetchReservations",
  Room: "fetchRoom",
  Rooms: "fetchRooms",
} as const;

export const API_URLS = {
  Reservations: "/reservations",
  Rooms: "/rooms",
} as const;
