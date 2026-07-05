import { useState, useContext, useEffect, useRef } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import gsap from "gsap";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [noOfGuests, setNoOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(UserContext);
  const priceRef = useRef(null);
  const nameSeeded = useRef(false);

  useEffect(() => {
    if (user && !nameSeeded.current) {
      nameSeeded.current = true;
      setName(user.name);
    }
  }, [user]);

  let numberOfDays = 0;
  if (checkIn && checkOut) {
    numberOfDays = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }
  const totalPrice = numberOfDays * place.price;

  useEffect(() => {
    if (priceRef.current && totalPrice > 0) {
      gsap.fromTo(
        priceRef.current,
        { scale: 1.08 },
        { scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [totalPrice]);

  const canBook = numberOfDays > 0 && name.trim() && mobile.trim();

  async function bookThisPlace() {
    if (!canBook || submitting) return;
    setError("");
    setSubmitting(true);
    try {
      const response = await axios.post("/bookings", {
        place: place._id,
        price: totalPrice,
        user: user?._id,
        checkIn,
        checkOut,
        noOfGuests,
        name,
        mobile,
      });
      setRedirect(`/account/bookings/${response.data._id}`);
    } catch {
      setError("Something went wrong while booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="bg-white shadow-lifted border border-black/5 p-6 rounded-3xl sticky top-24">
      <div className="mb-4 flex items-baseline justify-center gap-1">
        <span ref={priceRef} className="text-2xl font-semibold inline-block">${place.price}</span>
        <span className="text-ink/50 text-sm">/ night</span>
      </div>

      {error && (
        <div className="mb-3 rounded-2xl bg-primary-light text-primary-dark text-sm px-4 py-2.5">
          {error}
        </div>
      )}

      <div className="border border-black/10 rounded-2xl overflow-hidden">
        <div className="flex">
          <div className="p-3 w-full">
            <label htmlFor="booking-checkin" className="block text-xs font-semibold uppercase tracking-wide text-ink/40">Check-in</label>
            <input
              id="booking-checkin"
              type="date"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              className="w-full !my-1 !p-0 border-none"
            />
          </div>
          <div className="p-3 border-l border-black/10 w-full">
            <label htmlFor="booking-checkout" className="block text-xs font-semibold uppercase tracking-wide text-ink/40">Check-out</label>
            <input
              id="booking-checkout"
              type="date"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              className="w-full !my-1 !p-0 border-none"
            />
          </div>
        </div>
        <div className="p-3 border-t border-black/10">
          <label htmlFor="booking-guests" className="block text-xs font-semibold uppercase tracking-wide text-ink/40">Guests</label>
          <input
            id="booking-guests"
            type="number"
            min={1}
            max={place.maxGuests}
            value={noOfGuests}
            onChange={(ev) => setNoOfGuests(ev.target.value)}
            className="w-full !my-1 !p-0 border-none"
          />
        </div>
        {numberOfDays > 0 && (
          <div className="p-3 border-t border-black/10">
            <label htmlFor="booking-name" className="block text-xs font-semibold uppercase tracking-wide text-ink/40">Full name</label>
            <input
              id="booking-name"
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              className="w-full !my-1 !p-0 border-none"
            />
            <label htmlFor="booking-phone" className="block text-xs font-semibold uppercase tracking-wide text-ink/40 mt-2">Phone</label>
            <input
              id="booking-phone"
              type="tel"
              value={mobile}
              onChange={(ev) => setMobile(ev.target.value)}
              className="w-full !my-1 !p-0 border-none"
            />
          </div>
        )}
      </div>

      <button
        onClick={bookThisPlace}
        disabled={!canBook || submitting}
        className="btn-primary mt-4"
      >
        {submitting
          ? "Booking…"
          : numberOfDays > 0
          ? <>Book this place &middot; {numberOfDays} nights &middot; ${totalPrice}</>
          : "Select dates to book"}
      </button>
    </div>
  );
}
