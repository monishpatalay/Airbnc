import { useEffect, useRef, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";
import { useStaggerReveal } from "../lib/animations.js";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  useStaggerReveal(listRef, "[data-row]", [bookings]);

  useEffect(() => {
    axios
      .get("/bookings")
      .then((response) => setBookings(response.data || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="py-10">
        <h1 className="font-display text-2xl text-center mb-8">My bookings</h1>

        {!loading && bookings.length === 0 && (
          <p className="text-center text-ink/50 mt-4">You have no bookings yet.</p>
        )}

        <div ref={listRef} className="max-w-3xl mx-auto space-y-4">
          {bookings.map((booking) => (
            <Link
              data-row
              to={`/account/bookings/${booking._id}`}
              className="flex gap-4 bg-white border border-black/5 rounded-2xl overflow-hidden shadow-soft hover:shadow-lifted transition-shadow card-hover"
              key={booking._id}
            >
              <div className="w-36 sm:w-48 shrink-0">
                <PlaceImg place={booking.place} className="w-full h-full object-cover" />
              </div>
              <div className="py-4 pr-4 px-2 grow min-w-0">
                <h2 className="text-lg font-semibold truncate">{booking.place.title}</h2>
                <BookingDates booking={booking} className="mt-2 text-ink/50" />
                <div className="flex mt-3 gap-1.5 items-center">
                  <span className="text-lg font-bold text-primary">${booking.price}</span>
                  <span className="text-sm text-ink/40">total</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
