import "./RoomBox.css";

function RoomBox({ number }) {
  return (
    <div className="room-box room-box-taken">
      <div className="fs-3">Sala</div>
      <div className="fs-1 fw-bold">{number}</div>
    </div>
  );
}

export { RoomBox };
