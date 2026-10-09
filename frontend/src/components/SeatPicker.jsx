function SeatPicker({ train, selectedSeat, onSelect }) {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex gap-4 text-sm text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded border border-green-600 bg-white inline-block"></span>
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-red-700 inline-block"></span>
          Selected
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-4 rounded bg-gray-300 inline-block"></span>
          Booked
        </span>
      </div>

      {train.coaches.map((coach) => (
        <div key={coach._id} className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-bold">Coach {coach.coachNumber}</h3>
            <span
              className={
                coach.coachClass === 'First'
                  ? 'text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-800'
                  : 'text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800'
              }
            >
              {coach.coachClass} Class
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {coach.seats.map((seat) => {
              const isSelected = selectedSeat?.seat._id === seat._id;

              let seatStyle =
                'w-12 h-12 rounded-lg font-semibold bg-white border border-green-600 text-green-700 hover:bg-green-50';
              if (seat.isBooked) {
                seatStyle =
                  'w-12 h-12 rounded-lg font-semibold bg-gray-300 text-gray-500 cursor-not-allowed';
              } else if (isSelected) {
                seatStyle = 'w-12 h-12 rounded-lg font-semibold bg-red-700 text-white';
              }

              return (
                <button
                  key={seat._id}
                  disabled={seat.isBooked}
                  onClick={() => onSelect({ train, coach, seat })}
                  className={seatStyle}
                >
                  {seat.seatNumber}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SeatPicker; 