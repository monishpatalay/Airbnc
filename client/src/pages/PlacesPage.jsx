import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "../PlaceImg";
import { useStaggerReveal } from "../lib/animations.js";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  useStaggerReveal(listRef, "[data-row]", [places]);

  useEffect(() => {
    axios
      .get("/user-places")
      .then((response) => setPlaces(response.data))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-2xl">Your accommodations</h1>
        <Link
          className="inline-flex bg-primary gap-2 text-white py-2.5 px-5 rounded-full font-medium shadow-soft hover:bg-primary-dark hover:shadow-lifted transition-all"
          to="/account/places/new"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
            />
          </svg>
          Add new place
        </Link>
      </div>

      <div ref={listRef} className="mt-8 space-y-4">
        {!loading && places.length === 0 && (
          <div className="text-center py-16 text-ink/50">
            You haven&apos;t listed any places yet.
          </div>
        )}
        {places.map((place) => (
          <Link
            data-row
            key={place._id}
            to={"/account/places/" + place._id}
            className="border border-black/5 bg-white cursor-pointer rounded-2xl p-4 shadow-soft hover:shadow-lifted transition-shadow flex gap-4 items-center card-hover"
          >
            <div className="flex h-28 w-28 shrink-0 bg-surface-alt rounded-xl overflow-hidden">
              <PlaceImg place={place} />
            </div>
            <div className="grow-0 shrink min-w-0">
              <h2 className="text-lg font-semibold truncate">{place.title}</h2>
              <p className="text-sm text-ink/50 mt-1 line-clamp-2">{place.description}</p>
              <p className="text-sm font-semibold mt-2">${place.price} <span className="text-ink/40 font-normal">/ night</span></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
