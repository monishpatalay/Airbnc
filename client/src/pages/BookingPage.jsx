import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddressLink from "../AddressLink";
import PlaceGallery from "../PlaceGallery";
import BookingDates from "../BookingDates";

export default function BookingPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`/bookings`)
        .then((response) => {
          const foundBooking = response.data.find(({ _id }) => _id === id);
          if (foundBooking) {
            setBooking(foundBooking);
          }
        })
        .catch(() => {});
    }
  }, [id]);

  if (!booking) return null;

  return (
    <div className="my-8">
      <h1 className="font-display text-3xl">{booking.place?.title || "Listing no longer available"}</h1>
      {booking.place?.address && <AddressLink className="my-2">{booking.place.address}</AddressLink>}

      <div className="bg-surface-alt p-6 my-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Your booking is confirmed</h2>
          <BookingDates booking={booking} />
        </div>
        <div className="bg-primary p-5 text-white rounded-2xl text-center shrink-0">
          <div className="text-xs uppercase tracking-wide opacity-80">Total price</div>
          <div className="text-2xl font-bold">${booking.price}</div>
        </div>
      </div>

      {booking.place && <PlaceGallery place={booking.place} />}
    </div>
  );
}
